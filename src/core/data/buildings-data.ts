import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {woodcutterData} from "./buildings/woodcutter.data.ts";
import {campfireData} from "./buildings/campfire.data.ts";
import {mineData} from "./buildings/mine.data.ts";

export const BUILDINGS: Record<BuildingId, BuildingData> = {
    woodcutter: woodcutterData,
    campfire: campfireData,
    mine: mineData,
}

