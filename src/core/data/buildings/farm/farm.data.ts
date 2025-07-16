import type {BuildingData, ProcessData} from "@/shared/types/game.types.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";
import {PROGRESSION} from "@/core/data/progression.data.ts";

const processes = new Map<ProcessId, ProcessData>();

for (let processId in PROCESSES) {
    const processData = PROCESSES[processId as ProcessId];
    if (processData && processData.buildingId == 'farm') {
        processes.set(processId as ProcessId, processData);
    }
}

export const farmData: BuildingData = {
    id: "farm",
    name: "Farm",
    processes: processes,
    progression: PROGRESSION['farm'],
}