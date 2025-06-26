export const RESOURCES = {
    LOG_BIRCH: {
        id: 10000,
        name: 'Birch Log',
    },
    LOG_OAK: {
        id: 10001,
        name: 'Oak Log',
    }
} as const;

export type ResourceId = keyof typeof RESOURCES;

