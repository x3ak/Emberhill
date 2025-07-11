import type {GameCommand} from "../commands.ts";
import type {UnlockReward} from "@/shared/types/progression.types.ts";


export function toGameCommands(reward: UnlockReward): GameCommand[] {
    switch (reward.type) {
        case 'unlock_process':
            return [{
                type: 'UNLOCK_PROCESS',
                payload: {
                    processId: reward.processId,
                }
            }];

        case 'unlock_building':
            return [{
                type: 'UNLOCK_BUILDING',
                payload: {
                    buildingId: reward.buildingId,
                }
            }];

        default:
            return [];
    }
}

/**
 * A helper function to convert an entire array of rewards at once.
 */
export function allToGameCommands(rewards: UnlockReward[]): GameCommand[] {
    return rewards.flatMap(reward => toGameCommands(reward));
}