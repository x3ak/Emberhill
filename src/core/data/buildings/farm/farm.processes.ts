import type {ProcessId} from "@/shared/types/process.types.ts";
import grow_blackberries from '@/process-icon/grow_blackberries.png';
import till_soil from '@/process-icon/till_soil.png';
import type {ProcessData} from "@/shared/types/game.types.ts";

export const farmingProcesses: {[key in ProcessId]?: ProcessData} = {
    grow_blackberries: {
        id: "grow_blackberries",
        name: "Grow Blackberries",
        icon: grow_blackberries,
        description: "Assign a Wisp to search the nearby thickets and undergrowth. A basic but necessary act of survival. Primarily yields berries, but occasionally, something more interesting might be found among the roots and leaves.",
        duration: 50,
        xp: 15,
        text: "You found a handful of plump, dark berries near a mossy rock: ",
        inputs: [
            {type: "resource", id: "BLACKBERRY_SEED", amount: 5},
            {type: "resource", id: "CRUDE_HOE", amount: 5},
        ],
        outputs: [
            { type: "resource", id: "BERRIES", amount: 20 },

        ],
        effects: [],
    },
    till_soil: {
        id: "till_soil",
        name: "Till the Soil",
        icon: till_soil,
        description: "With a rhythmic push and pull, the Wisp guides the hoe through the compacted ground. The earth gives way, turning from a hard, unyielding surface into a dark, crumbly bed, rich with the smell of moisture and new potential. The plot is prepared.",
        duration: 50,
        xp: 16,
        text: "You found a handful of plump, dark berries near a mossy rock: ",
        inputs: [
            {type: "resource", id: "LOG_BIRCH", amount: 10},
            {type: "resource", id: "CRUDE_HOE", amount: 5},
        ],
        outputs: [
            { type: "resource", id: "TILLED_EARTH", amount: 20 },

        ],
        effects: [],
    },
}