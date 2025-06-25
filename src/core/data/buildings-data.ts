import type {BuildingProduction} from "../buildings.ts";

export type BuildingId = 'woodcutter' | 'quarry';

export type BuildingData = {
    name:  string;
    baseProduction: BuildingProduction
}

type BuildingsData = Record<BuildingId, BuildingData>;

export const buildingsData: BuildingsData = {
    woodcutter: {
        name: "Woodcutter's Lodge",
        baseProduction: {
            resource: 'lumber',
            amount: 1,
        }
    },
    quarry: {
        name: "Stone Quarry",
        baseProduction: {
            resource: 'stone',
            amount: 1 / 5, // 1 stone in 5 seconds
        }
    }
}