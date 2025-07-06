import {woodcutterProcesses} from "./woodcutter.processes.ts";
import type {BuildingData} from "@/shared/types/building.types.ts";
import {woodcutterProgression} from "./woodcutter.progression.ts";

export const woodcutterData: BuildingData = {
    id: "woodcutter",
    name: "Woodcutter's Lodge",
    processes: woodcutterProcesses,
    progression: woodcutterProgression,
}