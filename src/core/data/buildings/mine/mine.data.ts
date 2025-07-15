import {miningProcesses} from "./mining.processes.ts";
import {mineProgression} from "./mine.progression.ts";
import type {BuildingData} from "@/shared/types/game.types.ts";


export const mineData: BuildingData = {
    id: "mine",
    name: "Mine",
    processes: miningProcesses,
    progression: mineProgression
}