import {gameInstance} from "./engine.ts";
import type {UnlockReward} from "@/shared/types/game.types.ts";

export class Progression {

    public unlockRewards(rewards: UnlockReward[]): void {
        rewards
            .filter(reward => reward.type === 'unlock_process')
            .forEach(reward => {
                gameInstance.getProcess(reward.processId)?.setLocked(false);
            });


    }
}