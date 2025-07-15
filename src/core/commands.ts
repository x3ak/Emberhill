import type {BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessId} from "@/shared/types/process.types.ts";
import type {ResourceAmount} from "@/shared/types/game.types.ts";

export type GameCommand =
    | { type: "UPDATE_STATE"; payload: { buildingId: BuildingId } }
    | { type: "SPEND_RESOURCES"; payload: { resources: ResourceAmount[] } }
    | { type: "ADD_RESOURCES"; payload: { resources: ResourceAmount[] } }
    | { type: "ADD_XP"; payload: { buildingId: BuildingId; amount: number } }
    | { type: "RESTORE_VITALITY"; payload: { amount: number } }
    | { type: "UNLOCK_PROCESS"; payload: { processId: ProcessId;  } }
    | { type: "UNLOCK_BUILDING"; payload: { buildingId: BuildingId;  } }
    | { type: "GRANT_WISP"; payload: { amount: number;  } }
    | { type: "ADD_MODIFIER"; payload: { modifier: string; value: number  } }
