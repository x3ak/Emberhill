import type {BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessId} from "@/shared/types/process.type.ts";

export type PlayerCommand =
    | { type: "REQUEST_INITIAL_STATE"; }
    | { type: "TICK"; }
    | { type: "ASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: "UNASSIGN_WISP"; payload: { buildingId: BuildingId } }
    | { type: 'UPGRADE_BUILDING'; payload: { buildingId: BuildingId } }
    | { type: 'SET_PROCESS'; payload: { buildingId: BuildingId; processId: ProcessId } }
    | { type: 'UNSET_PROCESS'; payload: { buildingId: BuildingId; } }
