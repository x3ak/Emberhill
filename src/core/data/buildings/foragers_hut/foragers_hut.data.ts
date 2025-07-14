import type {BuildingData} from "@/shared/types/building.types.ts";
import {foragingProcesses} from "./foraging.processes.ts";
import {foragingProgression} from "@/core/data/buildings/foragers_hut/foraging.progression.ts";

export const foragers_hutData: BuildingData = {
    id: "foragers_hut",
    name: "Forager's Hut",
    processes: foragingProcesses,
    progression: foragingProgression,
}