import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {woodcutterProcesses} from "./processes/woodcutter.processes.ts";
import {campfireProcesses} from "./processes/campfire.processes.ts";

export const BUILDINGS: Record<BuildingId, BuildingData> = {
    woodcutter: {
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
    },
    campfire: {
        id: "campfire",
        name: "Campfire",
        processes: campfireProcesses,
        levels: {}
    }
}

