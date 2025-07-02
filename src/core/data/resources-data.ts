import type {ResourceId, ResourceData} from "@/shared/types/resource.types.ts";

export const RESOURCES: Record<ResourceId, ResourceData> = {
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
    LOG_YEW: {
        id: 'LOG_YEW',
        name: 'Yew Log',
        description: 'A strong yet uniquely flexible wood, perfect for crafting powerful bows and staves.'
    },
    LOG_IRONWOOD: {
        id: 'LOG_IRONWOOD',
        name: 'Ironwood Log',
        description: 'An incredibly dense log that dulls common axes. As heavy as stone and nearly as strong.'
    },
    LOG_WHISPERWOOD: {
        id: 'LOG_WHISPERWOOD',
        name: 'Whisperwood Log',
        description: 'An unnervingly light log that seems to hum with a faint, otherworldly energy.'
    },

    // === MAGICAL & ESSENCES ===
    ESSENCE_SHADOW: {
        id: 'ESSENCE_SHADOW',
        name: 'Shadow Essence',
        description: 'A liquid-like mote of darkness, coalesced from a place of deep shadow and old magic.'
    },
    BLOSSOM_SUNPETAL: {
        id: 'BLOSSOM_SUNPETAL',
        name: 'Sunpetal Blossom',
        description: 'A legendary flower that blooms only in moonlight, yet holds the warmth and light of the sun within its petals.'
    },
    MOSS_GLOWING: {
        id: 'MOSS_GLOWING',
        name: 'Glowing Moss',
        description: 'A patch of soft moss that emits a continuous, gentle phosphorescent light.'
    },
    SEED_ANCIENT: {
        id: 'SEED_ANCIENT',
        name: 'Ancient Seed',
        description: 'A dormant seed, warm to the touch. It pulses with a slow, ancient life, waiting for the right conditions to grow.'
    },

    // === GATHERED MATERIALS ===
    BIRCH_BARK: {
        id: 'BIRCH_BARK',
        name: 'Birch Bark',
        description: 'A durable, paper-like sheet of bark. Naturally waterproof and useful for writing or crafting.'
    },
    KINDLING: {
        id: 'KINDLING',
        name: 'Kindling',
        description: 'A bundle of dry twigs and sticks, perfectly sized for starting a campfire.'
    },
    RESIN: {
        id: 'RESIN',
        name: 'Tree Resin',
        description: 'A sticky, amber-colored sap from a pine tree. A natural adhesive and waterproofing agent.'
    },
    FIBERS: {
        id: 'FIBERS',
        name: 'Plant Fibers',
        description: 'Tough, stringy fibers gathered from forest undergrowth. Can be woven into twine or cordage.'
    },
    MAPLE_SAP: {
        id: 'MAPLE_SAP',
        name: 'Maple Sap',
        description: 'The sweet, watery sap from a maple tree. Can be boiled down into a delicious, energy-rich syrup.'
    },
    FEATHERS: {
        id: 'FEATHERS',
        name: 'Sturdy Feathers',
        description: 'Strong, rigid feathers from a large bird, ideal for fletching arrows or simple decorations.'
    },
    GRUBS: {
        id: 'GRUBS',
        name: 'Fat Grubs',
        description: 'Plump, wriggling larvae found in rotting wood. Not appetizing, but excellent fish bait.'
    },
    MUSHROOMS: {
        id: 'MUSHROOMS',
        name: 'Forest Mushrooms',
        description: 'A handful of common, edible mushrooms. They have an earthy, savory flavor.'
    },

    // === SPECIAL & MISC ===
    LOST_COIN: {
        id: 'LOST_COIN',
        name: 'Lost Coin',
        description: 'A tarnished copper coin from a forgotten era, dropped by a long-gone traveler.'
    },
    TOTEM_DECOY: {
        id: 'TOTEM_DECOY',
        name: 'Decoy Totem',
        description: 'A crudely carved wooden figure. Its simple form is surprisingly effective at distracting simple-minded creatures.'
    },

    // === TOOLS ===
    TOOL_BUCKET: {
        id: 'TOOL_BUCKET',
        name: 'Bucket',
        description: 'A sturdy wooden bucket, sealed with pitch. Essential for carrying liquids like sap or water.'
    },
    TOOL_STEEL_AXE: {
        id: 'TOOL_STEEL_AXE',
        name: 'Steel Axe',
        description: 'A well-balanced axe with a sharp steel head. Capable of felling the toughest of trees.'
    },
    TOOL_BLESSED_SICKLE: {
        id: 'TOOL_BLESSED_SICKLE',
        name: 'Blessed Sickle',
        description: 'A silver-inlaid sickle that hums with a gentle energy, made for harvesting magical plants without damaging them.'
    }
} as const;


