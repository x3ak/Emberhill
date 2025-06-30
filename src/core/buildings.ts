import type {Wisp} from "./wisps.ts";
import {game} from "./engine.ts";
import {warmstone} from "./warmstone.ts";
import type {ProcessData, ProcessId, ResourceAmount} from "@/shared/types/process.type.ts";
import type {BuildingData, BuildingLevelUp} from "@/shared/types/building.types.ts";
import type {GameCommand} from "./commands.ts";
import type {ResourceId} from "@/shared/types/resource.types.ts";

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

    constructor(buildingData: BuildingData) {
        this.buildingData = buildingData;

        this.levelUpData = buildingData.levels[this.level + 1] || null;
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


    hasEnoughAfterPlanned(cost: ResourceAmount[], plannedSpends: GameCommand[]): boolean {
        if (cost.length == 0) {
            return true;
        }

        const spendMap = new Map<ResourceId, number>();

        plannedSpends
            .filter(s => s.type == "SPEND_RESOURCES")
            .flatMap(s => s.payload.resources)
            .forEach(spend => {
                spendMap.set(spend.id, (spendMap.get(spend.id) || 0) + spend.amount);
            })

        for (const costItem of cost) {
            const currentAmount = game.resources.getAmount(costItem.id);
            const plannedAmount = spendMap.get(costItem.id) || 0;

            if (costItem.amount > currentAmount - plannedAmount) {
                return false;
            }
        }

        return true;
    }

    update(deltaTime: number): GameCommand[] {

        const commands: GameCommand[] = [];

        if (!this.wisp) {
            return commands;
        }

        if (!this.activeProcess) {
            return commands;
        }

        // start the process
        if (!this.isProcessing) {
            if (this.secondsSpentProcessing > 0) {
                this.isProcessing = true;
            } else if (this.hasEnoughAfterPlanned(this.activeProcess.inputs, commands)) {
                this.isProcessing = true;
                this.secondsSpentProcessing = 0;

                if (this.activeProcess.inputs.length > 0) {
                    commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.activeProcess.inputs}})
                }
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
                commands.push({ type: 'ADD_RESOURCES', payload: { resources: this.activeProcess.outputs } });
                commands.push({ type: 'ADD_XP', payload: { buildingId: this.buildingData.id, amount: this.activeProcess.xp } });

                if (this.activeProcess.inputs.length > 0) {
                    if (this.hasEnoughAfterPlanned(this.activeProcess.inputs, commands)) {
                        commands.push({ type: 'SPEND_RESOURCES', payload: { resources: this.activeProcess.inputs } })

                    } else {
                        this.isProcessing = false;
                    }
                }


                this.secondsSpentProcessing -= this.activeProcess.duration;
            }

        }

        return commands;
    }

    addXP(amount: number) {
        this.xp += amount;

        if (this.levelUpData) {
            this.xp = Math.min(this.xp, this.levelUpData.xp)
        }
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

