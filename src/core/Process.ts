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
}

export class Process extends Subscribable<ProcessState, typeof EmptyBase>(EmptyBase)  {
    private building: Building;
    private isProcessing: boolean = false;
    private secondsSpentProcessing: number = 0;
    private processData: ProcessData;
    private isActive: boolean = false;
    private isUnlocked: boolean = false;

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
    public setActive(active: boolean): void {
        this.isActive = active;
        this.setDirty();
    }

    public init() {

    }

    public ready() {

    }

    public update(deltaTime: number, commands: GameCommand[]) {

        if (!this.isActive || !this.isUnlocked) {
            return;
        }

        this.secondsSpentProcessing += deltaTime;
        const maxCyclesByTime = Math.floor(this.secondsSpentProcessing / this.processData.duration);

        // enough time waiting to get more than one process completed
        if (maxCyclesByTime > 1) {
            for (let i = 1; i < maxCyclesByTime; i++) {
                if (this.processData.inputs.length > 0) {
                    if (gameInstance.resources.hasEnoughAfterPlanned(this.processData.inputs, commands)) {
                        commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.processData.inputs}})
                    } else {
                        // no resources to start the iteration
                        break;
                    }
                }

                if (this.processData.outputs.length > 0) {
                    commands.push({type: 'ADD_RESOURCES', payload: {resources: this.processData.outputs}});
                }

                commands.push({ type: 'ADD_XP', payload: { buildingId: this.building.buildingData.id, amount: this.processData.xp } });
            }

            this.secondsSpentProcessing -= this.processData.duration * (maxCyclesByTime - 1);
        }

        // start processing
        if (!this.isProcessing) {
            if (this.processData.inputs.length > 0 && gameInstance.resources.hasEnoughAfterPlanned(this.processData.inputs, commands)) {
                this.isProcessing = true;
                this.secondsSpentProcessing = 0;
                commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.processData.inputs}})
            } else if (this.processData.inputs.length === 0) {
                this.isProcessing = true;
                this.secondsSpentProcessing = 0;


            }
        }

        if (this.isProcessing) {
            if (this.secondsSpentProcessing >= this.processData.duration) {
                this.secondsSpentProcessing -= this.processData.duration;

                if (this.processData.outputs.length > 0) {
                    commands.push({type: 'ADD_RESOURCES', payload: {resources: this.processData.outputs}});
                }

                commands.push({ type: 'ADD_XP', payload: { buildingId: this.building.buildingData.id, amount: this.processData.xp } });

                if (this.processData.inputs.length > 0) {
                    if (gameInstance.resources.hasEnoughAfterPlanned(this.processData.inputs, commands)) {
                        commands.push({type: 'SPEND_RESOURCES', payload: {resources: this.processData.inputs}})
                    } else {
                        this.isProcessing = false;
                    }
                }
            }
        }

        this.setDirty();
    }

    protected computeSnapshot(): ProcessState {
        return {
            id: this.processData.id,
            processId: this.processData.id,
            secondsSpent: this.secondsSpentProcessing,
            duration: this.processData.duration,
            timeLeft: this.processData.duration - this.secondsSpentProcessing,
            percentage: this.secondsSpentProcessing / this.processData.duration,
            isProcessing: this.isProcessing,
            isActive: this.isActive,
            isUnlocked: this.isUnlocked,
        };
    }
}
