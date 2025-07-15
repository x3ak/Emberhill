import type {ProgressionData} from "@/shared/types/game.types.ts";

export const workshopProgression: ProgressionData = {
    1: {
        xp: 0,
        resources: [],
        rewards: [
            {type: 'unlock_process', processId: 'create_crude_hoe'},
        ]
    },
    // 2: {
    //     xp: 100,
    //     resources: [
    //         {type: "resource", id: "CRUDE_HOE", amount: 15},
    //         {type: "resource", id: "FIBER", amount: 10},
    //     ],
    //     rewards: [
    //         {type: 'unlock_process', processId: ''},
    //
    //     ]
    // },
}