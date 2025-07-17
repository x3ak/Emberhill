import type {Settlement, Tile, WorldMap} from '@/shared/types/world.types.ts'
import PF from "pathfinding";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";

export class Roads extends WorldGenerationFeature {
    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
    }

    /**
     * The main public method. Builds a complete, interconnected highway network
     * between all provided capital cities.
     */
    public execute(): void {
        if (this.worldMap.settlements.length < 2) {
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

        const numCapitals = this.worldMap.settlements.length;
        if (numCapitals < 2) return [];

        const allEdges: {from: number, to: number, weight: number}[] = [];

        for (let i = 0; i < numCapitals; i++) {
            for (let j = i + 1; j < numCapitals; j++) {
                const settlementA = this.worldMap.settlements[i];
                const settlementB = this.worldMap.settlements[j];
                const dx = settlementA.x - settlementB.x;
                const dy = settlementA.y - settlementB.y;
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
                    from: this.worldMap.settlements[edge.from],
                    to: this.worldMap.settlements[edge.to],
                });
                // ...and merge their sets.
                disjointSet.union(edge.from, edge.to);
            }

            // Stop when the tree is complete
            if (mstConnections.length === numCapitals - 1) break;
        }

        return mstConnections;
    }

    /**
     * Iteratively builds roads for a list of connections, updating the pathfinding
     * grid after each road is built to encourage merging.
     */
    private buildRoadsForConnections(connections: { from: Settlement; to: Settlement }[]): void {
        const pathfinder = new PF.BiAStarFinder({
            diagonalMovement: PF.DiagonalMovement.Always,
            // heuristic: PF.Heuristic.euclidean
        });

        for (const { from, to } of connections) {
            const weightMatrix = this.createWeightMatrix();

            const pfGrid = new PF.Grid(weightMatrix);

            const path = pathfinder.findPath(from.x, from.y, to.x, to.y, pfGrid);


            // 4. Pave the road on our main map data. This MUTATES the map for the next iteration.
            if (path.length > 0) {
                from.connections.push({
                    id: to.id,
                    travelCost: path.length,
                });
                to.connections.push({
                    id: from.id,
                    travelCost: path.length,
                });

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
        for (let y = 0; y < this.worldMap.height; y++) {
            matrix[y] = [];
            for (let x = 0; x < this.worldMap.width; x++) {
                const tile = this.worldMap.grid.getTile(y, x);
                matrix[y][x] = this.isWalkable(tile) ? 0 : 1;

            }
        }
        return matrix;
    }


    /**
     * Modifies the main map data, marking tiles along a path as being part of a road.
     */
    private paveRoadOnMap(path: number[][]): void {
        path.forEach(([x, y]) => {
            const tile = this.worldMap.grid.getTile(y, x);
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
