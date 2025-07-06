import type { ProgressionData } from "@/shared/types/progression.types";

export const mineProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_process', processId: 'mine_stone'}
        ],
    },
    2: {
        xp: 100,
        resources: [
            {type: "resource", id: "STONE", amount: 40},
        ],
        rewards: [
            {type: 'unlock_process', processId: 'mine_copper_ore'}
        ],
    },
    3: {
        xp: 500,
        resources: [
            {type: "resource", id: "STONE", amount: 100},
            {type: "resource", id: "LOG_BIRCH", amount: 70},
            {type: "resource", id: "ORE_COPPER", amount: 50},
        ],
        rewards: [

        ],
    },
}