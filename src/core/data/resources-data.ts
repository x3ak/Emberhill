import type {ResourceId, ResourceData} from "@/shared/types/resource.types.ts";
export const RESOURCES: {[key in ResourceId]?: ResourceData} = {
    // === LOGS ===
    LOG_OAK: {
        id: 'LOG_OAK',
        name: 'Oak Log',
        description: 'A sturdy, common log from an oak tree. The reliable heartwood of the forest.'
    },
    LOG_BIRCH: {
        id: 'LOG_BIRCH',
        name: 'Birch Log',
        description: 'A light, pale log from a slender birch. Its bark is as useful as its wood.'
    },
    LOG_PINE: {
        id: 'LOG_PINE',
        name: 'Pine Log',
        description: 'A fragrant softwood log, sticky to the touch with fresh resin.'
    },
    LOG_MAPLE: {
        id: 'LOG_MAPLE',
        name: 'Maple Log',
        description: 'A dense, fine-grained hardwood, prized by carpenters for its strength and beauty.'
    },


    RESIN: {
        id: 'RESIN',
        name: 'Tree Resin',
        description: 'A sticky, amber-colored sap from a pine tree. A natural adhesive and waterproofing agent.'
    },

    // === MINING RESOURCES ===
    STONE: {
        id: 'STONE',
        name: "Stone",
        description: "Stone description",
    },
    ORE_COPPER: {
        id: 'ORE_COPPER',
        name: "Copper Ore",
        description: "Copper Ore description",
    },

} as const;


