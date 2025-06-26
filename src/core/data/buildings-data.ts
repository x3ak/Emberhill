import {type ProcessData, processesDatabase} from "./processes-data.ts";

export type BuildingData = {
    id: string;
    name:  string;
    processes: ProcessData[],
}

type BuildingsData = Record<string, BuildingData>;

export const buildingsData: BuildingsData = {
    woodcutter: {
        id: "woodcutter",
        name: "Woodcutter's Lodge",
        processes: [processesDatabase.cut_tree_oak, processesDatabase.cut_tree_birch]
    },
    campfire: {
        id: "campfire",
        name: "Campfire",
        processes: [processesDatabase.burn_log_oak]
    }
}