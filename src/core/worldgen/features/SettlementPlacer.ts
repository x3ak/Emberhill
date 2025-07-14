
// Configuration
import type {Settlement, Tile, WorldMap} from "@/shared/types/world.types.ts";

const PLACEMENT_CONFIG = {
    NUM_FOUNDING_SETTLEMENTS: 10,
    MIN_DISTANCE_BETWEEN_SETTLEMENTS: 50, // Tiles
};

// A simple type for our scored tiles
type ScoredTile = {
    tile: Tile;
    score: number;
};

export class SettlementPlacer {
    private map: WorldMap;
    private settlements: Settlement[] = [];

    constructor(map: WorldMap) {
        this.map = map;
    }

    /**
     * The main public method to place all founding settlements.
     */
    public placeFoundingSettlements(): Settlement[] {
        const scoredTiles = this.scoreAllLandTiles();
        this.sortTilesByScore(scoredTiles);
        this.selectAndPlaceSettlements(scoredTiles);

        return this.settlements;
    }

    // --- Private Helper Methods ---

    private scoreAllLandTiles(): ScoredTile[] {
        const landTiles: ScoredTile[] = [];

        for (let tile of this.map.grid.allTiles()) {
            if (tile.terrain === 'PLAINS' || tile.terrain === 'FOREST') {
                landTiles.push({ tile, score: this.map.grid.calculateTileScore(tile) });
            }
        }


        return landTiles;
    }

    private sortTilesByScore(scoredTiles: ScoredTile[]): void {
        scoredTiles.sort((a, b) => b.score - a.score); // Sort descending
    }

    private selectAndPlaceSettlements(sortedTiles: ScoredTile[]): void {
        for (const scoredTile of sortedTiles) {
            // Stop once we've placed enough settlements.
            if (this.settlements.length >= PLACEMENT_CONFIG.NUM_FOUNDING_SETTLEMENTS) {
                break;
            }

            const candidateTile = scoredTile.tile;

            // --- Enforce Spacing ---
            const isTooClose = this.settlements.some(existingSettlement => {
                const dx = Math.abs(existingSettlement.tile.x - candidateTile.x);
                const dy = Math.abs(existingSettlement.tile.y - candidateTile.y);
                const distance = Math.sqrt(dx*dx + dy*dy); // Euclidean distance
                return distance < PLACEMENT_CONFIG.MIN_DISTANCE_BETWEEN_SETTLEMENTS;
            });

            if (!isTooClose) {
                // This spot is good. Place the settlement.
                const newSettlement: Settlement = {
                    id: `settlement_${this.settlements.length}`,
                    name: "Unnamed Settlement", // Naming comes later
                    tile: candidateTile,
                };

                this.settlements.push(newSettlement);
                // Mark the tile so we know a settlement is here
                candidateTile.settlement = newSettlement;
            }
        }
    }
}