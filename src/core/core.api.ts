import type {ResourceData, ResourceId} from "@/shared/types/resource.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {RESOURCES} from "./data/resources-data.ts";
import {PROCESSES} from "./data/processes-data.ts";

function getResourceData(id: ResourceId): ResourceData {
    return RESOURCES[id];
}

function getProcessData(id: ProcessId): ProcessData {
    return PROCESSES[id]
}

export const coreAPI = {
    getResourceData,
    getProcessData,
}