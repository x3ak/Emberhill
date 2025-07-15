import type {
    BuildingState,
    FullGameState,
    ProcessState,
    ResourcesState,
    WarmstoneState
} from "@/shared/types/game.types.ts";

export type WorkerEvent =
    | { type: "INITIAL_STATE"; payload: FullGameState}
    | { type: "BUILDING_UPDATE"; payload: BuildingState}
    | { type: "PROCESS_UPDATE"; payload: ProcessState}
    | { type: "RESOURCE_UPDATE"; payload: ResourcesState}
    | { type: "WARMSTONE_UPDATE"; payload: WarmstoneState}