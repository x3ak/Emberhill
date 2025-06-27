import type {ProcessData} from "@/shared/types/process.type.ts";

export type BuildingId =
    | 'woodcutter'
    | 'campfire';

export type BuildingData = {
    id: string;
    name: string;
    processes: ProcessData[],
}