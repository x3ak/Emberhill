import type {Wisp} from "./wisps.ts";
import {game} from "./engine.ts";
import {warmstone} from "./warmstone.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingData, BuildingLevelUp} from "@/shared/types/building.types.ts";
import type {GameCommand} from "./commands.ts";

export type BuildingState = {
    id: string;
    level: number;
    xp: number;
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
    private xp: number = 0;

    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private secondsSpentProcessing: number = 0;

    private isProcessing: boolean = false;

    private activeProcess: ProcessData | undefined;

    private levelUpData: BuildingLevelUp | null = null;

    private isDirty: boolean = false;

    constructor(buildingData: BuildingData) {
        this.buildingData = buildingData;

        this.levelUpData = buildingData.levels[this.level + 1] || null;
    }

    setProcess(process: ProcessData): void {
        this.activeProcess = process;
        this.isProcessing = false;
        this.secondsSpentProcessing = 0;
        this.isDirty = true;
    }

    unsetProcess(): void {
        this.activeProcess = undefined;
        this.isProcessing = false;
        this.secondsSpentProcessing = 0;
        this.isDirty = true;
    }

    assignWisp(wisp: Wisp): void {
        this.wisp = wisp;
        wisp.isAssigned = true;
        wisp.currentAssignment = this;
        this.isDirty = true;
    }

    unassignWisp(): void {
        if (!this.wisp) {
            return;
        }

        this.wisp.isAssigned = false;
        this.wisp.currentAssignment = undefined;
        this.isProcessing = false;
        this.wisp = null;
        this.isDirty = true;
    }

    addXP(amount: number) {
        this.xp += amount;

        if (this.levelUpData) {
            this.xp = Math.min(this.xp, this.levelUpData.xp)
        }
    }

    update(deltaTime: number, commands: GameCommand[]): {hasChangedState: boolean} {

        if (!this.wisp || !this.activeProcess) {
            return {hasChangedState: false};
        }

        const wasProcessing = this.isProcessing;

        this.secondsSpentProcessing += deltaTime;
        const maxCyclesByTime = Math.floor(this.secondsSpentProcessing / this.activeProcess.duration);

        // enough time waiting to get more than one process completed
        if (maxCyclesByTime > 1) {
            for (let i = 1; i < maxCyclesByTime; i++) {
                if (this.activeProcess.inputs.length > 0) {
                    if (game.resources.hasEnoughAfterPlanned(this.activeProcess.inputs, commands)) {
                        commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.activeProcess.inputs}})
                    } else {
                        // no resources to start the iteration
                        break;
                    }
                }

                if (this.activeProcess.outputs.length > 0) {
                    commands.push({type: 'ADD_RESOURCES', payload: {resources: this.activeProcess.outputs}});
                }

                commands.push({ type: 'ADD_XP', payload: { buildingId: this.buildingData.id, amount: this.activeProcess.xp } });
            }

            this.secondsSpentProcessing -= this.activeProcess.duration * (maxCyclesByTime - 1);
        }

        // start processing
        if (!this.isProcessing) {
            if (this.activeProcess.inputs.length > 0 && game.resources.hasEnoughAfterPlanned(this.activeProcess.inputs, commands)) {
                this.isProcessing = true;
                this.secondsSpentProcessing = 0;
                commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.activeProcess.inputs}})
            } else if (this.activeProcess.inputs.length === 0) {
                this.isProcessing = true;
                this.secondsSpentProcessing = 0;


            }
        }

        if (this.isProcessing) {
            if (this.secondsSpentProcessing >= this.activeProcess.duration) {
                this.secondsSpentProcessing -= this.activeProcess.duration;

                if (this.activeProcess.outputs.length > 0) {
                    commands.push({type: 'ADD_RESOURCES', payload: {resources: this.activeProcess.outputs}});
                }

                commands.push({ type: 'ADD_XP', payload: { buildingId: this.buildingData.id, amount: this.activeProcess.xp } });

                if (this.activeProcess.inputs.length > 0) {
                    if (game.resources.hasEnoughAfterPlanned(this.activeProcess.inputs, commands)) {
                        commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.activeProcess.inputs}})
                    } else {
                        this.isProcessing = false;
                    }
                }
            }
        }

        return {hasChangedState: wasProcessing !== this.isProcessing}
    }

    updateOld(deltaTime: number): void {
        if (!this.wisp || !this.activeProcess) {
            return;
        }

        let lastSecondsData = this.secondsSpentProcessing;

        // start the process
        if (!this.isProcessing) {
            if (this.secondsSpentProcessing > 0) {
                this.isProcessing = true;
            } else if (game.resources.hasEnoughToStartTheProcess(this.activeProcess.inputs)) {
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

                // reward xp
                this.xp += this.activeProcess.xp;

                if (this.levelUpData) {
                    this.xp = Math.min(this.xp, this.levelUpData.xp)
                }


                if (game.resources.hasEnoughToStartTheProcess(this.activeProcess.inputs)) {
                    game.resources.spendResourcesForProcess(this.activeProcess.inputs);

                } else {
                    this.isProcessing = false;
                }

                this.secondsSpentProcessing -= this.activeProcess.duration;
            }

        }

        this.isDirty = lastSecondsData !== this.secondsSpentProcessing;
    }

    hasChanged(): boolean {
        return this.isDirty;
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
            xp: this.xp,
            wispAssigned: !!this.wisp,
            isProcessing: this.isProcessing,
            activeProcess: activeProcess,
        };
    }

}

