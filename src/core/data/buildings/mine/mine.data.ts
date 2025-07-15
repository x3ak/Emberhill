import {mineProgression} from "./mine.progression.ts";
import type {BuildingData, ProcessData} from "@/shared/types/game.types.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";

const processes = new Map<ProcessId, ProcessData>();

for (let processId in PROCESSES) {
    const processData = PROCESSES[processId as ProcessId];
    if (processData && processData.buildingId == 'mine') {
        processes.set(processId as ProcessId, processData);
    }
}

export const mineData: BuildingData = {
    id: "mine",
    name: "Mine",
    processes: processes,
    progression: mineProgression
}