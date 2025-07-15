import type {ProgressionData} from "@/shared/types/game.types.ts";

export const farmProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_process', processId: 'grow_blackberries'}
        ],
    },
}