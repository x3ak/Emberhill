import {GameObject, Subscribable} from "./mixins/Subscribable.mixin.ts";
import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";
import type {GameCommand} from "./commands.ts";
import {warmstoneProgression} from "./data/warmstone/warmstone.data.ts";
import type {UnlockReward} from "@/shared/types/progression.types.ts";


export class Warmstone extends Subscribable<WarmstoneState, typeof GameObject>(GameObject) {

    private currentVitality: number;
    private maxVitality: number;

    private vitalityDrainInterval: number = 2; // every N seconds drain vitality
    private vitalityDrainAmount: number = 10; // drain this amount of vitality
    private timeSinceLastDrain: number = 0;
    private essence: number = 0;
    private currentLevel: number = 1;
    private canLevelUp: boolean = false;

    private maxEssenceMap: Map<number, number> = new Map<number, number>();

    constructor(vitality: number) {
        super()
        this.currentVitality = vitality;
        this.maxVitality = vitality;
        this.maxEssenceMap.set(2, 100);
        this.maxEssenceMap.set(3, 180);

    }

    public update(deltaTime: number): boolean {
        this.timeSinceLastDrain += deltaTime;

        if (this.timeSinceLastDrain >= this.vitalityDrainInterval) {
            this.currentVitality -= this.vitalityDrainAmount;
            this.timeSinceLastDrain -= this.vitalityDrainInterval;
            this.setDirty()

            if (this.currentVitality < 0) {
                this.currentVitality = 0;
            }
        }

        return false;
    }


    ready(gameCommands: GameCommand[]): void {
        for (let i = 1; i <= this.currentLevel; i++) {
            const levelProgressData = warmstoneProgression[i] || null;
            if (!levelProgressData) {
                continue;
            }

            this.transformRewardsToGameCommands(levelProgressData.rewards, gameCommands);
        }
    }

    private transformRewardsToGameCommands(rewards: UnlockReward[], gameCommands: GameCommand[]) {
        rewards.forEach(reward => {
            switch (reward.type) {
                case "unlock_building":
                    gameCommands.push({type: "UNLOCK_BUILDING", payload: {buildingId: reward.buildingId}})
                    break;
                case "unlock_process":
                    gameCommands.push({type: "UNLOCK_PROCESS", payload: {processId: reward.processId}})
                    break;
            }
        });
    }


    public upgrade(gameCommands: GameCommand[]): void {
        if(!this.canLevelUp) {
            return;
        }
        this.essence = 0;
        this.currentLevel += 1;
        this.canLevelUp = false;

        this.setDirty();

        const levelProgressData = warmstoneProgression[this.currentLevel] || null;
        if (!levelProgressData) {
            return;
        }

        this.transformRewardsToGameCommands(levelProgressData.rewards, gameCommands);
    }

    public onExperienceAdded(amountXP: number): void {
        const nextLevelEssenceValue = this.getEssenceForNextLevel();
        if(nextLevelEssenceValue === 0) {
            return;
        }

        this.essence += amountXP * 0.2;
        if(this.essence >= nextLevelEssenceValue) {
            this.essence = nextLevelEssenceValue;
            this.canLevelUp = true;

        }

        this.setDirty();
    }

    private getEssenceForNextLevel(): number {
        return this.maxEssenceMap.get(this.currentLevel + 1) || 0;
    }

    protected computeSnapshot(): WarmstoneState {
        return {
            maxVitality: this.maxVitality,
            currentVitality: this.currentVitality,
            currentLevel: this.currentLevel,
            essence: this.essence,
            essenceForNextLevel: this.getEssenceForNextLevel(),
            canLevelUp: this.canLevelUp,
        }
    }

}

export const warmstone = new Warmstone(200);