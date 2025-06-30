import {PROCESSES} from "./processes-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";

export const BUILDINGS : Record<BuildingId, BuildingData>= {
    woodcutter: {
        id: "woodcutter",
        name: "Woodcutter's Lodge",
        processes: [
            PROCESSES.cut_tree_oak,
            PROCESSES.cut_tree_birch
        ],
        levels: {
            2: {
                xp: 100,
                resources: [
                    {type: "resource", id: "LOG_OAK", amount: 100},
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

