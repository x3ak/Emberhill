import type {Settlement, Tile, WorldMap} from "@/shared/types/world.types.ts";

export class TerritoryExpander {
    private map: WorldMap;
    private foundingSettlements: Settlement[];

    constructor(map: WorldMap, foundingSettlements: Settlement[]) {
        this.map = map;
        this.foundingSettlements = foundingSettlements;
    }

    /**
     * The main public method that runs the expansion simulation.
     * It MUTATES the tiles in the provided WorldMap.
     */
    public expandTerritories(): void {
        const queue: Tile[] = this.initializeQueue();

        // This loop simulates the expansion, ring by ring.
        while (queue.length > 0) {
            const currentTile = queue.shift()!; // Dequeue the next tile

            if (!currentTile.territoryOf) {
                continue;
            }

            const settlement = currentTile.territoryOf;


            // Check its neighbors
            for (const neighbor of this.map.grid.getTilesInRadius(currentTile, 1)) {
                if (!this.isClaimable(neighbor, settlement)) {
                    continue;
                }

                neighbor.territoryOf = settlement;
                queue.push(neighbor);
            }


        }
    }

    private isClaimable(tile: Tile, settlement: Settlement): boolean {

        if (tile.territoryOf !== undefined) {
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

        if (this.distance(tile, settlement.tile) > 7) {
            return false;
        }

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