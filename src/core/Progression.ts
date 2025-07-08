import type {UnlockReward} from "@/shared/types/progression.types.ts";
import {gameInstance} from "./engine.ts";

export class Progression {

    public unlockRewards(rewards: UnlockReward[]): void {
        rewards
            .filter(reward => reward.type === 'unlock_process')
            .forEach(reward => {
                gameInstance.getProcess(reward.processId)?.setLocked(false);
            });


    }
}