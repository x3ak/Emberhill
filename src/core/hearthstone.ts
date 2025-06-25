export type HearthstoneState = {
    currentVitality: number,
    maxVitality: number
}

export class Hearthstone {
    private currentVitality: number;
    private maxVitality: number;

    private vitalityDrainInterval: number = 5; // every N seconds drain 1 vitality
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
            didChange = true;
        }

        return didChange;
    }

    public getState(): HearthstoneState{
        return {
            maxVitality: this.currentVitality,
            currentVitality: this.maxVitality,
        }
    }
}