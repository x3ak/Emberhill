export const AllResourceIds = [
    'LOG_BIRCH', 'LOG_OAK', 'LOG_PINE', 'LOG_MAPLE',
    'RESIN',
    'STONE', 'ORE_COPPER',
    'BERRIES', 'TWIGS', 'FIBER', 'WEED_SEED', 'GRAIN_SEED', "BLACKBERRY_SEED",
    'CRUDE_HOE', "TILLED_EARTH"
] as const;

export type ResourceId = typeof AllResourceIds[number];

export type ResourceData = {
    id: ResourceId;
    name: string;
    description: string;
    icon?: string;
}

export type ResourcesState = {
    resources: Map<ResourceId, number>
}