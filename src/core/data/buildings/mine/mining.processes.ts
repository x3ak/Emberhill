import type {ProcessId} from "@/shared/types/processes.types.ts";
import type {ProcessData} from "@/shared/types/game.types.ts";

export const miningProcesses: {[key in ProcessId]?: ProcessData} = {
    mine_stone: {
        id: "mine_stone",
        name: "Mine Stone",
        description: "Quarry basic stone from the mountainside. An essential, versatile building material for any foundation.",
        duration: 5,
        xp: 5,
        text: "The rhythmic chip-chip of the pickaxe echoes.",
        inputs: [],
        outputs: [
            { type: "resource", id: "STONE", amount: 2 }
        ],
        effects: []
    },
    mine_copper_ore: {
        id: "mine_copper_ore",
        name: "Mine Copper Ore",
        description: "Extract veins of copper, a soft, reddish metal. Simple to work with and a vital first step for any smith.",
        duration: 15,
        xp: 15,
        text: "A glint of reddish-brown signals a successful find.",
        inputs: [],
        outputs: [
            { type: "resource", id: "ORE_COPPER", amount: 1 }
        ],
        effects: []
    },
}