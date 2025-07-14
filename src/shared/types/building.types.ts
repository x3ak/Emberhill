import type {ProcessData, ProcessId} from "@/shared/types/process.types.ts";
import type {ProgressionData} from "@/shared/types/progression.types.ts";

export const AllBuildingIds = [
    'woodcutter',
    'campfire',
    'mine',
    'foragers_hut',
    'farm',
] as const;

export type BuildingId = typeof AllBuildingIds[number];


export type BuildingData = {
    id: BuildingId;
    name: string;
    processes: {[key in ProcessId]?: ProcessData},
    progression: ProgressionData,
}

export type BuildingState = {
    id: BuildingId;
    level: number;
    xp: number;
    isUnlocked: boolean;
    wispAssigned: boolean;
    canLevelUp: boolean;
    currentProcessId: ProcessId | null;
}