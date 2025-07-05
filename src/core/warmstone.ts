import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";
import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";


export class Warmstone extends Subscribable<WarmstoneState, typeof EmptyBase>(EmptyBase) {

    private currentVitality: number;
    private maxVitality: number;

    private vitalityDrainInterval: number = 2; // every N seconds drain vitality
    private vitalityDrainAmount: number = 10; // drain this amount of vitality
    private timeSinceLastDrain: number = 0;

    constructor(vitality: number) {
        super()
        this.currentVitality = vitality;
        this.maxVitality = vitality;
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


    protected computeSnapshot(): WarmstoneState {
        return {
            maxVitality: this.maxVitality,
            currentVitality: this.currentVitality,
        }
    }

}

export const warmstone = new Warmstone(200);