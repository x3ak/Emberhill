export type WarmstoneState = {
    currentVitality: number,
    maxVitality: number
}

export class Warmstone {
    private currentVitality: number;
    private maxVitality: number;

    private vitalityDrainInterval: number = 2; // every N seconds drain 1 vitality
    private timeSinceLastDrain: number = 0;

    constructor(vitality: number) {
        this.currentVitality = vitality;
        this.maxVitality = vitality;
    }

    public update(deltaTime: number): boolean {
        let didChange: boolean = false;
        this.timeSinceLastDrain += deltaTime;

        if (this.timeSinceLastDrain >= this.vitalityDrainInterval) {
            this.currentVitality--;
            this.timeSinceLastDrain -= this.vitalityDrainInterval;

            if (this.currentVitality < 0) {
                this.currentVitality = 0;
            } else {
                didChange = true;
            }
        }

        // this.currentVitality = Math.max(this.currentVitality, 0);

        return didChange;
    }

    restoreVitality(amount: number) {
        this.currentVitality = Math.min(this.currentVitality + amount, this.maxVitality);
    }

    public getState(): WarmstoneState {
        return {
            maxVitality: this.maxVitality,
            currentVitality: this.currentVitality,
        }
    }
}

export const warmstone = new Warmstone(200);