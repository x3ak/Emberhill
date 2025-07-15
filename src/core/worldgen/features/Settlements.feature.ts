import type {Settlement, Tile, WorldMap} from "@/shared/types/world.types.ts";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";

const PLACEMENT_CONFIG = {
    NUM_FOUNDING_SETTLEMENTS: 7,
    MIN_DISTANCE_BETWEEN_SETTLEMENTS: 150, // Tiles
};

// A simple type for our scored tiles
type ScoredTile = {
    tile: Tile;
    score: number;
};

export class Settlements extends WorldGenerationFeature {
    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
    }

    public execute() {
        const scoredTiles = this.scoreAllLandTiles();
        this.sortTilesByScore(scoredTiles);
        this.selectAndPlaceSettlements(scoredTiles);
    }

    // --- Private Helper Methods ---

    private scoreAllLandTiles(): ScoredTile[] {
        const landTiles: ScoredTile[] = [];

        for (let tile of this.worldMap.grid.allTiles()) {
            if (tile.terrain === 'PLAINS' || tile.terrain === 'FOREST') {
                landTiles.push({ tile, score: this.worldMap.grid.calculateTileScore(tile) });
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
            if (this.worldMap.settlements.length >= PLACEMENT_CONFIG.NUM_FOUNDING_SETTLEMENTS) {
                break;
            }

            const candidateTile = scoredTile.tile;

            // --- Enforce Spacing ---
            const isTooClose = this.worldMap.settlements.some(existingSettlement => {
                const dx = Math.abs(existingSettlement.tile.x - candidateTile.x);
                const dy = Math.abs(existingSettlement.tile.y - candidateTile.y);
                const distance = Math.sqrt(dx*dx + dy*dy); // Euclidean distance
                return distance < PLACEMENT_CONFIG.MIN_DISTANCE_BETWEEN_SETTLEMENTS;
            });

            if (!isTooClose) {
                // This spot is good. Place the settlement.
                const newSettlement: Settlement = {
                    id: `settlement_${this.worldMap.settlements.length}`,
                    name: "Unnamed Settlement", // Naming comes later
                    tile: candidateTile,
                    connections: [],
                };

                this.worldMap.settlements.push(newSettlement);
                // Mark the tile so we know a settlement is here
                candidateTile.settlement = newSettlement;
            }
        }
    }
}
