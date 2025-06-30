import type {BuildingId} from "@/shared/types/building.types.ts";
import type {ResourceAmount} from "@/shared/types/process.type.ts";

export type GameCommand =
    | { type: "SPEND_RESOURCES"; payload: { resources: ResourceAmount[]}}
    | { type: "ADD_RESOURCES"; payload: { resources: ResourceAmount[]}}
    | { type: "ADD_XP"; payload: { buildingId: BuildingId; amount: number}}
    | { type: "RESTORE_VITALITY"; payload: { amount: number}}
