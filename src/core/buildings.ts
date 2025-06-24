export type BuildingProduction = { resource: string, amount: number };

export type BuildingState = {
    id: string;
    level: number;
    wispAssigned: boolean;
    production: BuildingProduction;
}


export interface BuildingInterface {
    id: string;
    level: number;
    wispAssigned: boolean;

    assignWisp(shouldAssign: boolean): boolean;

    calculateProduction(deltaTime: number): BuildingProduction | null;

    getState(): BuildingState;
}

export abstract class BuildingBase implements BuildingInterface {
    public id: string;
    public level: number = 1;
    public wispAssigned: boolean = false;

    private secondsSpentProducing: number = 0;

    constructor(id: string) {
        this.id = id;
    }

    assignWisp(shouldAssign: boolean): boolean {
        if (this.wispAssigned == shouldAssign) {
            return false;
        }

        this.wispAssigned = shouldAssign;
        return true;
    }

    upgrade(): void {
        // Here we MUTATE the instance state. This is fine inside the engine.
        this.level++;
    }

    // This method must be implemented by concrete classes
    calculateProduction(deltaTime: number): BuildingProduction | null {
        if (!this.wispAssigned) return null;

        this.secondsSpentProducing += deltaTime;

        const productionVolume = this.productionRatePerSecond();

        const secondsPerItem = 1 / productionVolume.amount;

        let itemsProduced = Math.floor(this.secondsSpentProducing / secondsPerItem);

        if (itemsProduced === 0) return null;

        const timeSpent = itemsProduced * secondsPerItem;

        this.secondsSpentProducing -= timeSpent;

        return {
            resource: productionVolume.resource,
            amount: itemsProduced
        };
    }

    // how much of product should be produced per secondtimeSpentProducing
    abstract productionRatePerSecond(): BuildingProduction;

    getState(): BuildingState {
        return {
            id: this.id,
            level: this.level,
            wispAssigned: this.wispAssigned,
            production: this.productionRatePerSecond()


            // You can add more derived state here if needed
        };
    }

}

export class Woodcutter extends BuildingBase {
    constructor() {
        super('woodcutter');
    }

    productionRatePerSecond(): BuildingProduction {
        return {
            resource: 'lumber',
            amount: 1,
        }
    }
}

export class Quarry extends BuildingBase {
    constructor() {
        super('quarry');
    }

    productionRatePerSecond(): BuildingProduction {
        return {
            resource: 'stone',
            amount: 5,
        }
    }
}