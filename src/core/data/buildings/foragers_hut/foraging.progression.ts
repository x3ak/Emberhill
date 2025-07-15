import type {ProgressionData} from "@/shared/types/game.types.ts";

export const foragingProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_process', processId: 'collect_berries'}
        ],
    },
    2: {
        xp: 100,
        resources: [
            {type: "resource", id: "BERRIES", amount: 30},
        ],
        rewards: [
            {type: 'unlock_process', processId: 'gather_kindling'}
        ],
    },
    3: {
        xp: 250,
        resources: [
            {type: "resource", id: "BERRIES", amount: 100},
            {type: "resource", id: "TWIGS", amount: 70},
        ],
        rewards: [
            {type: 'unlock_process', processId: 'collect_fibers'},

        ],
    },
    4: {
        xp: 450,
        resources: [
            {type: "resource", id: "BLACKBERRY_SEED", amount: 5},
                //{type: "resource", id: "CRUDE_HOE", amount: 1},
        ],
        rewards: [
            {type: 'unlock_building', buildingId: 'farm'},

        ],
    },

}