import type {FullGameState} from "../../core/engine.ts";
import type {BuildingState} from "../../core/Building.ts";
import type {ProcessState} from "../../core/Process.ts";
import type {ResourcesState} from "../../core/resources.ts";

export type WorkerEvent =
    | { type: "INITIAL_STATE"; payload: FullGameState}
    | { type: "BUILDING_UPDATE"; payload: BuildingState}
    | { type: "PROCESS_UPDATE"; payload: ProcessState}
    | { type: "RESOURCE_UPDATE"; payload: ResourcesState}