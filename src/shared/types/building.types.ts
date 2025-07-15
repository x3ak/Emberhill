export const AllBuildingIds = [
    'woodcutter',
    'campfire',
    'mine',
    'foragers_hut',
    'farm',
    'workshop',
] as const;

export type BuildingId = typeof AllBuildingIds[number];


