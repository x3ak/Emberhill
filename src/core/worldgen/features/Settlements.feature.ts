import type {Settlement, Tile, Village, WorldMap} from "@/shared/types/world.types.ts";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";
import {Territories} from "@/core/worldgen/features/Territories.feature.ts";

const PLACEMENT_CONFIG = {
    NUM_CAPITALS: 10,
    MIN_DISTANCE_BETWEEN_CAPITALS: 150, // Tiles
    NUM_VILLAGES_PER_CAPITAL: 5, // Tiles
    MIN_DISTANCE_BETWEEN_VILLAGES: 15, // Tiles
};

// A simple type for our scored tiles
type ScoredTile = {
    tile: Tile;
    score: number;
};

export class Settlements extends WorldGenerationFeature {
    private landTiles: ScoredTile[] = [];

    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
    }

    public execute() {
        this.scoreAllLandTiles();

        this.placeCapitals();

        const territoriesFeature = new Territories(this.worldMap, this.seed);
        territoriesFeature.execute(); // run to get territories to capitals

        this.placeVillages();
    }

    // --- Private Helper Methods ---

    private scoreAllLandTiles(): void {
        for (let tile of this.worldMap.grid.allTiles()) {
            if (tile.terrain === 'PLAINS' || tile.terrain === 'FOREST') {
                this.landTiles.push({ tile, score: this.worldMap.grid.calculateTileDesirability(tile) });
            }
        }

        this.landTiles.sort((a, b) => b.score - a.score); // Sort descending
    }


    private placeCapitals(): void {
        for (const scoredTile of this.landTiles) {
            // Stop once we've placed enough settlements.
            if (this.worldMap.settlements.length >= PLACEMENT_CONFIG.NUM_CAPITALS) {
                break;
            }

            const candidateTile = scoredTile.tile;

            // --- Enforce Spacing ---
            const isTooClose = this.worldMap.settlements.some(existingSettlement => {
                const dx = Math.abs(existingSettlement.x - candidateTile.x);
                const dy = Math.abs(existingSettlement.y - candidateTile.y);
                const distance = Math.sqrt(dx*dx + dy*dy); // Euclidean distance
                return distance < PLACEMENT_CONFIG.MIN_DISTANCE_BETWEEN_CAPITALS;
            });

            if (!isTooClose) {
                // This spot is good. Place the settlement.
                const newSettlement: Settlement = {
                    x: candidateTile.x,
                    y: candidateTile.y,
                    id: `settlement_${this.worldMap.settlements.length}`,
                    name: "Unnamed Settlement", // Naming comes later
                    connections: [],
                };

                this.worldMap.settlements.push(newSettlement);
                // Mark the tile so we know a settlement is here
                candidateTile.settlement = newSettlement;
            }
        }
    }

    private placeVillages(): void {

        const settlementVillages = new Map<string, number>(); // track number of villages placed

        this.landTiles.forEach(candidateScoredTile => {
            const candidateTile = candidateScoredTile.tile;
            if (!candidateTile.territoryOf) {
                return;
            }

            const tileOwnerId = candidateTile.territoryOf.id;

            let amountPlacedForThisCapital = settlementVillages.get(tileOwnerId) || 0;
            if (amountPlacedForThisCapital >= PLACEMENT_CONFIG.NUM_VILLAGES_PER_CAPITAL) {
                return;
            }

            const isTooCloseToCapital = this.worldMap.settlements.some(existingCapital => {
                const dx = Math.abs(existingCapital.x - candidateTile.x);
                const dy = Math.abs(existingCapital.y - candidateTile.y);
                const distance = Math.sqrt(dx*dx + dy*dy); // Euclidean distance
                return distance < PLACEMENT_CONFIG.MIN_DISTANCE_BETWEEN_VILLAGES;
            });

            const isTooCloseToOtherVillage = this.worldMap.villages.some(existingVillage => {
                const dx = Math.abs(existingVillage.x - candidateTile.x);
                const dy = Math.abs(existingVillage.y - candidateTile.y);
                const distance = Math.sqrt(dx*dx + dy*dy); // Euclidean distance
                return distance < PLACEMENT_CONFIG.MIN_DISTANCE_BETWEEN_VILLAGES;
            });

            if (isTooCloseToCapital || isTooCloseToOtherVillage) {
                return;
            }

            // This spot is good. Place the settlement.
            const village: Village = {
                x: candidateTile.x,
                y: candidateTile.y,
                id: `village_${this.worldMap.villages.length}`,
                name: `Unnamed Village [${this.worldMap.villages.length}]`, // Naming comes later
                capital: candidateTile.territoryOf,
                specialization: "NOTHING",
            };

            this.worldMap.villages.push(village);
            // Mark the tile so we know a settlement is here
            candidateTile.village = village;

            settlementVillages.set(tileOwnerId, amountPlacedForThisCapital + 1)



        })

    }
}
