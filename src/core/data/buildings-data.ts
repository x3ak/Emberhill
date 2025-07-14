import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {woodcutterData} from "./buildings/woodcutter/woodcutter.data.ts";
import {campfireData} from "./buildings/campfire/campfire.data.ts";
import {mineData} from "./buildings/mine/mine.data.ts";
import {foragers_hutData} from "@/core/data/buildings/foragers_hut/foragers_hut.data.ts";
import {farmData} from "@/core/data/buildings/farm/farm.data.ts";

export const BUILDINGS: {[ key in BuildingId]?: BuildingData} = {
    woodcutter: woodcutterData,
    campfire: campfireData,
    mine: mineData,
    foragers_hut: foragers_hutData,
    farm: farmData,
}

