import type {BuildingState} from "../core/Building.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {uiStateManager} from "../ui/UIStateManager.ts";
import {useSyncExternalStore} from "react";

export function useBuildingState(buildingId: BuildingId): BuildingState {
    const topic = `building-${buildingId}` as const;

    const subscribe = (onStoreChange: () => void)=> {
        return uiStateManager.eventBus.on(topic, onStoreChange);
    }

    const getSnapshot = () => {
        return uiStateManager.getLatestState<BuildingState>(topic);
    };

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}