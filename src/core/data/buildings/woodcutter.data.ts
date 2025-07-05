import {woodcutterProcesses} from "../processes/woodcutter.processes.ts";
import type {BuildingData} from "@/shared/types/building.types.ts";

export const woodcutterData: BuildingData = {
    id: "woodcutter",
    name: "Woodcutter's Lodge",
    processes: woodcutterProcesses,
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
}