import {Building} from "./Building.ts";
import {Wisp} from "./wisps.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import {warmstone, type WarmstoneState} from "./warmstone.ts";
import {GameResources} from "./resources.ts";
import {type BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {type ResourceId} from "@/shared/types/resource.types.ts";
import type {GameCommand} from "./commands.ts";
import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";

export type PlayerCommand =
    | { type: "TICK"; payload: { deltaTime: number } }
    | { type: "ASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: BuildingId } }
    | { type: 'SET_PROCESS'; payload: { buildingId: BuildingId; processId: ProcessId } }
    | { type: 'UNSET_PROCESS'; payload: { buildingId: BuildingId; } }


export type GameState = {
    resources: Record<ResourceId, number>;
    warmstone: WarmstoneState;
    wisps: {
        freeWisps: number,
        busyWisps: number,
    }
};


export class GameEngine extends Subscribable<GameState, typeof EmptyBase>(EmptyBase) {

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

    private _dispatch(command: PlayerCommand) {
        this.reducePlayerCommands(command);

        if (this.resources.hasChanged()) {
            this.setDirty()
        }

        this.buildings.forEach((building) => {
            building.postUpdate()
            building.getCurrentProcess()?.postUpdate()
        })

        this.postUpdate();

    }

    private reducePlayerCommands(command: PlayerCommand) {
        // console.log(action)
        switch (command.type) {
            case 'TICK': {
                const {deltaTime} = command.payload;

                if (warmstone.update(deltaTime)) {
                    this.setDirty()
                }

                // check for work at buildings

                const gameCommands: GameCommand[] = [];
                let hasStateChanges = false;

                this.getAssignedWisps()
                    .filter(wisp => wisp.currentAssignment !== undefined)
                    .forEach(wisp => {
                        if (!wisp.currentAssignment) {
                            return;
                        }

                        const buildingUpdateResult = wisp.currentAssignment.update(deltaTime, gameCommands);

                        wisp.currentAssignment.getCurrentProcess()?.update(deltaTime, gameCommands);

                        if (buildingUpdateResult.hasChangedState) {
                            hasStateChanges = true;
                        }
                    });


                this.reduceGameCommands(gameCommands);
                if (hasStateChanges) {
                    this.setDirty()
                }


                break;
            }

            case 'ASSIGN_WISP': {
                const freeWisp = this.getUnassignedWisp();
                if (!freeWisp) {
                    break;
                }

                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.assignWisp(freeWisp);

                this.setDirty()
                break;
            }

            case 'UNASSIGN_WISP': {
                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.unassignWisp();

                this.setDirty()
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

                this.setDirty()
                break;
            }

            case 'UNSET_PROCESS': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.unsetProcess();

                this.setDirty()
                break;
            }

            case 'UPGRADE_BUILDING': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.upgrade();

                this.setDirty()
                break;
            }
        }
    }

    reduceGameCommands(gameCommands: GameCommand[]) {
        if (gameCommands.length === 0) {
            return;
        }

        gameCommands.forEach(command => {
            console.log("GAME_COMMAND", command);
            switch (command.type) {
                case 'SPEND_RESOURCES':
                    this.resources.spendResourcesForProcess(command.payload.resources)
                    break;
                case 'ADD_RESOURCES':
                    this.resources.addResourcesFromProcess(command.payload.resources)
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

    computeSnapshot(): GameState {
        return {
            resources: {...this.resources.getResources()}, // Return copies
            warmstone: warmstone.getState(),
            wisps: {
                freeWisps: this.wisps.filter(wisp => !wisp.isAssigned).length,
                busyWisps: this.wisps.filter(wisp => wisp.isAssigned).length,
            }
        };

    }

    public getBuilding(buildingId:BuildingId): Building {

        if (!this.buildings.has(buildingId)) {
            throw new Error(`Building ${buildingId} not found!`);
        }

        // @ts-ignore
        return this.buildings.get(buildingId);

    }
}

export const game = new GameEngine();