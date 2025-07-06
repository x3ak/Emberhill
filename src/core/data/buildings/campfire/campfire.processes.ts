import type {ProcessData, ProcessId} from "@/shared/types/process.types.ts";

export const campfireProcesses: {[key in ProcessId]?: ProcessData} = {
    burn_log_oak: {
        id: "burn_log_oak",
        name: "Burn Oak Log",
        description: "Burn Oak Log to get some warmth into stone",
        duration: 30,
        xp: 5,
        text: "Your spirit feels:",
        inputs: [
            {type: "resource", id: "LOG_OAK", amount: 1}
        ],
        outputs: [],
        effects: [
            {warmstone_vitality_restoration: 10}
        ]
    },
    burn_log_birch: {
        id: "burn_log_birch",
        name: "Burn birch Log",
        description: "Burn birch Log to get some warmth into stone",
        duration: 20,
        xp: 20,
        text: "Your spirit feels:",
        inputs: [
            {type: "resource", id: "LOG_BIRCH", amount: 1}
        ],
        outputs: [],
        effects: [
            {warmstone_vitality_restoration: 10}
        ]
    }
};