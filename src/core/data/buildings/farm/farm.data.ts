import type {BuildingData} from "@/shared/types/building.types.ts";
import {farmingProcesses} from "./farm.processes.ts";
import {farmProgression} from "./farm.progression.ts";


export const farmData: BuildingData = {
    id: "farm",
    name: "Farm",
    processes: farmingProcesses,
    progression: farmProgression,
}