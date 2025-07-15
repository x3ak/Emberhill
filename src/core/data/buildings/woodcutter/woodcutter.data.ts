import {woodcutterProcesses} from "./woodcutter.processes.ts";
import {woodcutterProgression} from "./woodcutter.progression.ts";
import type {BuildingData} from "@/shared/types/game.types.ts";

export const woodcutterData: BuildingData = {
    id: "woodcutter",
    name: "Woodcutter's Lodge",
    processes: woodcutterProcesses,
    progression: woodcutterProgression,
}