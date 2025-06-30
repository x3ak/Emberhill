import type {ProcessData, ProcessInputOutput} from "@/shared/types/process.type.ts";

export const AllBuildingIds = [
    'woodcutter',
    'campfire',
] as const;

export type BuildingId = typeof AllBuildingIds[number];

export type BuildingLevelUp = {
    resources: ProcessInputOutput[],
    xp: number,
}

export type BuildingData = {
    id: BuildingId;
    name: string;
    processes: ProcessData[],
    levels: Record<number, BuildingLevelUp>,
}