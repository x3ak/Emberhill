export const AllBuildingIds = [
    'woodcutter',
    'campfire',
    'mine',
    'foragers_hut',
    'farm',
    'workshop',
    'sawmill',
    'smelter',
    'stonemason',
    'windmill',
    'bakery',
] as const;

export type BuildingId = typeof AllBuildingIds[number];


