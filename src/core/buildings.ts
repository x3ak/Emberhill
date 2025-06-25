import type {Wisp} from "./wisps.ts";
import type {BuildingData} from "./data/buildings-data.ts";
import type {ProcessData} from "./data/processes-data.ts";
import {game} from "./engine.ts";

export type BuildingProduction = { resource: string, amount: number };

export type BuildingState = {
    id: string;
    name: string;
    level: number;
    wispAssigned: boolean;
    data: BuildingData;
    currentProcess: {
        id: string | undefined;
        name: string | undefined;
    };
}

export class BuildingBase {
    public id: string;
    public level: number = 1;
    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private secondsSpentProducing: number = 0;

    private currentProcess: ProcessData | undefined;

    constructor(id: string, buildingData: BuildingData) {
        this.id = id;
        this.buildingData = buildingData;
    }

    startProcess(process:ProcessData, wisp: Wisp): void {
        this.currentProcess = process;
        this.wisp = wisp;
    }

    assignWisp(wisp: Wisp): void {
        this.wisp = wisp;
    }

    unassignWisp(): Wisp | null {
        const wisp = this.wisp;
        this.wisp = null;

        return wisp;
    }


    update(deltaTime: number): void {
        if (!this.wisp) return;
        if (!this.currentProcess) return;

        this.secondsSpentProducing += deltaTime;

        if (this.secondsSpentProducing <= this.currentProcess.duration) {
            return;
        }

        // process completed at least once
        const timesCompleted = Math.floor(this.secondsSpentProducing / this.currentProcess.duration);
        const timeSpent = timesCompleted * this.currentProcess.duration;
        this.secondsSpentProducing -= timeSpent;

        // one by one complete process, it may happen we do not have enough resources
        for(let i = 0; i < timesCompleted; i++) {
            // process inputs
            if (this.currentProcess.inputs.length > 0) {
                // check if we have enough resources for all inputs
                let hasEnough = true;

                this.currentProcess.inputs.forEach(processInput => {
                    switch (processInput.type) {
                        case 'resource':
                            if (!game.hasResource(processInput.id, processInput.amount)) {
                                hasEnough = false;
                            }
                            break;
                    }
                })

                if (!hasEnough) {
                    return;
                }

                // sub resources from game
                this.currentProcess.inputs.forEach(processInput => {
                    switch (processInput.type) {
                        case 'resource':
                            game.subResource(processInput.id, processInput.amount);
                            break;
                    }
                })
            }

            // calculate outputs
            this.currentProcess.outputs.forEach(processOutput => {
                switch (processOutput.type) {
                    case 'resource':
                        game.addResource(processOutput.id, processOutput.amount);
                        break;
                }
            })
        }




    }

    getState(): BuildingState {
        return {
            id: this.id,
            level: this.level,
            name: this.buildingData.name,
            wispAssigned: !!this.wisp,
            data: this.buildingData,
            currentProcess: {
                id: this.currentProcess?.id,
                name: this.currentProcess?.name
            },


            // You can add more derived state here if needed
        };
    }

}
