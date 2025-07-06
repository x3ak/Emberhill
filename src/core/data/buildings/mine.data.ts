import type {BuildingData} from "@/shared/types/building.types.ts";
import {miningProcesses} from "../processes/mining.processes.ts";


export const mineData: BuildingData = {
    id: "mine",
    name: "Mine",
    processes: miningProcesses,
    levels: {
        2: {
            xp: 100,
            resources: [
                {type: "resource", id: "STONE", amount: 40},
            ]
        },
        3: {
            xp: 500,
            resources: [
                {type: "resource", id: "STONE", amount: 100},
                {type: "resource", id: "LOG_BIRCH", amount: 70},
                {type: "resource", id: "ORE_COPPER", amount: 50},
            ]
        },
    },

}