import type {BuildingId} from "@/shared/types/building.types.ts";
import type {BuildingData, ProcessData} from "@/shared/types/game.types.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";
import {PROGRESSION} from "@/core/data/progression.data.ts";

export const BUILDINGS: {[ key in BuildingId]?: BuildingData} = {
    woodcutter: {
        id: "woodcutter",
        name: "Woodcutter's Lodge",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    campfire: {
        id: "campfire",
        name: "Campfire",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    mine: {
        id: "mine",
        name: "Mine",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    foragers_hut: {
        id: "foragers_hut",
        name: "Forager's Hut",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    farm: {
        id: "farm",
        name: "Farm",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    workshop: {
        id: "workshop",
        name: "Workshop",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    sawmill: {
        id: "sawmill",
        name: "Sawmill",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    smelter: {
        id: "smelter",
        name: "smelter",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    stonemason: {
        id: "stonemason",
        name: "stonemason",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    windmill: {
        id: "windmill",
        name: "windmill",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
    bakery: {
        id: "bakery",
        name: "bakery",
        processes: new Map<ProcessId, ProcessData>(),
        progression: {},
    },
}

for (let buildingId in BUILDINGS) {
    const data = BUILDINGS[buildingId as BuildingId];
    if (!data) {
        continue;
    }

    // fill in processes
    for (let processId in PROCESSES) {
        const processData = PROCESSES[processId as ProcessId];
        if (processData && processData.buildingId == buildingId) {
            data.processes.set(processId as ProcessId, processData);
        }
    }

    data.progression = PROGRESSION[buildingId] || {};
}