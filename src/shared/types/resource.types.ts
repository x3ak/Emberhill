export const AllResourceIds = [
    'LOG_BIRCH', 'LOG_OAK'
] as const;

export type ResourceId = typeof AllResourceIds[number];

export type ResourceData = {
    id: ResourceId;
    name: string;
}