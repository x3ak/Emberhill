import {type ProcessData, PROCESSES} from "./processes-data.ts";

export type BuildingData = {
    id: string;
    name:  string;
    processes: ProcessData[],
}

export const BUILDINGS = {
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

export type BuildingId = keyof typeof BUILDINGS;
