import {foragingProcesses} from "./foraging.processes.ts";
import {foragingProgression} from "./foraging.progression.ts";
import type {BuildingData} from "@/shared/types/game.types.ts";

export const foragers_hutData: BuildingData = {
    id: "foragers_hut",
    name: "Forager's Hut",
    processes: foragingProcesses,
    progression: foragingProgression,
}