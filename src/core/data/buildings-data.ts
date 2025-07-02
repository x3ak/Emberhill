import {PROCESSES} from "./processes-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";

export const BUILDINGS: Record<BuildingId, BuildingData> = {
    woodcutter: {
        id: "woodcutter",
        name: "Woodcutter's Lodge",
        processes: [
            PROCESSES.cut_tree_oak,
            PROCESSES.cut_tree_birch,
            PROCESSES.forage_for_kindling,
            PROCESSES.cut_tree_pine,
            PROCESSES.strip_birch_bark,
            PROCESSES.search_for_mushrooms,
            PROCESSES.cut_tree_maple,
            PROCESSES.clear_underbrush,
            PROCESSES.tap_maple_for_sap,
            PROCESSES.cut_tree_yew,
            PROCESSES.gather_fallen_feathers,
            PROCESSES.prune_oak_trees,
            PROCESSES.inspect_hollow_logs,
            PROCESSES.cut_tree_ironwood,
            PROCESSES.gather_glowing_moss,
            PROCESSES.carve_decoy_totem,
            PROCESSES.cut_tree_whisperwood,
            PROCESSES.find_ancient_seed,
            PROCESSES.commune_with_forest,
            PROCESSES.harvest_sunpetal_blossom,


        ],
        levels: {
            2: {
                xp: 100,
                resources: [
                    {type: "resource", id: "LOG_OAK", amount: 20},
                ]
            },
            3: {
                xp: 500,
                resources: [
                    {type: "resource", id: "LOG_OAK", amount: 100},
                    {type: "resource", id: "LOG_BIRCH", amount: 100},
                ]
            },
        },
    },
    campfire: {
        id: "campfire",
        name: "Campfire",
        processes: [
            PROCESSES.burn_log_oak,
            PROCESSES.burn_log_birch,
        ],
        levels: {}
    }
}

