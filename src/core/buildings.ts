import type {Wisp} from "./wisps.ts";
import {game} from "./engine.ts";
import {warmstone} from "./warmstone.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingData} from "@/shared/types/building.types.ts";

export type BuildingState = {
    id: string;
    level: number;
    wispAssigned: boolean;
    activeProcessId: ProcessId | undefined;
}

export class BuildingBase {
    public level: number = 1;
    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private secondsSpentProcessing: number = 0;

    private isProcessing: boolean = false;

    private activeProcessId: ProcessData | undefined;

    constructor(buildingData: BuildingData) {
        this.buildingData = buildingData;
    }

    setProcess(process:ProcessData): void {
        this.activeProcessId = process;
    }

    unsetProcess(): void {
        this.activeProcessId = undefined;
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
        if (!this.wisp || !this.activeProcessId) {
            this.isProcessing = false;
            this.secondsSpentProcessing = 0;
            return;
        }

        // start the process
        if (!this.isProcessing && game.resources.hasEnoughResourcesToStartTheProcess(this.activeProcessId.inputs)) {
            this.isProcessing = true;
            this.secondsSpentProcessing = 0;
            game.resources.spendResourcesForProcess(this.activeProcessId.inputs);

        }

        if (this.isProcessing) {
            this.secondsSpentProcessing += deltaTime;

            // apply effects
            this.activeProcessId.effects.forEach(effect => {
                if (effect.warmstone_vitality_restoration > 0) {
                    warmstone.restoreVitality(effect.warmstone_vitality_restoration * deltaTime)
                }
            })

            while (this.secondsSpentProcessing >= this.activeProcessId.duration) {

                // apply outputs
                game.resources.addResourcesFromProcess(this.activeProcessId.outputs);

                if (game.resources.hasEnoughResourcesToStartTheProcess(this.activeProcessId.inputs)) {
                    game.resources.spendResourcesForProcess(this.activeProcessId.inputs);
                } else {
                    this.isProcessing = false;
                }

                this.secondsSpentProcessing -= this.activeProcessId.duration;
            }
        }

    }

    getState(): BuildingState {
        return {
            id: this.buildingData.id,
            level: this.level,
            wispAssigned: !!this.wisp,
            activeProcessId: this.activeProcessId?.id,
        };
    }

}

