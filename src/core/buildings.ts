import type {Wisp} from "./wisps.ts";
import {game} from "./engine.ts";
import {warmstone} from "./warmstone.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingData} from "@/shared/types/building.types.ts";

export type BuildingState = {
    id: string;
    level: number;
    wispAssigned: boolean;
    isProcessing: boolean;
    activeProcess: {
        processId: ProcessId;
        secondsSpent: number;
        duration: number;
        timeLeft: number;
        percentage: number;
    } | null;
}

export class BuildingBase {
    public level: number = 1;
    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private secondsSpentProcessing: number = 0;

    private isProcessing: boolean = false;

    private activeProcess: ProcessData | undefined;


    constructor(buildingData: BuildingData) {
        this.buildingData = buildingData;
    }

    setProcess(process:ProcessData): void {
        this.activeProcess = process;
        this.isProcessing = false;
        this.secondsSpentProcessing = 0;
    }

    unsetProcess(): void {
        this.activeProcess = undefined;
        this.isProcessing = false;
        this.secondsSpentProcessing = 0;
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
        this.isProcessing = false;
        this.wisp = null;
    }


    update(deltaTime: number): boolean {
        let lastSecondsData = this.secondsSpentProcessing;

        if (!this.wisp) {
            return false;
        }

        if (!this.activeProcess) {
            return false;
        }
        //
        // if (!this.wisp || !this.activeProcess) {
        //     this.isProcessing = false;
        //     this.secondsSpentProcessing = 0;
        //     return lastSecondsData === this.secondsSpentProcessing;
        // }

        // start the process
        if (!this.isProcessing) {
            if (this.secondsSpentProcessing > 0) {
                this.isProcessing = true;
            } else if (game.resources.hasEnoughResourcesToStartTheProcess(this.activeProcess.inputs)) {
                this.isProcessing = true;
                this.secondsSpentProcessing = 0;
                game.resources.spendResourcesForProcess(this.activeProcess.inputs);
            }
        }

        if (this.isProcessing) {
            this.secondsSpentProcessing += deltaTime;

            // apply effects
            this.activeProcess.effects.forEach(effect => {
                if (effect.warmstone_vitality_restoration > 0) {
                    warmstone.restoreVitality(effect.warmstone_vitality_restoration * deltaTime)
                }
            })

            while (this.secondsSpentProcessing >= this.activeProcess.duration) {

                // apply outputs
                game.resources.addResourcesFromProcess(this.activeProcess.outputs);

                if (game.resources.hasEnoughResourcesToStartTheProcess(this.activeProcess.inputs)) {
                    game.resources.spendResourcesForProcess(this.activeProcess.inputs);
                } else {
                    this.isProcessing = false;
                }

                this.secondsSpentProcessing -= this.activeProcess.duration;
            }

        }

        return lastSecondsData === this.secondsSpentProcessing;


    }

    getState(): BuildingState {
        let activeProcess = this.activeProcess ? {
            processId: this.activeProcess.id,
            secondsSpent: this.secondsSpentProcessing,
            duration: this.activeProcess.duration,
            timeLeft: this.activeProcess.duration - this.secondsSpentProcessing,
            percentage: this.secondsSpentProcessing / this.activeProcess.duration
        } : null;

        return {
            id: this.buildingData.id,
            level: this.level,
            wispAssigned: !!this.wisp,
            isProcessing: this.isProcessing,
            activeProcess: activeProcess,
        };
    }

}

