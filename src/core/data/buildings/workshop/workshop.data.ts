import type {BuildingData, ProcessData} from "@/shared/types/game.types.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";
import {PROGRESSION} from "@/core/data/progression.data.ts";


const processes = new Map<ProcessId, ProcessData>();

for (let processId in PROCESSES) {
    const processData = PROCESSES[processId as ProcessId];
    if (processData && processData.buildingId == 'workshop') {
        processes.set(processId as ProcessId, processData);
    }
}
export const workshopData: BuildingData = {
    id: "workshop",
    name: "Workshop",
    processes: processes,
    progression: PROGRESSION['workshop'],
}