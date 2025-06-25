export type BuildingId = 'woodcutter' | 'quarry';

export type BuildingData = {
    name:  string;
}

type BuildingsData = Record<BuildingId, BuildingData>;

export const buildingsData: BuildingsData = {
    woodcutter: {
        name: "Woodcutter's Lodge",
    },
    quarry: {
        name: "Stone Quarry",
    }
}