import type {Wisp} from "./wisps.ts";
import {game} from "./engine.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingData, BuildingLevelUp} from "@/shared/types/building.types.ts";
import type {GameCommand} from "./commands.ts";
import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";
import {Process} from "./Process.ts";

export type BuildingState = {
    id: string;
    level: number;
    xp: number;
    wispAssigned: boolean;
    canLevelUp: boolean;
    currentProcessId: ProcessId | null;
}

export class Building extends Subscribable<BuildingState, typeof EmptyBase>(EmptyBase)  {

    public level: number = 1;
    private xp: number = 0;

    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private canLevelUp: boolean = false;

    private levelUpData: BuildingLevelUp | null = null;

    private processes: Map<ProcessId, Process> = new Map<ProcessId, Process>()

    private currentProcess: Process | null = null;

    constructor(buildingData: BuildingData) {
        super();

        this.buildingData = buildingData;

        this.levelUpData = buildingData.levels[this.level + 1] || null;

        this.initialiseProcessObjects();
    }

    private initialiseProcessObjects(): void {
        for (const processId in this.buildingData.processes) {
            const processData = this.buildingData.processes[processId as ProcessId];
            if (processData) {
                this.processes.set(processId as ProcessId, new Process(this, processData));
            }
        }
    }

    public getCurrentProcess(): Process | null {
        return this.currentProcess;
    }

    public getProcess(processId: ProcessId): Process | null {
        return this.processes.get(processId) || null;
    }

    setProcess(process: ProcessData): void {

        const processObject = this.processes.get(process.id);
        if (!processObject) {
            return;
        }

        if (this.currentProcess) {
            this.currentProcess.setActive(false)
        }

        this.currentProcess = processObject;

        const hasWispAssigned = this.wisp != null;
        this.currentProcess.setActive(hasWispAssigned);

        this.setDirty();
    }

    unsetProcess(): void {
        if (!this.currentProcess) {
            return;
        }

        this.currentProcess.setActive(false);
        this.currentProcess = null;


        this.setDirty();
    }

    assignWisp(wisp: Wisp): void {
        this.wisp = wisp;
        wisp.isAssigned = true;
        wisp.currentAssignment = this;

        if (this.currentProcess) {
            this.currentProcess.setActive(true);
        }

        this.setDirty();
    }

    unassignWisp(): void {
        if (!this.wisp) {
            return;
        }

        this.wisp.isAssigned = false;
        this.wisp.currentAssignment = undefined;
        this.wisp = null;

        if (this.currentProcess) {
            this.currentProcess.setActive(false);
        }

        this.setDirty();
    }

    addXP(amount: number) {
        this.xp += amount;

        if (this.levelUpData) {
            this.xp = Math.min(this.xp, this.levelUpData.xp);
        }

        this.setDirty();

    }

    upgrade() {
        if (!this.levelUpData || !this.canLevelUp) {
            return;
        }

        this.level += 1;
        this.xp = 0;
        game.resources.spend(this.levelUpData.resources);
        this.levelUpData = this.buildingData.levels[this.level + 1] || null;
        this.canLevelUp = false;

        this.setDirty();
    }

    update(_deltaTime: number, commands: GameCommand[]) {
        const wasAbleToLevelUp = this.canLevelUp;
        if (this.levelUpData) {
            const hasEnoughResources = game.resources.hasEnoughAfterPlanned( this.levelUpData.resources, commands)

            if (!hasEnoughResources) {
                this.canLevelUp = false;
            } else if(this.xp >= this.levelUpData.xp) {
                this.canLevelUp = true;
            }

            if (this.canLevelUp != wasAbleToLevelUp) {
                this.setDirty();
            }
        }
    }

    protected computeSnapshot(): BuildingState {
        return {
            id: this.buildingData.id,
            level: this.level,
            xp: this.xp,
            wispAssigned: !!this.wisp,
            canLevelUp: this.canLevelUp,
            currentProcessId: this.currentProcess?.getId() || null,
        };
    }
}

