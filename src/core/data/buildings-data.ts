
export type BuildingData = {
    name:  string;
}

type BuildingsData = Record<string, BuildingData>;

export const buildingsData: BuildingsData = {
    woodcutter: {
        name: "Woodcutter's Lodge",
    },
    quarry: {
        name: "Stone Quarry",
    },
    campfire: {
        name: "Campfire",
    }
}