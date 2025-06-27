import type {ResourceData, ResourceId} from "@/shared/types/resource.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {RESOURCES} from "./data/resources-data.ts";
import {PROCESSES} from "./data/processes-data.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";

function getResourceData(id: ResourceId): ResourceData {
    return RESOURCES[id];
}

function getProcessData(id: ProcessId): ProcessData {
    return PROCESSES[id]
}

function getBuildingData(id: BuildingId): BuildingData {
    return BUILDINGS[id];
}

function getBuildingProcesses(id: BuildingId): ProcessData[] {
    switch (id) {
        case "woodcutter":
            return [PROCESSES['cut_tree_oak'], PROCESSES['cut_tree_birch']];
        case "campfire":
            return [PROCESSES['burn_log_oak']]

    }
}

export const coreAPI = {
    getResourceData,
    getProcessData,
    getBuildingData,
    getBuildingProcesses,
}