import {uiStateManager} from "../ui/UIStateManager.ts";
import {useSyncExternalStore} from "react";

import type {WarmstoneState} from "@/shared/types/game.types.ts";

export function useWarmstoneState(): WarmstoneState {
    const topic = `warmstone` as const;

    const subscribe = (onStoreChange: () => void)=> {
        return uiStateManager.eventBus.on(topic, onStoreChange);
    }

    const getSnapshot = () => {
        return uiStateManager.getLatestState<WarmstoneState>(topic);
    };

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}