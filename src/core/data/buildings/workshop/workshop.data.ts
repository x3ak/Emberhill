import type {BuildingData} from "@/shared/types/building.types.ts";
import {workshopProcesses} from "./workshop.processes.ts";
import {workshopProgression} from "@/core/data/buildings/workshop/workshopProgression.ts";

export const workshopData: BuildingData = {
    id: "workshop",
    name: "Workshop",
    processes: workshopProcesses,
    progression: workshopProgression,
}