export const AllResourceIds = [
    'LOG_BIRCH', 'LOG_OAK', 'LOG_PINE', 'LOG_MAPLE', 'LOG_YEW', 'LOG_IRONWOOD', 'LOG_WHISPERWOOD', 'ESSENCE_SHADOW',
    'BIRCH_BARK',
    'KINDLING',
    'RESIN', 'FIBERS', 'MAPLE_SAP', 'FEATHERS', 'SEED_ANCIENT',
    'GRUBS',
    'MUSHROOMS',
    'LOST_COIN',
    'MOSS_GLOWING',
    'TOTEM_DECOY',
    'BLOSSOM_SUNPETAL',
    'TOOL_BUCKET', 'TOOL_STEEL_AXE', 'TOOL_BLESSED_SICKLE',
] as const;

export type ResourceId = typeof AllResourceIds[number];

export type ResourceData = {
    id: ResourceId;
    name: string;
    description: string;
}