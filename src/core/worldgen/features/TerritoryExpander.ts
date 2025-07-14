import type {Settlement, Tile, WorldMap} from "@/shared/types/world.types.ts";
import TinyQueue from "tinyqueue";
type ScoredTile = {
    tile: Tile;
    score: number;
};

type QueueItem = {
    tile: Tile;
    cost: number;
    settlement: Settlement; // Which settlement is expanding
};

export class TerritoryExpander {
    private map: WorldMap;
    private foundingSettlements: Settlement[];

    private costSoFar: Map<Tile, number> = new Map();

    constructor(map: WorldMap, foundingSettlements: Settlement[]) {
        this.map = map;
        this.foundingSettlements = foundingSettlements;
    }

    /**
     * The main public method that runs the expansion simulation.
     * It MUTATES the tiles in the provided WorldMap.
     */
    public expandTerritories(): void {
        const frontier = new TinyQueue<QueueItem>([], (a, b) => a.cost - b.cost);
        for (const settlement of this.foundingSettlements) {
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
            for (const neighbor of this.map.grid.getTilesInRadius(current.tile , 1)) {
                if (!this.isClaimable(neighbor, current.settlement)) {
                    continue;
                }

                // Calculate the new cost to reach this neighbor.
                const movementCost = this.map.grid.getTileMovementCost(neighbor); // Your existing cost function
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

    private isClaimable(tile: Tile, settlement: Settlement): boolean {

        if (tile.territoryOf) {
            return false;
        }

        if (tile.terrain == 'DEEP_OCEAN') {
            return false;
        }

        if (tile.terrain == 'COASTAL_WATER') {
            return false;
        }

        if (tile.terrain == 'SNOWY_MOUNTAIN') {
            return false;
        }

        // if (this.distance(tile, settlement.tile) > 30) {
        //     return false;
        // }

        return true;


    }

    private distance(a: Tile, b: Tile): number  {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return  Math.sqrt(dx*dx + dy*dy); // Euclidean distance
    }

    // --- Private Helper Methods ---

    /**
     * Initializes the expansion process by setting the starting tiles' territory
     * and adding them to the processing queue.
     * @returns The initialized queue of tiles.
     */
    private initializeQueue(): Tile[] {
        const queue: Tile[] = [];

        for (const settlement of this.foundingSettlements) {
            const startTile = settlement.tile;

            if (startTile) {
                // This is the first step: claim the tile the settlement is on.
                startTile.territoryOf = settlement;
                queue.push(startTile);
            }
        }

        // It's a good idea to shuffle the initial queue to make the borders
        // look slightly more random and less "grid-like".
        // shuffle(queue); // You would need a shuffle utility function

        return queue;
    }
}