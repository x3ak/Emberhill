import type {ProcessData} from "@/shared/types/process.type.ts";

export const AllBuildingIds = [
    'woodcutter',
    'campfire',
] as const;

export type BuildingId = typeof AllBuildingIds[number];

export type BuildingData = {
    id: BuildingId;
    name: string;
    processes: ProcessData[],
}