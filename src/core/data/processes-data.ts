import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";

export const PROCESSES: Record<ProcessId, ProcessData> = {
    cut_tree_oak: {
        id: "cut_tree_oak",
        name: "Cut Oak Tree",
        description: "Take up your axe and venture into the woods. Find an oak tree. A few well-aimed swings will bring down one of the forest's sturdy children, ready to be turned to plank and purpose.",
        duration: 10,
        xp: 10,
        text: "The forest offers",
        requirements: [
            {type: "min_building_level", id: "woodcutter", amount: 1},
        ],
        inputs: [],
        outputs: [
            {type: "resource", id: "LOG_OAK", amount: 1},
        ],
        effects: []
    },
    cut_tree_birch: {
        id: "cut_tree_birch",
        name: "Cut Birch Tree",
        description: "Take up your axe and venture into the woods. Find a birch tree. A few well-aimed swings will bring down one of the forest's sturdy children, ready to be turned to plank and purpose.",
        duration: 15,
        xp: 15,
        text: "The forest offers:",
        requirements: [
            {type: "min_building_level", id: "woodcutter", amount: 2},
        ],
        inputs: [],
        outputs: [
            {type: "resource", id: "LOG_BIRCH", amount: 1},
        ],
        effects: []
    },
    burn_log_oak: {
        id: "burn_log_oak",
        name: "Burn Oak Log",
        description: "Burn Oak Log to get some warmth into stone",
        duration: 0.5,
        xp: 5,
        text: "Your spirit feels:",
        requirements: [
            {type: "min_building_level", id: "campfire", amount: 1},
        ],
        inputs: [
            {type: "resource", id: "LOG_OAK", amount: 1}
        ],
        outputs: [],
        effects: [
            {warmstone_vitality_restoration: 10}
        ]
    },
    burn_log_birch: {
        id: "burn_log_birch",
        name: "Burn birch Log",
        description: "Burn birch Log to get some warmth into stone",
        duration: 20,
        xp: 20,
        text: "Your spirit feels:",
        requirements: [
            {type: "min_building_level", id: "campfire", amount: 2},
        ],
        inputs: [
            {type: "resource", id: "LOG_BIRCH", amount: 1}
        ],
        outputs: [],
        effects: [
            {warmstone_vitality_restoration: 10}
        ]
    }
}
