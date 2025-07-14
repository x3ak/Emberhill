import type {ResourceId, ResourceData} from "@/shared/types/resource.types.ts";

import placeholder from '@/icons/placeholder.png';
import logOak from '@/resource-icon/log_oak.png';
import logBirch from '@/resource-icon/log_birch.png';
import logPine from '@/resource-icon/log_pine.png';
import logMaple from '@/resource-icon/log_maple.png';
import blackberry from '@/resource-icon/blackberry.png';
import hemp from '@/resource-icon/hemp.png';
import grain_seed from '@/resource-icon/malt.png';
import twigs from '@/resource-icon/branch.png';
import weed from '@/resource-icon/weed.png';
import berries from '@/resource-icon/berries.png';
import hoe from '@/resource-icon/hoe.png';
import soil from '@/resource-icon/soil.png';


export const RESOURCES: {[key in ResourceId]?: ResourceData} = {
    // === LOGS ===
    LOG_OAK: {
        id: 'LOG_OAK',
        name: 'Oak Log',
        description: 'A sturdy, common log from an oak tree. The reliable heartwood of the forest.',
        icon: logOak,
    },
    LOG_BIRCH: {
        id: 'LOG_BIRCH',
        name: 'Birch Log',
        description: 'A light, pale log from a slender birch. Its bark is as useful as its wood.',
        icon: logBirch,
    },
    LOG_PINE: {
        id: 'LOG_PINE',
        name: 'Pine Log',
        description: 'A fragrant softwood log, sticky to the touch with fresh resin.',
        icon: logPine,
    },
    LOG_MAPLE: {
        id: 'LOG_MAPLE',
        name: 'Maple Log',
        description: 'A dense, fine-grained hardwood, prized by carpenters for its strength and beauty.',
        icon: logMaple,
    },


    RESIN: {
        id: 'RESIN',
        name: 'Tree Resin',
        description: 'A sticky, amber-colored sap from a pine tree. A natural adhesive and waterproofing agent.',
        icon: placeholder,
    },

    // === MINING RESOURCES ===
    STONE: {
        id: 'STONE',
        name: "Stone",
        description: "Stone description",
        icon: placeholder,
    },
    ORE_COPPER: {
        id: 'ORE_COPPER',
        name: "Copper Ore",
        description: "Copper Ore description",
        icon: placeholder,
    },

    // === FORAGING RESOURCES ===
    BERRIES: {
        id: 'BERRIES',
        name: "Berries",
        description: "A common fruit found throughout the region. While not particularly nourishing, they provide a quick source of energy to stave off the worst of the Hearthstone's decay in the early days.",
        icon: berries,
    },
    TWIGS: {
        id: 'TWIGS',
        name: "Twigs",
        description: "A bundle of dry, brittle twigs, bark, and pinecones. Catches fire far more readily than a whole log. An essential component for starting and maintaining a reliable flame.",
        icon: twigs,
    },
    FIBER: {
        id: 'FIBER',
        name: "Fiber",
        description: "Surprisingly strong for a glorified weed",
        icon: hemp,
    },
    WEED_SEED: {
        id: 'WEED_SEED',
        name: 'Weed Seed',
        description: "An unidentifiable seed, gathered from the untamed parts of the world. Planting it is an act of faith. It could yield anything from tough, edible roots and fibrous stalks to, on rare occasions, the ancestors of true grain.",
        icon: weed,
    },
    BLACKBERRY_SEED: {
        id: 'BLACKBERRY_SEED',
        name: 'Blackberry Seed',
        description: "Domesticate the same thorny bushes you find in the wild. Each seed will grow into a familiar plant that yields a predictable and steady supply of blackberries, removing the uncertainty of foraging.",
        icon: blackberry,
    },
    GRAIN_SEED: {
        id: 'GRAIN_SEED',
        name: 'Grain Seed',
        description: "A significant agricultural breakthrough. Unlike berries or roots, grain is highly storable and incredibly versatile. Cultivating a steady supply of grain is the first step towards creating a stable food source, brewing valuable ales, and truly domesticating livestock.",
        icon: grain_seed,
    },

    // === FARM RESOURCES ===
    TILLED_EARTH: {
        id: 'TILLED_EARTH',
        name: 'Tilled Earth',
        description: "A plot of land that has been broken up and aerated with a hoe. The soil is now soft and ready to accept a seed. It will revert to packed dirt if left untended for too long",
        icon: soil,
    },
    CRUDE_HOE: {
        id: 'CRUDE_HOE',
        name: 'Crude Hoe',
        description: "A plot of land that has been broken up and aerated with a hoe. The soil is now soft and ready to accept a seed. It will revert to packed dirt if left untended for too long",
        icon: hoe,
    },

} as const;


