import {type BuildingState, BuildingBase} from "./buildings";
import {Wisp} from "./wisps.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import {warmstone, type WarmstoneState} from "./warmstone.ts";
import {PROCESSES} from "./data/processes-data.ts";
import {GameResources} from "./resources.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type { ResourceId } from "@/shared/types/resource.types.ts";

export type GameAction =
    | { type: "TICK"; payload: { deltaTime: number } }
    | { type: "ASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: BuildingId } }
    | { type: 'SET_PROCESS'; payload: { buildingId: BuildingId; processId: ProcessId } }
    | { type: 'UNSET_PROCESS'; payload: { buildingId: BuildingId; } }


export type GameState = {
    resources: Record<ResourceId, number>;
    buildings: { [key: string]: BuildingState };
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
    public readonly dispatch: (action: GameAction) => void;

    public readonly resources: GameResources = new GameResources();

    private buildings: Map<BuildingId, BuildingBase> = new Map();

    private wisps: Wisp[] = []

    constructor() {

        // find a better way to handle
        this.buildings.set('woodcutter', new BuildingBase(BUILDINGS.woodcutter));
        this.buildings.set('campfire', new BuildingBase( BUILDINGS.campfire));

        this.wisps.push(new Wisp());

        this.dispatch = this._dispatch.bind(this);

    }

    private _dispatch(action: GameAction) {
        this.reduce(action);

        // Only update and notify if the state has actually changed
        if (this.isDirty) {
            this.notify();
        }
    }

    private reduce(action: GameAction) {
        switch (action.type) {
            case 'TICK': {
                const {deltaTime} = action.payload;

                if (warmstone.update(deltaTime)) {
                    this.isDirty = true;
                }

                // check for work at buildings
                this.getAssignedWisps().forEach(wisp => {
                    const production = wisp.currentAssignment?.update(deltaTime);

                    if (production) {
                        this.isDirty = true;
                    }
                })


                break;
            }

            case 'ASSIGN_WISP': {
                const freeWisp = this.getUnassignedWisp();
                if (!freeWisp) {
                    break;
                }

                const {buildingId} = action.payload;
                this.buildings.get(buildingId)?.assignWisp(freeWisp);

                this.isDirty = true;
                break;
            }

            case 'UNASSIGN_WISP': {
                const {buildingId} = action.payload;
                this.buildings.get(buildingId)?.unassignWisp();

                this.isDirty = true;
                break;
            }

            case 'SET_PROCESS': {
                const {buildingId, processId} = action.payload;
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
                const {buildingId} = action.payload;
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

    public markStateDirty(): void {
        this.isDirty = true;
    }

    private getUnassignedWisp() : Wisp | undefined {
        return this.wisps.find(wisp => !wisp.isAssigned);
    }

    private getAssignedWisps() : Wisp[] {
        return this.wisps.filter(wisp => wisp.isAssigned);
    }

    getState() {
        if (!this.isDirty && this.cachedState) {
            return this.cachedState;
        }

        const buildingsState: { [key: string]: BuildingState } = {};

        this.buildings.forEach(building => {
            buildingsState[building.buildingData.id] = building.getState();
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