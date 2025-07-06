import type {ProcessData, ProcessId, ResourceAmount} from "@/shared/types/process.types.ts";

export const AllBuildingIds = [
    'woodcutter',
    'campfire',
    'mine',
] as const;

export type BuildingId = typeof AllBuildingIds[number];

export type BuildingLevelUp = {
    resources: ResourceAmount[],
    xp: number,
}

export type BuildingData = {
    id: BuildingId;
    name: string;
    processes: {[key in ProcessId]?: ProcessData},
    levels: Record<number, BuildingLevelUp>,
}

export type BuildingState = {
    id: BuildingId;
    level: number;
    xp: number;
    wispAssigned: boolean;
    canLevelUp: boolean;
    currentProcessId: ProcessId | null;
}