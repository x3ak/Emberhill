import {farmingProcesses} from "./farm.processes.ts";
import {farmProgression} from "./farm.progression.ts";
import type {BuildingData} from "@/shared/types/game.types.ts";


export const farmData: BuildingData = {
    id: "farm",
    name: "Farm",
    processes: farmingProcesses,
    progression: farmProgression,
}