import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";
import type {GameCommand} from "./commands.ts";
import type {Building} from "./Building.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {gameInstance} from "./engine.ts";

export type ProcessState = {
    id: ProcessId;
    processId: ProcessId;
    secondsSpent: number;
    duration: number;
    timeLeft: number;
    percentage: number;
    isProcessing: boolean;
    isActive: boolean;
    isUnlocked: boolean;
    status: ProcessStatus;
}

type ProcessStatus = 'STOPPED' | 'IDLE' | 'PAUSED' | 'RUNNING';

export class Process extends Subscribable<ProcessState, typeof EmptyBase>(EmptyBase)  {
    private building: Building;
    private secondsSpentProcessing: number = 0;
    private processData: ProcessData;
    private isUnlocked: boolean = false;
    private status: ProcessStatus = 'STOPPED';

    constructor(building: Building, processData: ProcessData) {
        super();
        this.building = building;
        this.processData = processData;
    }

    public checkIfUnlocked() {
        if (this.isUnlocked) {
            return;
        }

        this.processData.requirements.forEach(requirement => {
            switch (requirement.type) {
                case "min_building_level":
                    const building = gameInstance.getBuilding(requirement.id);
                    if (building.level >= requirement.amount) {
                        this.isUnlocked = true;
                        this.setDirty()
                    }
                    break;
            }
        })
    }

    public getId(): ProcessId {
        return this.processData.id;
    }

    public init() {

    }

    public ready() {

    }

    private setStatus(newStatus: ProcessStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
            this.setDirty();
        }
    }

    public update(deltaTime: number, commands: GameCommand[]) {

        if (!this.isUnlocked) {
            return;
        }

        if (this.building.wisp && this.building.getCurrentProcess() && this.building.getCurrentProcess()?.getId() == this.getId()) {
            if (this.status === 'PAUSED') {
                this.setStatus('RUNNING');
            } else if (this.status === 'STOPPED') {
                this.setStatus('IDLE');
            }
        } else {
            if (this.status === 'RUNNING') {
                this.setStatus('PAUSED');
            }
            if (this.status === 'IDLE') {
                this.setStatus('STOPPED');
            }
        }

        let timeToProcess = deltaTime;

        while (timeToProcess > 0) {
            let workWasDoneThisIteration = false;

            if (this.status === 'IDLE') {
                if (gameInstance.resources.hasEnoughAfterPlanned(this.processData.inputs, commands)) {
                    commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.processData.inputs}});
                    this.secondsSpentProcessing = 0;
                    this.setStatus('RUNNING');
                } else {
                    break;
                }
            }

            if (this.status === 'RUNNING') {
                const timeNeededToFinish = this.processData.duration - this.secondsSpentProcessing;
                const timeToSpendThisLoop = Math.min(timeToProcess, timeNeededToFinish);

                this.secondsSpentProcessing += timeToSpendThisLoop;
                timeToProcess -= timeToSpendThisLoop;
                this.setDirty();

                workWasDoneThisIteration = true;

                // --- Check for Completion ---
                if (this.secondsSpentProcessing >= this.processData.duration) {
                    commands.push({ type: 'ADD_RESOURCES', payload: { resources: this.processData.outputs } });
                    commands.push({ type: 'ADD_XP', payload: { buildingId: this.building.buildingData.id, amount: this.processData.xp } });
                    this.secondsSpentProcessing -= this.processData.duration;
                    this.setStatus('IDLE');
                }
            }

            if (!workWasDoneThisIteration) {
                break;
            }
        }

    }

    protected computeSnapshot(): ProcessState {

        // console.log(`computeSnapshot ${this.processData.id} ${this.secondsSpentProcessing}`)

        return {
            id: this.processData.id,
            processId: this.processData.id,
            secondsSpent: this.secondsSpentProcessing,
            duration: this.processData.duration,
            timeLeft: this.processData.duration - this.secondsSpentProcessing,
            percentage: this.secondsSpentProcessing / this.processData.duration,
            isProcessing: this.status === 'RUNNING',
            isActive: this.status === 'IDLE' || this.status === 'RUNNING',
            status: this.status,
            isUnlocked: this.isUnlocked,
        };
    }
}
