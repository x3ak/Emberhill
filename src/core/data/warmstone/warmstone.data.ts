import type {ProgressionData} from "@/shared/types/progression.types.ts";

export const warmstoneProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_building', buildingId: 'woodcutter'},
            {type: 'unlock_building', buildingId: 'campfire'}
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


};