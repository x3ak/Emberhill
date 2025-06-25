import type {Wisp} from "./wisps.ts";
import type {BuildingData} from "./data/buildings-data.ts";

export type BuildingProduction = { resource: string, amount: number };

export type BuildingState = {
    id: string;
    name: string;
    level: number;
    wispAssigned: boolean;
    data: BuildingData;
}

export class BuildingBase {
    public id: string;
    public level: number = 1;
    public wisp: Wisp | null = null

    public buildingData: BuildingData;

    private secondsSpentProducing: number = 0;

    constructor(id: string, buildingData: BuildingData) {
        this.id = id;
        this.buildingData = buildingData;
    }

    assignWisp(wisp: Wisp): void {
        this.wisp = wisp;
    }

    unassignWisp(): Wisp | null {
        const wisp = this.wisp;
        this.wisp = null;

        return wisp;
    }

    // This method must be implemented by concrete classes
    calculateProduction(deltaTime: number): BuildingProduction | null {
        if (!this.wisp) return null;

        this.secondsSpentProducing += deltaTime;

        const productionVolume = this.buildingData.baseProduction;

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

    getState(): BuildingState {
        return {
            id: this.id,
            level: this.level,
            name: this.buildingData.name,
            wispAssigned: !!this.wisp,
            data: this.buildingData,


            // You can add more derived state here if needed
        };
    }

}
