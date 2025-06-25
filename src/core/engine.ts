import {type BuildingState, BuildingBase} from "./buildings";
import {Wisp} from "./wisps.ts";
import {buildingsData} from "./data/buildings-data.ts";
import {warmstone, type WarmstoneState} from "./warmstone.ts";
import {type ProcessData, processesDatabase} from "./data/processes-data.ts";

export type GameAction =
    | { type: "TICK"; payload: { deltaTime: number } }
    | { type: "ASSIGN_WISP"; payload: { buildingId: string } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: string } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: string } }
    | { type: 'START_PROCESS'; payload: { buildingId: string; processId: string } }


export type GameState = {
    resources: GameResources;
    buildings: { [key: string]: BuildingState };
    warmstone: WarmstoneState;
};

export type GameResources = {
    gold: number;
    log_oak: number;
}

export class GameEngine {
    private cachedState: GameState | null = null;
    private isDirty: boolean = true;

    private listeners = new Set<() => void>();
    public readonly dispatch: (action: GameAction) => void;

    private resources: GameResources = {gold: 0, log_oak: 0};

    private buildings: Map<string, BuildingBase> = new Map();

    private wisps: Wisp[] = []

    constructor() {

        // find a better way to handle
        this.buildings.set('woodcutter', new BuildingBase(buildingsData.woodcutter));
        this.buildings.set('campfire', new BuildingBase( buildingsData.campfire));

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

            case 'UNASSIGN_WISP': {
                const {buildingId} = action.payload;

                const unassignedWisp = this.buildings.get(buildingId)?.unassignWisp();

                if (unassignedWisp) {
                    unassignedWisp.isAssigned = false;
                    unassignedWisp.currentAssignment = undefined;
                }

                this.isDirty = true;
                break;
            }

            case 'START_PROCESS': {
                const {buildingId, processId} = action.payload;
                const processData: ProcessData = processesDatabase[processId];
                const unassignedWisp = this.getUnassignedWisp();

                if (!unassignedWisp) {
                    break;
                }

                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                unassignedWisp.isAssigned = true;
                unassignedWisp.currentAssignment = building;
                building.startProcess(processData, unassignedWisp);

                this.isDirty = true;
                break;
            }
        }
    }

    addResource(resourceName: string, amount: number) {
        switch (resourceName) {
            case 'log_oak':
                this.resources.log_oak += amount;
                break;
        }

        this.isDirty = true;
    }

    hasResource(resourceName: string, amount: number): boolean {
        switch (resourceName) {
            case 'log_oak':
                return this.resources.log_oak >= amount;
        }

        return false;
    }

    // return true if we had enough resources
    subResource(resourceName: string, amount: number): void {
        switch (resourceName) {
            case 'log_oak':
                if (this.resources.log_oak >= amount) {
                    this.resources.log_oak -= amount;
                    this.isDirty = true;
                }
        }

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
            resources: {...this.resources}, // Return copies
            buildings: buildingsState,
            warmstone: warmstone.getState()
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