import type {BuildingState} from "@/shared/types/building.types.ts";
import type {FullGameState, ProcessState, ResourcesState} from "@/shared/types/game.types.ts";
import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";

export type WorkerEvent =
    | { type: "INITIAL_STATE"; payload: FullGameState}
    | { type: "BUILDING_UPDATE"; payload: BuildingState}
    | { type: "PROCESS_UPDATE"; payload: ProcessState}
    | { type: "RESOURCE_UPDATE"; payload: ResourcesState}
    | { type: "WARMSTONE_UPDATE"; payload: WarmstoneState}