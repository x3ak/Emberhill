import {useSyncExternalStore} from "react";
import {game, type PlayerCommand, type GameState} from "../core/engine";
import type {BuildingId} from "@/shared/types/building.types.ts";
import type {BuildingState} from "../core/Building.ts";
import type {ProcessId} from "@/shared/types/process.type.ts";
import type {ProcessState} from "../core/Process.ts";
import type {ResourcesState} from "../core/resources.ts";

export type Dispatch = (action: PlayerCommand) => void;

export function useGameState(): GameState {
    return useSyncExternalStore(
        game.subscribe.bind(game),
        game.getSnapshot.bind(game)
    );
}

export function useGameDispatch(): Dispatch {
    return game.dispatch.bind(game);
}

export function useBuildingState(buildingId: BuildingId): BuildingState {
    const building = game.getBuilding(buildingId);
    return useSyncExternalStore(
        building.subscribe.bind(building),
        building.getSnapshot.bind(building)
    );
}

export function useProcessState(buildingId: BuildingId, processId: ProcessId): ProcessState {
    const building = game.getBuilding(buildingId);
    const process = building.getProcess(processId);

    if (!process) {
        throw new Error(`Process ${processId} in building ${buildingId} not found!`);
    }

    return useSyncExternalStore(
        process.subscribe.bind(process),
        process.getSnapshot.bind(process)
    );
}

export function useResourcesState(): ResourcesState {
    return useSyncExternalStore(
        game.resources.subscribe.bind(game.resources),
        game.resources.getSnapshot.bind(game.resources)
    );
}

