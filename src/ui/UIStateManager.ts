import { EventBus } from './EventBus';

import {workerAPI} from "../core/worker.api.ts";
import type {WorkerEvent} from "@/shared/types/worker.events.ts";
import type {BuildingState, ProcessState, ResourcesState, WarmstoneState} from "@/shared/types/game.types.ts";

// Define the "map" of all possible events and their data types
type GameEventMap = {
    [key: `building-${string}`]: BuildingState; // e.g., 'building-sawmill', 'building-woodcutter'
    [key: `process-${string}`]: ProcessState; // e.g., 'building-sawmill', 'building-woodcutter'
    resources: ResourcesState;
    warmstone: WarmstoneState;
};

class StateManager {
    public eventBus = new EventBus<GameEventMap>();
    private lastKnownState: Record<string, any> = {}; // A cache to hold the latest state

    private onReadyCallbacks = new Set<() => void>();
    private isInitialized = false;

    constructor() {
        workerAPI.subscribeToEvents(this.handleWorkerEvent.bind(this));
    }

    public initialize() {
        if (this.isInitialized) return;

        // This sends the request to the worker
        workerAPI.requestInitialState();
        this.isInitialized = true;
    }

    // A method for App.tsx to subscribe to the ready event
    public onReady(callback: () => void): () => void {
        this.onReadyCallbacks.add(callback);
        return () => this.onReadyCallbacks.delete(callback);
    }

    // This would be called inside handleWorkerEvent when the initial state arrives
    private fireReadyCallbacks() {
        this.onReadyCallbacks.forEach(cb => cb());
    }

    private handleWorkerEvent(event: WorkerEvent) {


        switch (event.type) {
            case 'INITIAL_STATE': {
                this.lastKnownState['resources'] = event.payload.resources;
                this.lastKnownState['warmstone'] = event.payload.warmstone;

                event.payload.buildings.forEach(buildingState => {
                    this.lastKnownState[`building-${buildingState.id}`] = buildingState;
                })

                event.payload.processes.forEach(processState => {
                    this.lastKnownState[`process-${processState.id}`] = processState;
                })

                // populate states
                this.fireReadyCallbacks();
                break;
            }
            case 'BUILDING_UPDATE': {
                const topic = `building-${event.payload.id}` as const;
                this.lastKnownState[topic] = event.payload;
                this.eventBus.emit(topic, event.payload);
                break;
            }
            case 'PROCESS_UPDATE': {
                const topic = `process-${event.payload.id}` as const;
                this.lastKnownState[topic] = event.payload;
                this.eventBus.emit(topic, event.payload);
                break;
            }
            case 'RESOURCE_UPDATE': {
                const topic = 'resources';
                this.lastKnownState[topic] = event.payload;
                this.eventBus.emit(topic, event.payload);
                break;
            }
            case 'WARMSTONE_UPDATE': {
                const topic = 'warmstone';
                this.lastKnownState[topic] = event.payload;
                this.eventBus.emit(topic, event.payload);
                break;
            }
        }

    }

    // A way for hooks to get the most recent data on initial render
    public getLatestState<T>(topic: keyof GameEventMap): T {
        return this.lastKnownState[topic] as T;
    }
}

export const uiStateManager = new StateManager();