import {workshopProcesses} from "./workshop.processes.ts";
import {workshopProgression} from "./workshop.progression.ts";
import type {BuildingData} from "@/shared/types/game.types.ts";

export const workshopData: BuildingData = {
    id: "workshop",
    name: "Workshop",
    processes: workshopProcesses,
    progression: workshopProgression,
}