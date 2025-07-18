import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";
import type {
    Settlement,
    TerrainType,
    Tile,
    Village,
    VillageSpecialization,
    WorldMap
} from "@/shared/types/world.types.ts";
import {createSeededRNG} from "@/core/worldgen/utils/rng.ts";

const TerrainTypeSpecialization: {[key in TerrainType]?: VillageSpecialization[]} = {
    DEEP_OCEAN: ["FARMING"],
    COASTAL_WATER: ["FARMING"],
    BEACH: ["FARMING"],
    PLAINS: ["FARMING"],
    FOREST: ["FARMING", "WOODCUTTING"],
    JUNGLE: ["FARMING", "WOODCUTTING"],
    SAVANNA: [],
    TAIGA: [],
    DESERT: [],
    TUNDRA: [],
    MOUNTAIN: ['MINING'],
    SNOWY_MOUNTAIN: ['MINING'],
}

export default class VillageProductionFeature extends WorldGenerationFeature {
    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
    }

    execute() {
        const rng = createSeededRNG(this.seed);

        this.worldMap.villages.forEach(village => {

            if (!village.capital) return;

            const nationSpecializations = new Set(this.getNationSpecializations(village.capital))

            const specializationVariants = this.getVillageSpecializationVariants(village);

            // try to assign a new unique specialization to the village (unique in the nation)
            let variantAssigned = false;
            for (const variant of specializationVariants) {
                if (!nationSpecializations.has(variant)) {
                    village.specialization = variant;
                    variantAssigned = true;
                    break;
                }
            }

            // if no unique specializations, assign a random one
            if (!variantAssigned) {
                village.specialization = Array.from(specializationVariants)[Math.floor(rng() * specializationVariants.size)];
            }
        });
    }

    private getNationSpecializations(capital: Settlement): VillageSpecialization[] {
        return this.worldMap.villages
            .filter(village => village.capital && village.capital?.id == capital.id)
            .map(village => {
                return village.specialization
            })
    }

    private getVillageSpecializationVariants(village: Village): Set<VillageSpecialization> {
        const villageTile = this.worldMap.grid.getTile(village.y, village.x);
        return new Set(
            this.worldMap.grid.getTilesInRadius(villageTile, 2)
                .map(tile => {
                    return this.getTileSpecialization(tile);
                })
        );

    }

    private getTileSpecialization(tile: Tile): VillageSpecialization {
        const rng = createSeededRNG(this.seed);
        const specializationVariants = TerrainTypeSpecialization[tile.terrain] || [];
        if (specializationVariants.length > 0) {
            return specializationVariants[Math.floor(rng() * specializationVariants.length)];
        }

        return "NOTHING";

    }
}