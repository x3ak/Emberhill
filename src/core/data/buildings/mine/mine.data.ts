import type {BuildingData} from "@/shared/types/building.types.ts";
import {miningProcesses} from "./mining.processes.ts";
import {mineProgression} from "./mine.progression.ts";


export const mineData: BuildingData = {
    id: "mine",
    name: "Mine",
    processes: miningProcesses,
    progression: mineProgression
}