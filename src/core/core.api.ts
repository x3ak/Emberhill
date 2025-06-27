import type {ResourceData, ResourceId} from "@/shared/types/resource.types.ts";
import {RESOURCES} from "./data/resources-data.ts";

function getResourceData(id: ResourceId): ResourceData {
    return RESOURCES[id];
}

export const coreAPI = {
    getResourceData,
}