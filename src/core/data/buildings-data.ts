import {PROCESSES} from "./processes-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";

export const BUILDINGS : Record<BuildingId, BuildingData>= {
    woodcutter: {
        id: "woodcutter",
        name: "Woodcutter's Lodge",
        processes: [
            PROCESSES.cut_tree_oak,
            PROCESSES.cut_tree_birch
        ]
    },
    campfire: {
        id: "campfire",
        name: "Campfire",
        processes: [
            PROCESSES.burn_log_oak
        ]
    }
}

