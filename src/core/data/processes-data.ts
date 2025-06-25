export type ProcessInputOutput = {
    type: string;
    id: string;
    amount: number;
};

export type ProcessRequirement = {
    type: string;
    id: string;
    amount: number;
}

export type ProcessData = {
    id: string;
    name: string;
    description: string;
    requirements: ProcessRequirement[];
    inputs: ProcessInputOutput[];
    outputs: ProcessInputOutput[];
}

export const processesDatabase: Record<string, ProcessData> = {
    cut_oak_tree: {
        id: "cut_oak_tree",
        name: "Cut Oak Tree",
        description: "Use an axe on a tree!",
        requirements: [
            {type: "building_level", id: "woodcutter", amount: 1},
        ],
        inputs: [
            {type: "time", id: "time", amount: 5},
        ],
        outputs: [
            {type: "resource", id: "log_oak", amount: 1},
        ]
    },
}