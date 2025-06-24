export type GameState = {
    core: {
        isRunning: boolean,
    }
    resources: {
        gold: number;
        lumber: number;
        
        tools: number;
    }
};


export class GameEngine {
    private state: GameState;
    private listeners = new Set<() => void>();

    tick(deltaTime: number) {
        this.state.resources.gold += deltaTime * 2;
        this.state = { ... this.state}
        
        this.notify();
    }

    constructor() {
        this.state = { resources: {gold: 0, lumber: 0, tools: 0}, core: {isRunning: false} };
    }

    getState() {
        return this.state;
    }

    subscribe(fn: () => void) {
        this.listeners.add(fn);

        return () => this.listeners.delete(fn)
    }

    private notify() {
        for (const fn of this.listeners) fn();
    }

    start(loopDriver: (tick: (dt: number) => void) => void) {
        if (this.state.core.isRunning) return;

        this.state.core.isRunning = true;
        loopDriver((delta) => this.tick(delta));
    }
}

export const game = new GameEngine();