import {uiStateManager} from "../ui/UIStateManager.ts";
import {useSyncExternalStore} from "react";
import type {ProcessId} from "@/shared/types/process.types.ts";
import type {ProcessState} from "@/shared/types/game.types.ts";

export function useProcessState(processId: ProcessId): ProcessState {
    const topic = `process-${processId}` as const;

    const subscribe = (onStoreChange: () => void)=> {
        return uiStateManager.eventBus.on(topic, onStoreChange);
    }

    const getSnapshot = () => {
        return uiStateManager.getLatestState<ProcessState>(topic);
    };

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}