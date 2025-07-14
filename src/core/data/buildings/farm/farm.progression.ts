import type { ProgressionData } from "@/shared/types/progression.types";

export const farmProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_process', processId: 'grow_blackberries'}
        ],
    },
}