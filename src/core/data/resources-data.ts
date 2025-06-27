import type {ResourceId, ResourceData} from "@/shared/types/resource.types.ts";

export const RESOURCES : Record<ResourceId, ResourceData> = {
    LOG_BIRCH: {
        id: 10000,
        name: 'Birch Log',
    },
    LOG_OAK: {
        id: 10001,
        name: 'Oak Log',
    }
} as const;


