// import { Grid as PFGrid, AStarFinder }
import type {WorldMap, Settlement, Tile, SettlementConnection} from '@/shared/types/world.types.ts'
import Pathfinding from "pathfinding";
import {CanvasRenderingContext2D, createCanvas} from "canvas";
import {MAP_CONFIG} from "@/core/worldgen/MapGenerator.ts";
import fs from "fs";
import {TILE_SIZE} from "@/core/worldgen/map_renderer.ts";
// This assumes you have a getTileMovementCost method on your grid or a utility function for it.
// import { getTileMovementCost } from './utils/grid';

// --- Configuration ---
const ROAD_CONFIG = {
    // How "cheap" it is to travel on an existing road. Must be > 0.
    // A very low value encourages pathfinder to use existing roads heavily.
    ROAD_MOVEMENT_COST: 0.1,
    // For the simple connection algorithm, how many neighbors should each capital connect to?
    // 2 is a good value to ensure connectivity without too much redundancy.
    CONNECTIONS_PER_CAPITAL: 2,
    SLOPE_PENALTY_MULTIPLIER: 250,
};

export class RoadBuilder {
    private map: WorldMap;
    private capitals: Settlement[];

    constructor(map: WorldMap, capitals: Settlement[]) {
        this.map = map;
        this.capitals = capitals;
    }

    /**
     * The main public method. Builds a complete, interconnected highway network
     * between all provided capital cities.
     */
    public buildHighwayNetwork(): void {
        if (this.capitals.length < 2) {
            console.log("Not enough capitals to build a road network.");
            return;
        }

        console.log("Determining optimal highway routes...");
        const connections = this.determineHighwayConnections();
        console.log(`Planning to build ${connections.length} highway segments.`);

        console.log("Paving highways...");
        this.buildRoadsForConnections(connections);
        console.log("Highway network complete.");
    }


    private determineHighwayConnections(): { from: Settlement; to: Settlement }[] {

        const numCapitals = this.capitals.length;
        if (numCapitals < 2) return [];

        const allEdges: {from: number, to: number, weight: number}[] = [];

        for (let i = 0; i < numCapitals; i++) {
            for (let j = i + 1; j < numCapitals; j++) {
                const settlementA = this.capitals[i];
                const settlementB = this.capitals[j];
                const dx = settlementA.tile.x - settlementB.tile.x;
                const dy = settlementA.tile.y - settlementB.tile.y;
                allEdges.push({ from: i, to: j, weight: Math.sqrt(dx * dx + dy * dy) });
            }
        }

        allEdges.sort((a, b) => a.weight - b.weight);

        const disjointSet = new DisjointSet(numCapitals);
        const mstConnections: { from: Settlement; to: Settlement }[] = [];

        for (const edge of allEdges) {
            // If the vertices are not already connected...
            if (disjointSet.find(edge.from) !== disjointSet.find(edge.to)) {
                // ...add this edge to our result...
                mstConnections.push({
                    from: this.capitals[edge.from],
                    to: this.capitals[edge.to],
                });
                // ...and merge their sets.
                disjointSet.union(edge.from, edge.to);
            }

            // Stop when the tree is complete
            if (mstConnections.length === numCapitals - 1) break;
        }

        return mstConnections;

        // const connections = new Set<string>();
        // const establishedConnections: { from: Settlement; to: Settlement }[] = [];
        //
        // for (const settlementA of this.capitals) {
        //     const distances = this.capitals
        //         .filter(s => s.id !== settlementA.id)
        //         .map(settlementB => {
        //             const dx = settlementA.tile.x - settlementB.tile.x;
        //             const dy = settlementA.tile.y - settlementB.tile.y;
        //             return { settlement: settlementB, distance: Math.sqrt(dx * dx + dy * dy) };
        //         })
        //         .sort((a, b) => a.distance - b.distance);
        //
        //     for (let i = 0; i < ROAD_CONFIG.CONNECTIONS_PER_CAPITAL && i < distances.length; i++) {
        //         const settlementB = distances[i].settlement;
        //         // Create a sorted ID to prevent duplicates (e.g., A-B is the same as B-A)
        //         const connectionId = [settlementA.id, settlementB.id].sort().join('-');
        //
        //         if (!connections.has(connectionId)) {
        //             connections.add(connectionId);
        //             establishedConnections.push({ from: settlementA, to: settlementB });
        //         }
        //     }
        // }
        // return establishedConnections;
    }

    /**
     * Iteratively builds roads for a list of connections, updating the pathfinding
     * grid after each road is built to encourage merging.
     */
    private buildRoadsForConnections(connections: { from: Settlement; to: Settlement }[]): void {
        const pathfinder = new Pathfinding.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true,
        });

        for (const { from, to } of connections) {
            const weightMatrix = this.createWeightMatrix();

            this.drawWeightMap(weightMatrix);
            // return;

            const pfGrid = new Pathfinding.Grid(weightMatrix);
            for (let tile of this.map.grid.allTiles()) {
                pfGrid.setWalkableAt(tile.x, tile.y, this.isWalkable(tile));
            }

            const path = pathfinder.findPath(from.tile.x, from.tile.y, to.tile.x, to.tile.y, pfGrid);


            // 4. Pave the road on our main map data. This MUTATES the map for the next iteration.
            if (path.length > 0) {
                const connection: SettlementConnection = {
                    from: from,
                    to: to,
                    travelCost: path.length,
                }

                console.log(path.length)

                from.connections.push(connection);
                to.connections.push(connection);

                this.paveRoadOnMap(path);
            } else {
                console.error(`!!! No path found between ${from.id} and ${to.id}`);
            }
        }
        console.log("Highway network complete.");
        return

    }

    private isWalkable(tile: Tile): boolean {
        switch (tile.terrain) {
            case "SNOWY_MOUNTAIN":
            case "MOUNTAIN":
            case "DEEP_OCEAN":
                return false;

            case "COASTAL_WATER":
                return !tile.isLake;

            default:
                return true
        }
    }

    private createWeightMatrix(): number[][] {
        const matrix: number[][] = [];
        for (let y = 0; y < this.map.height; y++) {
            matrix[y] = [];
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.grid.getTile(y, x);

                // If the tile is already a road, its cost is very low.
                if (tile.isRoad) {
                    matrix[y][x] = ROAD_CONFIG.ROAD_MOVEMENT_COST;
                } else {
                    // Otherwise, get the cost from the terrain.
                    const tileMovementCost = this.map.grid.getTileMovementCost(tile);
                    matrix[y][x] = tileMovementCost + (tile.slope) * ROAD_CONFIG.SLOPE_PENALTY_MULTIPLIER;
                    // console.log(tile.slope)
                }
            }
        }
        return matrix;
    }

    public drawWeightMap = (matrix: number[][]): void => {
        const canvasWidth = MAP_CONFIG.WIDTH * TILE_SIZE;
        const canvasHeight = MAP_CONFIG.HEIGHT * TILE_SIZE;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const context: CanvasRenderingContext2D = canvas.getContext('2d');

        let maxWeight = 1; // Find the max weight for normalization
        for (const row of matrix) for (const val of row) if (val > maxWeight) maxWeight = val;

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                const weight = matrix[y][x];
                const intensity = 255 * (weight / maxWeight);
                context.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
                context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync('./weighted_matrix.png', buffer);
    }


    /**
     * Modifies the main map data, marking tiles along a path as being part of a road.
     */
    private paveRoadOnMap(path: number[][]): void {
        path.forEach(([x, y]) => {
            const tile = this.map.grid.getTile(y, x);
            if (tile) {
                tile.isRoad = true;
                // Optional: You could also slightly lower the elevation to "flatten" the road
                // tile.elevation = Math.max(tile.elevation - 0.01, 0);
            }
        });
    }

}

class DisjointSet {
    private parent: number[];
    constructor(size: number) {
        this.parent = Array.from({ length: size }, (_, i) => i);
    }
    find(i: number): number {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }
    union(i: number, j: number): void {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
        }
    }
}