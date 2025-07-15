import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {woodcutterData} from "./buildings/woodcutter/woodcutter.data.ts";
import {campfireData} from "./buildings/campfire/campfire.data.ts";
import {mineData} from "./buildings/mine/mine.data.ts";
import {foragers_hutData} from "./buildings/foragers_hut/foragers_hut.data.ts";
import {workshopData} from "./buildings/workshop/workshop.data.ts";
import {farmData} from "./buildings/farm/farm.data.ts";

export const BUILDINGS: {[ key in BuildingId]?: BuildingData} = {
    woodcutter: woodcutterData,
    campfire: campfireData,
    mine: mineData,
    foragers_hut: foragers_hutData,
    farm: farmData,
    workshop: workshopData,
}

