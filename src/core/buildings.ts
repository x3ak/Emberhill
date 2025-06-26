import type {Wisp} from "./wisps.ts";
import type {BuildingData} from "./data/buildings-data.ts";
import type {ProcessData, ProcessInputOutput} from "./data/processes-data.ts";
import {game} from "./engine.ts";
import {warmstone} from "./warmstone.ts";

export type BuildingState = {
    id: string;
    name: string;
    level: number;
    wispAssigned: boolean;
    availableProcesses: ProcessData[];
    currentProcess: ProcessData | undefined;
}

export class BuildingBase {
    public level: number = 1;
    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private secondsSpentProcessing: number = 0;

    private isProcessing: boolean = false;

    private currentProcess: ProcessData | undefined;

    constructor(buildingData: BuildingData) {
        this.buildingData = buildingData;
    }

    setProcess(process:ProcessData): void {
        this.currentProcess = process;
    }

    unsetProcess(): void {
        this.currentProcess = undefined;
    }

    assignWisp(wisp: Wisp): void {
        this.wisp = wisp;
        wisp.isAssigned = true;
        wisp.currentAssignment = this;
    }

    unassignWisp(): void {
        if (!this.wisp) {
            return;
        }

        this.wisp.isAssigned = false;
        this.wisp.currentAssignment = undefined;
        this.wisp = null;
    }


    update(deltaTime: number): void {
        if (!this.wisp || !this.currentProcess) {
            this.isProcessing = false;
            this.secondsSpentProcessing = 0;
            return;
        }

        // start the process
        if (!this.isProcessing && this.hasEnoughResourcesToStartTheProcess(this.currentProcess.inputs)) {
            this.isProcessing = true;
            this.secondsSpentProcessing = 0;
            this.spendResourcesForProcess(this.currentProcess.inputs);
        }

        if (this.isProcessing) {
            this.secondsSpentProcessing += deltaTime;

            // apply effects
            this.currentProcess.effects.forEach(effect => {
                if (effect.warmstone_vitality_restoration > 0) {
                    warmstone.restoreVitality(effect.warmstone_vitality_restoration * deltaTime)
                }
            })

            while (this.secondsSpentProcessing >= this.currentProcess.duration) {

                // apply outputs
                this.currentProcess.outputs.forEach(processOutput => {
                    switch (processOutput.type) {
                        case 'resource':
                            game.addResource(processOutput.id, processOutput.amount);
                            break;
                    }
                })

                if (this.hasEnoughResourcesToStartTheProcess(this.currentProcess.inputs)) {
                    this.spendResourcesForProcess(this.currentProcess.inputs);
                } else {
                    this.isProcessing = false;
                }

                this.secondsSpentProcessing -= this.currentProcess.duration;
            }
        }

    }

    private hasEnoughResourcesToStartTheProcess(inputs: ProcessInputOutput[]): boolean {
        let hasEnough = true;
        inputs.forEach(processInput => {
            switch (processInput.type) {
                case 'resource':
                    if (!game.hasResource(processInput.id, processInput.amount)) {
                        hasEnough = false;
                    }
                    break;
            }
        })

        return hasEnough;
    }

    private spendResourcesForProcess(inputs: ProcessInputOutput[]) {
        inputs.forEach(processInput => {
            switch (processInput.type) {
                case 'resource':
                    game.subResource(processInput.id, processInput.amount);
                    break;
            }
        })
    }

    getState(): BuildingState {
        return {
            id: this.buildingData.id,
            level: this.level,
            name: this.buildingData.name,
            wispAssigned: !!this.wisp,
            availableProcesses: this.buildingData.processes,
            currentProcess: this.currentProcess,
        };
    }

}
