import type {Wisp} from "./wisps.ts";
import {game} from "./engine.ts";
import {warmstone} from "./warmstone.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingData} from "@/shared/types/building.types.ts";

export type BuildingState = {
    id: string;
    level: number;
    wispAssigned: boolean;
    currentProcess: ProcessId | undefined;
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
        if (!this.isProcessing && game.resources.hasEnoughResourcesToStartTheProcess(this.currentProcess.inputs)) {
            this.isProcessing = true;
            this.secondsSpentProcessing = 0;
            game.resources.spendResourcesForProcess(this.currentProcess.inputs);

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
                game.resources.addResourcesFromProcess(this.currentProcess.outputs);

                if (game.resources.hasEnoughResourcesToStartTheProcess(this.currentProcess.inputs)) {
                    game.resources.spendResourcesForProcess(this.currentProcess.inputs);
                } else {
                    this.isProcessing = false;
                }

                this.secondsSpentProcessing -= this.currentProcess.duration;
            }
        }

    }

    getState(): BuildingState {
        return {
            id: this.buildingData.id,
            level: this.level,
            wispAssigned: !!this.wisp,
            currentProcess: this.currentProcess?.id,
        };
    }

}

