import {uiStateManager} from "../ui/UIStateManager.ts";
import {useSyncExternalStore} from "react";
import type {ResourcesState} from "../core/resources.ts";

export function useResourcesState(): ResourcesState {
    const topic = `resources` as const;

    const subscribe = (onStoreChange: () => void)=> {
        return uiStateManager.eventBus.on(topic, onStoreChange);
    }

    const getSnapshot = () => {
        return uiStateManager.getLatestState<ResourcesState>(topic);
    };

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}