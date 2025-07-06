import type {BuildingData} from "@/shared/types/building.types.ts";
import {campfireProcesses} from "./campfire.processes.ts";

export const campfireData: BuildingData = {
    id: "campfire",
    name: "Campfire",
    processes: campfireProcesses,
    progression: {}
}