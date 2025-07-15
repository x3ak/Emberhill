import {foragingProgression} from "./foraging.progression.ts";
import type {BuildingData, ProcessData} from "@/shared/types/game.types.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";

const processes = new Map<ProcessId, ProcessData>();

for (let processId in PROCESSES) {
    const processData = PROCESSES[processId as ProcessId];
    if (processData && processData.buildingId == 'foragers_hut') {
        processes.set(processId as ProcessId, processData);
    }
}
export const foragers_hutData: BuildingData = {
    id: "foragers_hut",
    name: "Forager's Hut",
    processes: processes,
    progression: foragingProgression,
}