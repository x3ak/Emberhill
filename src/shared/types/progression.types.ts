import type {ProcessId} from "@/shared/types/process.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import type {ResourceAmount} from "@/shared/types/game.types.ts";

export type UnlockReward =
    | { type: "unlock_process"; processId: ProcessId; }
    | { type: "unlock_building"; buildingId: BuildingId }
    | { type: "grant_wisp"; amount: number }
    | { type: "global_modifier"; modifier: string; value: number };

export type BuildingLevelUp = {
    xp: number;
    resources: ResourceAmount[];
    rewards: UnlockReward[];
}

export type ProgressionData = {
    [level: number]: BuildingLevelUp
}