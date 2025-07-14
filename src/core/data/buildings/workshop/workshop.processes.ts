import type {ProcessData, ProcessId} from "@/shared/types/process.types.ts";


export const workshopProcesses: {[key in ProcessId]?: ProcessData} = {
    create_crude_hoe: {
        id: "create_crude_hoe",
        name: "Create Crude Hoe",

        description: "A sturdy, common hardwood. The backbone of any new settlement, providing reliable logs for basic construction.",
        duration: 10,
        xp: 5,
        text: "The familiar scent of oak fills the air.",
        inputs: [
            {type: "resource", id: 'LOG_BIRCH', amount: 1},
            {type: "resource", id: 'FIBER', amount: 2},
        ],
        outputs: [
            { type: "resource", id: "CRUDE_HOE", amount: 1 },


        ],
        effects: []
    },
}