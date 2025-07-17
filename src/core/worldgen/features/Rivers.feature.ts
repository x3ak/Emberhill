import type {RandomFn} from "simplex-noise";
import {createSeededRNG} from "@/core/worldgen/utils/rng";
import type {Tile, WorldMap} from "@/shared/types/world.types";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature";
import {MAP_CONFIG} from "@/core/worldgen/config.ts";

export class Rivers extends WorldGenerationFeature {
    private readonly rng: RandomFn;

    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
        this.rng = createSeededRNG(this.seed + '_rivers')
    }

    public execute() {
        const RIVER_COUNT = Math.floor((MAP_CONFIG.WIDTH * MAP_CONFIG.HEIGHT) / 1000);
        const RIVER_SPACING_RADIUS = 15;

        for (let riverId = 0; riverId < RIVER_COUNT; riverId++) {
            let riverStart: Tile | null = null;
            let attempts = 0;

            // Try up to 50 times to find a suitable, isolated starting point.
            while (attempts < 50) {

                const randomX = Math.floor(this.rng() * MAP_CONFIG.WIDTH);
                const randomY = Math.floor(this.rng() * MAP_CONFIG.HEIGHT);
                const potentialStart = this.worldMap.grid.getTile(randomY, randomX);

                const isOnMountain = potentialStart.terrain === 'MOUNTAIN' || potentialStart.terrain === 'SNOWY_MOUNTAIN';
                const isIsolated = !this.worldMap.grid.hasNeighbouringRiver(potentialStart, RIVER_SPACING_RADIUS);

                if (isOnMountain && isIsolated) {
                    riverStart = potentialStart;
                    break; // We found a good spot!
                }

                attempts++;
            }

            if (!riverStart) {
                continue;
            }

            this.carveRiverFrom(riverId, riverStart);
        }
    }

    private carveRiverFrom(riverId: number, riverStart: Tile): void {
        const maxRiverLength = riverId == 1 ? 1000 : 100;

        let currentTile = riverStart;
        // Carve path downhill
        for (let j = 0; j < maxRiverLength; j++) {
            if (currentTile.isRiver && currentTile.riverId != riverId) {
                break;
            }

            if (currentTile.terrain === 'DEEP_OCEAN') {
                break;
            }

            if (currentTile.terrain === 'COASTAL_WATER') {
                break;
            }

            currentTile.riverId = riverId;
            currentTile.isRiver = true;

            const lowestNeighbor = this.findRiverBedNextStep(currentTile) //findLowestNeighbor(currentTile, grid);

            // we've hit a plateau, no way down, maybe a lake should be here?
            if (!lowestNeighbor) {


                const spillway = this.floodFillLake(riverId, currentTile);
                if (spillway) {
                    this.carveRiverFrom(riverId, spillway);
                }

                break;

            } else {
                currentTile = lowestNeighbor;
            }


        }


    }


    private findRiverBedNextStep(tile: Tile): Tile | null {
        const FLOW_CONFIG = {
            // If multiple paths are available, how close does a path's elevation need to be
            // to the absolute best path to be considered a "good" option? (e.g., within 1%)
            AMBIGUITY_TOLERANCE: 0.01,

            // If the best path is this much steeper than the second-best path,
            // we will always choose it greedily. (e.g., a 5% steeper drop)
            GREED_THRESHOLD: 0.05,
        };

        const downhillNeighbors: Tile[] = [];
        for (const neighbor of this.worldMap.grid.getTilesInRadius(tile, 1)) {
            // We no longer filter by `isRiver` here. That check happens in the main carving loop.
            if (neighbor.elevation < tile.elevation) {
                downhillNeighbors.push(neighbor);
            }
        }

        if (downhillNeighbors.length === 0) {
            return null; // We are stuck in a basin.
        }

        if (downhillNeighbors.length === 1) {
            return downhillNeighbors[0]; // Only one way to go.
        }

        downhillNeighbors.sort((a, b) => a.elevation - b.elevation);
        const bestPath = downhillNeighbors[0];
        const secondBestPath = downhillNeighbors[1];

        if (bestPath.elevation < secondBestPath.elevation - FLOW_CONFIG.GREED_THRESHOLD) {
            // Yes, it's a steep drop. Be greedy and take it.
            return bestPath;
        }

        // B) Random Choice: The slope is gentle and ambiguous.
        // Create a pool of all "good enough" candidates.
        const candidatePool = downhillNeighbors.filter(
            neighbor => neighbor.elevation < bestPath.elevation + FLOW_CONFIG.AMBIGUITY_TOLERANCE
        );

        // Randomly pick one from the pool.
        const randomIndex = Math.floor(this.rng() * candidatePool.length);
        return candidatePool[randomIndex];

    }

    private floodFillLake(riverId: number, startTile: Tile): Tile | null {
        const MAX_LAKE_SIZE = 50; // Prevents excessively large lakes

        // The set of tiles that are part of the lake. Using a Set is efficient for `has()` checks.
        const lakeTiles = new Set<Tile>();
        // A queue for our Breadth-First Search (BFS) flood fill algorithm.
        const queue: Tile[] = [startTile];
        // We mark the starting tile as part of the lake immediately to avoid re-processing it.
        const processed = new Set<Tile>([startTile]);

        // The "rim" contains all land tiles that border the current lake, potential spillways.
        const rimTiles = new Set<Tile>();

        while (queue.length > 0) {
            if (lakeTiles.size >= MAX_LAKE_SIZE) break;

            const currentTile = queue.shift()!; // Get the next tile to process from the front of the queue

            // This tile is officially part of the lake now.
            lakeTiles.add(currentTile);

            currentTile.isRiver = true;
            currentTile.isLake = true;
            currentTile.terrain = 'COASTAL_WATER';
            currentTile.riverId = riverId;

            // Check all 8 neighbors
            for (const neighbor of this.worldMap.grid.getTilesInRadius(currentTile, 1)) {
                // If we have already processed this neighbor, skip it.
                if (processed.has(neighbor)) {
                    continue;
                }
                processed.add(neighbor); // Mark it as processed so we don't check it again.

                // If the neighbor is lower than or at the same elevation as the starting tile,
                // it's part of the same basin and should also be filled with water.
                if (neighbor.elevation <= startTile.elevation + 0.015) {
                    queue.push(neighbor);
                } else {
                    // Otherwise, this neighbor is higher and part of the "rim" of the lake.
                    rimTiles.add(neighbor);
                }
            }
        }


        // If we didn't find any tiles on the rim, it's a completely enclosed hole.
        if (rimTiles.size === 0) {
            // Mark all discovered lake tiles and terminate the river.


            return null; // No spillway
        }

        // --- Find the single lowest point on the entire rim ---
        let spillway: Tile | null = null;
        let lowestElevation = Infinity;

        rimTiles.forEach(tile => {
            if (tile.elevation < lowestElevation) {
                lowestElevation = tile.elevation;
                spillway = tile;
            }
        });

        // Return the single lowest exit point.
        return spillway;
    }
}
