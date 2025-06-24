export type BuildingState = {
    id: string;
    level: number;
    wispAssigned: boolean;
}

export interface BuildingInterface {
    id: string;
    level: number;
    wispAssigned: boolean;

    assignWisp(shouldAssign: boolean): void;

    calculateProduction(deltaTime: number): { resource: string, amount: number };

     getState(): BuildingState;
}

export abstract class BuildingBase implements BuildingInterface {
    public id: string;
    public level: number = 1;
    public wispAssigned: boolean = false;

    constructor(id: string) {
        this.id = id;
    }

    assignWisp(shouldAssign: boolean): void {
        this.wispAssigned = shouldAssign;
    }

    upgrade(): void {
        // Here we MUTATE the instance state. This is fine inside the engine.
        this.level++;
    }

    // This method must be implemented by concrete classes
    abstract calculateProduction(deltaTime: number): { resource: string, amount: number };

     getState(): BuildingState {
        return {
            id: this.id,
            level: this.level,
            wispAssigned: this.wispAssigned,
            // You can add more derived state here if needed
        };
    }

}

export class Woodcutter extends BuildingBase {
    constructor() {
        super('woodcutter');
    }

    calculateProduction(deltaTime: number): { resource: 'lumber', amount: number } {
        // if (!this.wispAssigned) return { resource: 'lumber', amount: 0 };

        const production = Math.pow(this.level, 2) * deltaTime;
        
        return { resource: 'lumber', amount: production };
    }
}

export class Quarry extends BuildingBase {
    constructor() {
        super('quarry');
    }

    calculateProduction(deltaTime: number): { resource: 'stone', amount: number } {
        if (!this.wispAssigned) return { resource: 'stone', amount: 0 };
        const production = Math.pow(this.level, 1.8) * deltaTime;
        return { resource: 'stone', amount: production };
    }
}