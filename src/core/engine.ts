import {type BuildingState, BuildingBase} from "./buildings";
import {Wisp} from "./wisps.ts";
import {buildingsData} from "./data/buildings-data.ts";
import {Warmstone, type WarmstoneState} from "./warmstone.ts";

export type GameAction =
    | { type: "TICK"; payload: { deltaTime: number } }
    | { type: "ASSIGN_WISP"; payload: { buildingId: string } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: string } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: string } }


export type GameState = {
    resources: GameResources;
    buildings: { [key: string]: BuildingState };
    warmstone: WarmstoneState;
};

export type GameResources = {
    gold: number;
    lumber: number;
    stone: number;
    tools: number;
}

export class GameEngine {
    private cachedState: GameState | null = null;
    private isDirty: boolean = true;

    private listeners = new Set<() => void>();
    public readonly dispatch: (action: GameAction) => void;

    private resources: GameResources = {gold: 0, lumber: 0, stone: 0, tools: 0};

    private buildings: Map<string, BuildingBase> = new Map();

    private warmstone: Warmstone;

    private wisps: Wisp[] = []

    constructor() {

        // find a better way to handle
        this.buildings.set('woodcutter', new BuildingBase('woodcutter', buildingsData.woodcutter));
        this.buildings.set('quarry', new BuildingBase('quarry', buildingsData.quarry));

        this.wisps.push(new Wisp());
        this.warmstone = new Warmstone(100);

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

                if (this.warmstone.update(deltaTime)) {
                    this.isDirty = true;
                }

                this.getAssignedWisps().forEach(wisp => {
                    const production = wisp.currentAssignment?.calculateProduction(deltaTime);
                    if (production) {
                        // this.resources[production.resource] += production.amount;
                        if (production.resource === 'lumber') this.resources.lumber += production.amount;
                        if (production.resource === 'stone') this.resources.stone += production.amount;

                        if (production.amount > 0) {
                            this.isDirty = true;
                        }
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
                freeWisp.isAssigned = true;
                freeWisp.currentAssignment = this.buildings.get(buildingId);
                this.isDirty = true;
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
            buildingsState[building.id] = building.getState();
        });

        this.cachedState = {
            resources: {...this.resources}, // Return copies
            buildings: buildingsState,
            warmstone: this.warmstone.getState()
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