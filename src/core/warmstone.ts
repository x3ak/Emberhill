export type WarmstoneState = {
    currentVitality: number,
    maxVitality: number
}

export class Warmstone {
    private currentVitality: number;
    private maxVitality: number;

    private vitalityDrainInterval: number = 2; // every N seconds drain vitality
    private vitalityDrainAmount: number = 10; // drain this amount of vitality
    private timeSinceLastDrain: number = 0;

    constructor(vitality: number) {
        this.currentVitality = vitality;
        this.maxVitality = vitality;
    }

    public update(deltaTime: number): boolean {
        let didChange: boolean = false;
        this.timeSinceLastDrain += deltaTime;

        if (this.timeSinceLastDrain >= this.vitalityDrainInterval) {
            this.currentVitality -= this.vitalityDrainAmount;
            this.timeSinceLastDrain -= this.vitalityDrainInterval;

            if (this.currentVitality < 0) {
                this.currentVitality = 0;
            } else {
                didChange = true;
            }
        }

        return false;
    }

    restoreVitality(amount: number) {
        this.currentVitality = Math.min(this.currentVitality + amount, this.maxVitality);
    }

    public setState(state: WarmstoneState) {
        this.currentVitality = state.currentVitality;
        this.maxVitality = state.maxVitality;
    }

    public getState(): WarmstoneState {
        return {
            maxVitality: this.maxVitality,
            currentVitality: this.currentVitality,
        }
    }
}

export const warmstone = new Warmstone(200);