import type {ProcessData, ProcessId} from "@/shared/types/process.types.ts";

export const farmingProcesses: {[key in ProcessId]?: ProcessData} = {
    grow_blackberries: {
        id: "grow_blackberries",
        name: "Grow Blackberries",
        description: "Assign a Wisp to search the nearby thickets and undergrowth. A basic but necessary act of survival. Primarily yields berries, but occasionally, something more interesting might be found among the roots and leaves.",
        duration: 50,
        xp: 15,
        text: "You found a handful of plump, dark berries near a mossy rock: ",
        inputs: [],
        outputs: [
            { type: "resource", id: "BERRIES", amount: 20 },

        ],
        effects: [],
    },
}