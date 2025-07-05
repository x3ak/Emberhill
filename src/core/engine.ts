import {Building} from "./Building.ts";
import {Wisp} from "./wisps.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import {warmstone, type WarmstoneState} from "./warmstone.ts";
import {GameResources} from "./resources.ts";
import {type BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {GameCommand} from "./commands.ts";
import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";

export const SIMULATION_SPEED: number = 1;

export type PlayerCommand =
    | { type: "TICK"; }
    | { type: "ASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: BuildingId } }
    | { type: 'SET_PROCESS'; payload: { buildingId: BuildingId; processId: ProcessId } }
    | { type: 'UNSET_PROCESS'; payload: { buildingId: BuildingId; } }


export type GameState = {
    warmstone: WarmstoneState;
    wisps: {
        freeWisps: number,
        busyWisps: number,
    }
};


export class GameEngine extends Subscribable<GameState, typeof EmptyBase>(EmptyBase) {

    private lastTickTime: number = performance.now();

    public readonly dispatch: (action: PlayerCommand) => void;

    public readonly resources: GameResources = new GameResources();

    private buildings: Map<BuildingId, Building> = new Map();

    private wisps: Wisp[] = []

    constructor() {

        super();
        // find a better way to handle
        this.buildings.set('woodcutter', new Building(BUILDINGS.woodcutter));
        this.buildings.set('campfire', new Building(BUILDINGS.campfire));

        this.wisps.push(new Wisp());
        this.wisps.push(new Wisp());

        this.dispatch = this._dispatch.bind(this);

    }

    public getBuilding(buildingId:BuildingId): Building {

        if (!this.buildings.has(buildingId)) {
            throw new Error(`Building ${buildingId} not found!`);
        }

        // @ts-ignore
        return this.buildings.get(buildingId);
    }

    computeSnapshot(): GameState {
        return {
            warmstone: warmstone.getState(),
            wisps: {
                freeWisps: this.wisps.filter(wisp => !wisp.isAssigned).length,
                busyWisps: this.wisps.filter(wisp => wisp.isAssigned).length,
            }
        };

    }

    private _dispatch(playerCommand: PlayerCommand) {
        const gameCommands: GameCommand[] = [];

        const now = performance.now();
        const deltaTime = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;

        this.runUpdates(deltaTime, gameCommands);

        this.reducePlayerCommands(playerCommand);
        this.reduceGameCommands(gameCommands);

        this.buildings.forEach((building) => {
            building.postUpdate()
            building.getCurrentProcess()?.postUpdate()
        })

        this.resources.postUpdate();
        this.postUpdate();
    }

    private runUpdates(deltaTime: number, gameCommands: GameCommand[]): void {
        if (warmstone.update(deltaTime)) {
            this.setDirty()
        }

        this.getAssignedWisps()
            .forEach(wisp => {
                if (!wisp.currentAssignment) {
                    return;
                }

                wisp.currentAssignment.update(deltaTime, gameCommands);

                wisp.currentAssignment.getCurrentProcess()?.update(deltaTime, gameCommands);
            });
    }

    private reducePlayerCommands(command: PlayerCommand) {
        // console.log(action)
        switch (command.type) {
            case 'TICK': {
                // is handled before in runUpdates
                break;
            }

            case 'ASSIGN_WISP': {
                const freeWisp = this.getUnassignedWisp();
                if (!freeWisp) {
                    break;
                }

                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.assignWisp(freeWisp);

                break;
            }

            case 'UNASSIGN_WISP': {
                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.unassignWisp();

                break;
            }

            case 'SET_PROCESS': {
                const {buildingId, processId} = command.payload;
                const processData: ProcessData | null = BUILDINGS[buildingId].processes[processId] || null;
                if (!processData) {
                    break
                }

                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.setProcess(processData);

                break;
            }

            case 'UNSET_PROCESS': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.unsetProcess();

                break;
            }

            case 'UPGRADE_BUILDING': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.upgrade();

                break;
            }
        }
    }

    private reduceGameCommands(gameCommands: GameCommand[]) {
        if (gameCommands.length === 0) {
            return;
        }

        gameCommands.forEach(command => {
            console.log("GAME_COMMAND", command);
            switch (command.type) {
                case 'SPEND_RESOURCES':
                    this.resources.spend(command.payload.resources)
                    break;
                case 'ADD_RESOURCES':
                    this.resources.add(command.payload.resources)
                    break;
                case 'ADD_XP':
                    this.buildings.get(command.payload.buildingId)?.addXP(command.payload.amount)
                    break;
            }
        })

        this.setDirty()
    }

    private getUnassignedWisp(): Wisp | undefined {
        return this.wisps.find(wisp => !wisp.isAssigned);
    }

    private getAssignedWisps(): Wisp[] {
        return this.wisps.filter(wisp => wisp.isAssigned);
    }
}

export const game = new GameEngine();