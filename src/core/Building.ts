import type {Wisp} from "./wisps.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingData, BuildingLevelUp, BuildingState} from "@/shared/types/building.types.ts";
import type {GameCommand} from "./commands.ts";
import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";
import {Process} from "./Process.ts";
import {gameInstance} from "./engine.ts";


export class Building extends Subscribable<BuildingState, typeof EmptyBase>(EmptyBase)  {

    public level: number = 1;
    private xp: number = 0;

    public wisp: Wisp | null = null;

    public buildingData: BuildingData;

    private canLevelUp: boolean = false;

    private levelUpData: BuildingLevelUp | null = null;

    public processes: Map<ProcessId, Process> = new Map<ProcessId, Process>()

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
                const process = new Process(this, processData);
                this.processes.set(processId as ProcessId, process);
            }
        }
    }

    private checkIfProcessesUnlocked() {
        this.processes.forEach(process => process.checkIfUnlocked());
    }

    public getCurrentProcess(): Process | null {

        return this.currentProcess;
    }

    public getProcesses(): Map<ProcessId, Process> {
        return this.processes;
    }

    public getProcess(processId: ProcessId): Process | null {
        return this.processes.get(processId) || null;
    }

    setProcess(process: ProcessData): void {

        const processObject = this.processes.get(process.id);
        if (!processObject) {
            return;
        }
        this.currentProcess = processObject;


        this.setDirty();
    }

    unsetProcess(): void {
        if (!this.currentProcess) {
            return;
        }

        this.currentProcess = null;


        this.setDirty();
    }

    assignWisp(wisp: Wisp): void {
        this.wisp = wisp;
        wisp.isAssigned = true;
        wisp.currentAssignment = this;

        this.setDirty();
    }

    unassignWisp(): void {
        if (!this.wisp) {
            return;
        }

        this.wisp.isAssigned = false;
        this.wisp.currentAssignment = undefined;
        this.wisp = null;

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
        gameInstance.resources.spend(this.levelUpData.resources);
        this.levelUpData = this.buildingData.levels[this.level + 1] || null;
        this.canLevelUp = false;



        this.checkIfProcessesUnlocked();
        this.setDirty();
    }

    init() {

    }

    ready() {
        this.checkIfProcessesUnlocked();

    }

    update(_deltaTime: number, commands: GameCommand[]) {
        const wasAbleToLevelUp = this.canLevelUp;
        if (this.levelUpData) {
            const hasEnoughResources = gameInstance.resources.hasEnoughAfterPlanned( this.levelUpData.resources, commands)

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

