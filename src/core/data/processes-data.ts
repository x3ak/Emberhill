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

export type ProcessEffect = {
    warmstone_vitality_restoration: number; // amount of vitality restored per second
}

export type ProcessData = {
    id: string;
    name: string;
    description: string;
    duration: number; // how much time it takes to perform the process/action
    requirements: ProcessRequirement[];
    inputs: ProcessInputOutput[];
    outputs: ProcessInputOutput[];
    effects: ProcessEffect[];  // effects are applied while the process is active
}

export const processesDatabase: Record<string, ProcessData> = {
    cut_tree_oak: {
        id: "cut_tree_oak",
        name: "Cut Oak Tree",
        description: "Use an axe on an oak tree!",
        duration: 1,
        requirements: [
            {type: "building_level", id: "woodcutter", amount: 1},
        ],
        inputs: [],
        outputs: [
            {type: "resource", id: "log_oak", amount: 1},
        ],
        effects: []
    },
    burn_log_oak: {
        id: "burn_log_oak",
        name: "Burn Oak Log",
        description: "Burn Oak Log to get some warmth into stone",
        duration: 5,
        requirements: [
            {type: "building_level", id: "campfire", amount: 1},
        ],
        inputs: [
            {type: "resource", id: "log_oak", amount: 1}
        ],
        outputs: [],
        effects: [
            {warmstone_vitality_restoration: 1}
        ]
    }
}