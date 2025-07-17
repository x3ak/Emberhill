import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";
import type {Tile, WorldMap} from "@/shared/types/world.types.ts";
import {createSeededRNG} from "@/core/worldgen/utils/rng.ts";

export default class VillageProductionFeature extends WorldGenerationFeature {
    constructor(worldMap: WorldMap, seed: string) {
        super(worldMap, seed);
    }

    execute() {
        this.worldMap.villages.forEach(village => {
            const villageTile = this.worldMap.grid.getTile(village.y, village.x);

            const specialization = this.getVillageSpecialization(villageTile);
            village.specialization = specialization;

        })
    }

    private getVillageSpecialization(villageTile: Tile): string {
        const variants = this.worldMap.grid.getTilesInRadius(villageTile, 2).map(tile => {
            return this.getTileSpecialization(tile);
        });
        const rng = createSeededRNG(this.seed);

        return variants[Math.floor(rng() * variants.length)];


    }

    private getTileSpecialization(tile: Tile): string {
        const specializationVariants = [];
        switch (tile.terrain) {
            case "DEEP_OCEAN":
            case "COASTAL_WATER":
            case "BEACH":
                // ideal for villages focused on sea resources.
                specializationVariants.push("fishing_village");

                break;
            case "PLAINS":
                // Fertile plains are perfect for traditional agriculture and raising livestock.
                specializationVariants.push("farming");
                specializationVariants.push("animal_husbandry");
                break;
            case "FOREST":
            case "JUNGLE":
                // Forests and jungles offer wood resources and opportunities for hunting.
                specializationVariants.push("lumberjacking");
                specializationVariants.push("hunting_camp");
                specializationVariants.push("foraging");

                break;
            case "SAVANNA":
            case "TAIGA":
                // These vast, open lands are prime for raising hardy animals or hunting.
                specializationVariants.push("animal_husbandry");
                specializationVariants.push("hunting_camp");
                break;
            case "DESERT":
                // Deserts are harsh but can be a source of stone or valuable minerals.
                specializationVariants.push("quarrying");
                specializationVariants.push("salt_mining");
                break;

            case "TUNDRA":
                // The cold tundra is not suitable for farming, but is rich with game for skilled hunters.
                specializationVariants.push("hunting_camp");
                specializationVariants.push("trapping");
                break;

            case "MOUNTAIN":
                specializationVariants.push("mining");
                specializationVariants.push("quarrying");
                specializationVariants.push("mining");
                specializationVariants.push("quarrying");
                break;
        }


        const rng = createSeededRNG(this.seed);

        if (specializationVariants.length > 0) {
            return specializationVariants[Math.floor(rng() * specializationVariants.length)];
        }

        return "nothing";

    }
}