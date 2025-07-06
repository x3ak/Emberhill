import type {ProgressionData} from "@/shared/types/progression.types.ts";

export const woodcutterProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_process', processId: 'cut_tree_oak'},
        ]
    },
    2: {
        xp: 100,
        resources: [
            {type: "resource", id: "LOG_OAK", amount: 20},
        ],
        rewards: [
            {type: 'unlock_process', processId: 'cut_tree_birch'}
        ]
    },
    3: {
        xp: 500,
        resources: [
            {type: "resource", id: "LOG_OAK", amount: 100},
            {type: "resource", id: "LOG_BIRCH", amount: 100},
        ],
        rewards: [
            {type: 'unlock_process', processId: 'cut_tree_pine'}
        ]
    },
};