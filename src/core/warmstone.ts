import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";
import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";


export class Warmstone extends Subscribable<WarmstoneState, typeof EmptyBase>(EmptyBase) {

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

    public upgrade(): void {
        if(!this.canLevelUp) {
            return;
        }
        this.essence = 0;
        this.currentLevel += 1;
        this.canLevelUp = false;
        this.setDirty();
    }

    public onExperienceAdded(amountXP: number): void {
        const nextLevelEssenceValue = this.getEssenceForLevel(this.currentLevel + 1);
        if(nextLevelEssenceValue === 0) {
            return;
        }

        this.essence += amountXP * 0.2;
        if(this.essence >= nextLevelEssenceValue) {
            this.essence = nextLevelEssenceValue;
            this.canLevelUp = true;

        }

        this.setDirty();
        console.log(`onExperienceAdded ${amountXP} ${this.essence}`)
    }

    private getEssenceForLevel(level: number): number {
        return this.maxEssenceMap.get(level) || 0;
    }

    protected computeSnapshot(): WarmstoneState {
        return {
            maxVitality: this.maxVitality,
            currentVitality: this.currentVitality,
            essence: this.essence,
        }
    }

}

export const warmstone = new Warmstone(200);