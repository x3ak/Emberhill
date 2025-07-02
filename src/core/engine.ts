import {type BuildingState, BuildingBase} from "./buildings";
import {Wisp} from "./wisps.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import {warmstone, type WarmstoneState} from "./warmstone.ts";
import {PROCESSES} from "./data/processes-data.ts";
import {GameResources} from "./resources.ts";
import {type BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {AllResourceIds, type ResourceId} from "@/shared/types/resource.types.ts";
import type {GameCommand} from "./commands.ts";

export type PlayerCommand =
    | { type: "TICK"; payload: { deltaTime: number } }
    | { type: "ASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: BuildingId } }
    | { type: 'SET_PROCESS'; payload: { buildingId: BuildingId; processId: ProcessId } }
    | { type: 'UNSET_PROCESS'; payload: { buildingId: BuildingId; } }


export type GameState = {
    resources: Record<ResourceId, number>;
    buildings: Map<BuildingId, BuildingState>;
    warmstone: WarmstoneState;
    wisps: {
        freeWisps: number,
        busyWisps: number,
    }
};


export class GameEngine {
    private cachedState: GameState | null = null;
    private isDirty: boolean = true;

    private listeners = new Set<() => void>();
    public readonly dispatch: (action: PlayerCommand) => void;

    public readonly resources: GameResources = new GameResources();

    private buildings: Map<BuildingId, BuildingBase> = new Map();

    private wisps: Wisp[] = []

    constructor() {

        // find a better way to handle
        this.buildings.set('woodcutter', new BuildingBase(BUILDINGS.woodcutter));
        this.buildings.set('campfire', new BuildingBase(BUILDINGS.campfire));

        this.wisps.push(new Wisp());

        this.dispatch = this._dispatch.bind(this);

    }

    private _dispatch(command: PlayerCommand) {
        this.reducePlayerCommands(command);

        if (this.resources.hasChanged()) {
            this.isDirty = true;
        }

        // if (!this.isDirty) {
        //     const hasChangedBuilding = this.getAssignedWisps().find(wisp => wisp.currentAssignment?.hasChanged())
        //     if (hasChangedBuilding) {
        //         this.isDirty = true;
        //     }
        // }

        // Only update and notify if the state has actually changed
        if (this.isDirty) {
            this.notify();
        }
    }

    private reducePlayerCommands(command: PlayerCommand) {
        // console.log(action)
        switch (command.type) {
            case 'TICK': {
                const {deltaTime} = command.payload;

                if (warmstone.update(deltaTime)) {
                    this.isDirty = true;
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

                        const buildingUpdateResult = wisp.currentAssignment.update(deltaTime);

                        gameCommands.push( ...buildingUpdateResult.commands )

                        if (buildingUpdateResult.hasChangedState) {
                            hasStateChanges = true;
                        }
                    });


                this.reduceGameCommands(gameCommands);
                if (hasStateChanges) {
                    this.isDirty = true;
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

                this.isDirty = true;
                break;
            }

            case 'UNASSIGN_WISP': {
                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.unassignWisp();

                this.isDirty = true;
                break;
            }

            case 'SET_PROCESS': {
                const {buildingId, processId} = command.payload;
                const processData: ProcessData = PROCESSES[processId];
                if (!processData) {
                    break
                }

                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.setProcess(processData);

                this.isDirty = true;
                break;
            }

            case 'UNSET_PROCESS': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.unsetProcess();

                this.isDirty = true;
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

        this.isDirty = true;
    }


    public markStateDirty(): void {
        this.isDirty = true;
    }

    private getUnassignedWisp(): Wisp | undefined {
        return this.wisps.find(wisp => !wisp.isAssigned);
    }

    private getAssignedWisps(): Wisp[] {
        return this.wisps.filter(wisp => wisp.isAssigned);
    }

    setState(gameState: GameState): void {
        // set resources
        AllResourceIds.forEach((resourceId) => {
            this.resources.setResource(resourceId, gameState.resources[resourceId] ?? 0);
        });

        warmstone.setState(gameState.warmstone);

        // set building states
        this.buildings.forEach((building: BuildingBase, buildingId: BuildingId) => {
            let buildingState = gameState.buildings.get(buildingId);
            if (buildingState) {
                building.level = buildingState.level || 1;

                if (buildingState.wispAssigned) {
                    let availableWisp = this.getUnassignedWisp();

                    if (availableWisp) {
                        building.assignWisp(availableWisp)
                    }
                }

                if (buildingState.activeProcess?.processId) {
                    building.setProcess(PROCESSES[buildingState.activeProcess?.processId]);
                }
            }
        })

        this.isDirty = true;
    }

    getState() {
        if (!this.isDirty && this.cachedState) {
            return this.cachedState;
        }

        const buildingsState: Map<BuildingId, BuildingState> = new Map();

        this.buildings.forEach(building => {
            buildingsState.set(building.buildingData.id, building.getState());
        });

        this.cachedState = {
            resources: {...this.resources.getResources()}, // Return copies
            buildings: buildingsState,
            warmstone: warmstone.getState(),
            wisps: {
                freeWisps: this.wisps.filter(wisp => !wisp.isAssigned).length,
                busyWisps: this.wisps.filter(wisp => wisp.isAssigned).length,
            }
        };

        this.isDirty = false;
        return this.cachedState;
    }

    subscribe(fn: () => void) {
        this.listeners.add(fn);

        return () => this.listeners.delete(fn)
    }

    private notify() {
        for (const fn of this.listeners) fn();
    }

}

export const game = new GameEngine();