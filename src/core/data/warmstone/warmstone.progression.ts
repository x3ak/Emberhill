import type {ProgressionData} from "@/shared/types/progression.types.ts";

export const warmstoneProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_building', buildingId: 'woodcutter'},
            {type: 'unlock_building', buildingId: 'campfire'},
            {type: 'unlock_building', buildingId: 'foragers_hut'},
        ]
    },
    2: {
        xp: 100,
        resources: [

        ],
        rewards: [
            {type: 'unlock_building', buildingId: 'mine'}
        ]
    },
    3: {
        xp: 150,
        resources: [
            {type: "resource", id: "LOG_OAK", amount: 10},
            {type: "resource", id: "FIBER", amount: 5},
        ],
        rewards: [
            {type: 'unlock_building', buildingId: 'workshop'}
        ]
    },


};