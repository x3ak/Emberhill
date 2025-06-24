import { Quarry, Woodcutter, type BuildingInterface } from "./buildings";

export type GameAction = 
 | {type: "TICK"; payload: {deltaTime: number}}
 | {type: "ASSIGN_WISP"; payload: {buildingId: string}}
 | {type: "UNASSIGN_WISP";  payload: {buildingId: string } }
 | { type: 'UPGRADE_BUILDING'; payload: { buildingId: string } }


export type GameState = {
    resources: GameResources;
    buildings: { [key: string]: any }

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

    private resources: GameResources = { gold: 0, lumber: 0, stone: 0, tools: 0};

    private buildings: Map<string, BuildingInterface> = new Map();

    private actionLog: GameAction[] = [];

    constructor() {

        // find a better way to handle
        this.buildings.set('woodcutter', new Woodcutter());
        this.buildings.set('quarry', new Quarry());

        this.dispatch = this._dispatch.bind(this);
    }

    private _dispatch(action: GameAction) {
        this.reduce(action);

        
        const lastAction = this.actionLog[this.actionLog.length - 1];
        if (action.type === 'TICK' && lastAction?.type === 'TICK') {
             const newAggregatedTick: GameAction = {
                type: 'TICK',
                payload: {
                    deltaTime: lastAction.payload.deltaTime + action.payload.deltaTime
                }
            };
            // Replace the last action with the new, aggregated one.
            this.actionLog[this.actionLog.length - 1] = newAggregatedTick;
        } else {
            this.actionLog.push(action)
        }

        // Only update and notify if the state has actually changed
        if (this.isDirty) {
            console.log(this.actionLog);

            this.notify();
        }
    }

    private reduce(action: GameAction) {
        switch (action.type) {
            case 'TICK': {
                const { deltaTime } = action.payload;

                this.buildings.forEach(building => {
                    const production = building.calculateProduction(deltaTime);
                    
                    if (production.resource === 'lumber') this.resources.lumber += production.amount;
                    if (production.resource === 'stone') this.resources.stone += production.amount;

                    if (production.amount > 0) {
                        this.isDirty = true;
                    }
                })

                break;
            }
        }
    }

    getState() {
        if (!this.isDirty && this.cachedState) {
            return this.cachedState;
        }

        const buildingsState: { [key: string]: any } = {};

        this.buildings.forEach(building => {
            buildingsState[building.id] = building.getState();
        });

        this.cachedState = {
            resources: { ...this.resources }, // Return copies
            buildings: buildingsState,
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