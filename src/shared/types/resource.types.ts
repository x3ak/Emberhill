export const AllResourceIds = [
    'LOG_BIRCH', 'LOG_OAK', 'LOG_PINE', 'LOG_MAPLE',
    'RESIN',
    'STONE', 'ORE_COPPER',
] as const;

export type ResourceId = typeof AllResourceIds[number];

export type ResourceData = {
    id: ResourceId;
    name: string;
    description: string;
}

export type ResourcesState = {
    resources: Map<ResourceId, number>
}