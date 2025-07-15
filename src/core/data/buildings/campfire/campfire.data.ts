import {campfireProcesses} from "./campfire.processes.ts";
import type {BuildingData} from "@/shared/types/game.types.ts";

export const campfireData: BuildingData = {
    id: "campfire",
    name: "Campfire",
    processes: campfireProcesses,
    progression: {}
}