import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";

export const woodcutterProcesses: {[key in ProcessId]?: ProcessData} = {
    cut_tree_oak: {
        id: "cut_tree_oak",
        name: "Cut Oak Tree",
        description: "A sturdy, common hardwood. The backbone of any new settlement, providing reliable logs for basic construction.",
        duration: 5,
        xp: 5,
        text: "The familiar scent of oak fills the air.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 1 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_OAK", amount: 1 }
        ],
        effects: []
    },
    cut_tree_birch: {
        id: "cut_tree_birch",
        name: "Cut Birch Tree",
        description: "Fell a slender birch. Its pale wood is light, and its bark has many uses.",
        duration: 15,
        xp: 15,
        text: "The paper-like bark peels away.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 2 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_BIRCH", amount: 1 }
        ],
        effects: []
    },
    forage_for_kindling: {
        id: "forage_for_kindling",
        name: "Forage for Kindling",
        description: "Scour the forest floor for dry twigs and fallen branches. Not useful for construction, but perfect for starting fires.",
        duration: 20,
        xp: 5,
        text: "A bundle of dry sticks, ready for the flame.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 1 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "KINDLING", amount: 3 }
        ],
        effects: []
    },
    cut_tree_pine: {
        id: "cut_tree_pine",
        name: "Cut Pine Tree",
        description: "Harvest a fragrant pine. Its sticky resin is a valuable secondary resource.",
        duration: 25,
        xp: 25,
        text: "The sharp scent of pine needles is invigorating.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 4 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_PINE", amount: 1 },
            { type: "resource", id: "RESIN", amount: 1, chance: 0.25 }
        ],
        effects: []
    },
    strip_birch_bark: {
        id: "strip_birch_bark",
        name: "Strip Birch Bark",
        description: "Carefully peel the durable, waterproof bark from a birch log. This process consumes the log.",
        duration: 30,
        xp: 20,
        text: "The bark comes away in a satisfying sheet.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 5 }
        ],
        inputs: [
            { type: "resource", id: "LOG_BIRCH", amount: 1 }
        ],
        outputs: [
            { type: "resource", id: "BIRCH_BARK", amount: 2 }
        ],
        effects: []
    },
    search_for_mushrooms: {
        id: "search_for_mushrooms",
        name: "Search for Mushrooms",
        description: "Forage at the base of old oaks and in damp clearings for edible fungi.",
        duration: 45,
        xp: 10,
        text: "A handful of earthy, delicious mushrooms.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 6 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "MUSHROOMS", amount: 2 }
        ],
        effects: []
    },
    cut_tree_maple: {
        id: "cut_tree_maple",
        name: "Cut Maple Tree",
        description: "A dense, beautiful hardwood prized by carpenters. Takes longer to fell but yields sturdy timber.",
        duration: 50,
        xp: 55,
        text: "The heavy thud of maple echoes through the woods.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 8 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_MAPLE", amount: 1 }
        ],
        effects: []
    },
    clear_underbrush: {
        id: "clear_underbrush",
        name: "Clear Underbrush",
        description: "A tiring but necessary task. Clear away thorny bushes and vines to make the forest safer and yield fibrous materials.",
        duration: 60,
        xp: 30,
        text: "Clearing the way for new growth.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 3 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "FIBERS", amount: 5 }
        ],
        effects: []
    },
    tap_maple_for_sap: {
        id: "tap_maple_for_sap",
        name: "Tap Maple for Sap",
        description: "Instead of felling the tree, carefully tap it to collect its sweet sap over time. Requires a bucket.",
        duration: 120,
        xp: 40,
        text: "A slow, sweet drip of nature's nectar.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 10 },

        ],
        inputs: [        ],
        outputs: [
            { type: "resource", id: "MAPLE_SAP", amount: 1 }
        ],
        effects: []
    },
    cut_tree_yew: {
        id: "cut_tree_yew",
        name: "Cut Yew Tree",
        description: "Seek out the rare and flexible yew. Its wood is unmatched for making powerful bows.",
        duration: 90,
        xp: 100,
        text: "The yew's wood feels springy and full of potential.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 12 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_YEW", amount: 1 }
        ],
        effects: []
    },
    gather_fallen_feathers: {
        id: "gather_fallen_feathers",
        name: "Gather Fallen Feathers",
        description: "Search around nests and clearings for sturdy feathers, useful for fletching.",
        duration: 40,
        xp: 15,
        text: "A collection of surprisingly strong feathers.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 7 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "FEATHERS", amount: 3 }
        ],
        effects: []
    },
    prune_oak_trees: {
        id: "prune_oak_trees",
        name: "Prune Oak Trees",
        description: "Carefully trim the branches of living oaks to encourage healthier growth. A sustainable source of wood that doesn't harm the forest.",
        duration: 75,
        xp: 45,
        text: "The forest feels healthier, and your woodpile grows.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 14 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_OAK", amount: 3 }
        ],
        effects: []
    },
    inspect_hollow_logs: {
        id: "inspect_hollow_logs",
        name: "Inspect Hollow Logs",
        description: "Some fallen logs are hollow. Who knows what might have made its home inside?",
        duration: 60,
        xp: 25,
        text: "You peer into the darkness...",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 9 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "GRUBS", amount: 2, chance: 0.5 },
            { type: "resource", id: "RESIN", amount: 1, chance: 0.3 },
            { type: "resource", id: "LOST_COIN", amount: 1, chance: 0.1 }
        ],
        effects: []
    },
    cut_tree_ironwood: {
        id: "cut_tree_ironwood",
        name: "Cut Ironwood Tree",
        description: "An incredibly dense and heavy wood, almost like metal. Felling one is a true test of strength and requires a reinforced axe.",
        duration: 180,
        xp: 200,
        text: "Sparks fly as the axe strikes true.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 16 },
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_IRONWOOD", amount: 1 }
        ],
        effects: []
    },
    gather_glowing_moss: {
        id: "gather_glowing_moss",
        name: "Gather Glowing Moss",
        description: "At twilight, venture to the oldest part of the forest to scrape phosphorescent moss from ancient trees.",
        duration: 100,
        xp: 80,
        text: "The moss pulses with a soft, gentle light.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 18 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "MOSS_GLOWING", amount: 2 }
        ],
        effects: []
    },
    carve_decoy_totem: {
        id: "carve_decoy_totem",
        name: "Carve Decoy Totem",
        description: "Use a simple log to carve a crude animal totem. Might be useful for hunting or distracting forest spirits.",
        duration: 60,
        xp: 50,
        text: "It's not a work of art, but it might just work.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 11 }
        ],
        inputs: [
            { type: "resource", id: "LOG_PINE", amount: 1 }
        ],
        outputs: [
            { type: "resource", id: "TOTEM_DECOY", amount: 1 }
        ],
        effects: []
    },
    cut_tree_whisperwood: {
        id: "cut_tree_whisperwood",
        name: "Cut Whisperwood",
        description: "Find a rare, unsettling tree whose leaves seem to whisper secrets. Its wood is unnaturally light and resonates with strange energy.",
        duration: 240,
        xp: 300,
        text: "The air grows cold and silent as the tree falls.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 20 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_WHISPERWOOD", amount: 1 },
            { type: "resource", id: "ESSENCE_SHADOW", amount: 1, chance: 0.1 }
        ],
        effects: []
    },
    find_ancient_seed: {
        id: "find_ancient_seed",
        name: "Find an Ancient Seed",
        description: "Instead of harvesting, search the forest floor for a seed of immense age and potential. This is a task of patience and luck.",
        duration: 3600,
        xp: 500,
        text: "You feel a faint warmth from the earth...",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 22 }
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "SEED_ANCIENT", amount: 1 }
        ],
        effects: []
    },
    commune_with_forest: {
        id: "commune_with_forest",
        name: "Commune with the Forest",
        description: "Spend time simply observing the forest's cycles. This yields no resources, but grants a deep understanding of the wood.",
        duration: 600,
        xp: 1000,
        text: "The forest's wisdom flows into you.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 25 }
        ],
        inputs: [],
        outputs: [
        ],
        effects: []
    },
    harvest_sunpetal_blossom: {
        id: "harvest_sunpetal_blossom",
        name: "Harvest Sunpetal Blossom",
        description: "During a full moon, find the clearing where the legendary Sunpetal tree blooms. Its blossom holds the warmth of a captured sunbeam. Requires a blessed cutting tool.",
        duration: 7200,
        xp: 2500,
        text: "The blossom closes around your tool, imparting its warmth.",
        requirements: [
            { type: "min_building_level", id: "woodcutter", amount: 30 },
        ],
        inputs: [],
        outputs: [
            { type: "resource", id: "BLOSSOM_SUNPETAL", amount: 1 }
        ],
        effects: []
    },
} ;

// export const woodcutterProcessesIds: ProcessId[] = typeof woodcutterProcesses[number];