import type {Settlement, Tile, WorldMap} from "@/shared/types/world.types.ts";
import TinyQueue from "tinyqueue";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";

type QueueItem = {
    tile: Tile;
    cost: number;
    settlement: Settlement; // Which settlement is expanding
};

export class Territories extends WorldGenerationFeature {
    private costSoFar: Map<Tile, number> = new Map();

    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
    }

    public execute(): void {
        const frontier = new TinyQueue<QueueItem>([], (a, b) => a.cost - b.cost);
        for (const settlement of this.worldMap.settlements) {
            const startTile = settlement.tile;
            if (startTile) {
                startTile.territoryOf = settlement;
                this.costSoFar.set(startTile, 0);
                frontier.push({ tile: startTile, cost: 0, settlement: settlement });
            }
        }

        while (frontier.length > 0) {
            // Dequeue the item with the LOWEST cost from anywhere on the frontier.
            const current = frontier.pop();
            if (!current) break; // Should not happen if length > 0

            // --- Step 3: Check Neighbors ---
            for (const neighbor of this.worldMap.grid.getTilesInRadius(current.tile , 1)) {
                // Calculate the new cost to reach this neighbor.
                const movementCost = this.worldMap.grid.getTileMovementCost(neighbor); // Your existing cost function
                const newCost = current.cost + movementCost;

                // We only process the neighbor if:
                // 1. It has never been visited before (`!this.costSoFar.has(neighbor)`).
                // 2. We have found a *cheaper path* to reach it (`newCost < this.costSoFar.get(neighbor)`).
                if (!this.costSoFar.has(neighbor) || newCost < this.costSoFar.get(neighbor)!) {
                    // Update its cost and claim the territory.
                    this.costSoFar.set(neighbor, newCost);
                    neighbor.territoryOf = current.settlement;

                    // Add it to the frontier to be expanded from later.
                    frontier.push({ tile: neighbor, cost: newCost, settlement: current.settlement });
                }
            }
        }
    }
}
