import type {ResourceId, ResourceData} from "@/shared/types/resource.types.ts";

export const RESOURCES: Record<ResourceId, ResourceData> = {
    LOG_BIRCH: {
        id: 'LOG_BIRCH',
        name: 'Birch Log',
    },
    LOG_OAK: {
        id: 'LOG_OAK',
        name: 'Oak Log',
    }
} as const;


