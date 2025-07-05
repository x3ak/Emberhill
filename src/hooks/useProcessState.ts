import {uiStateManager} from "../ui/UIStateManager.ts";
import {useSyncExternalStore} from "react";
import type {ProcessId, ProcessState} from "@/shared/types/process.type.ts";

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