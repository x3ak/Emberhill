import type {ProcessId} from "@/shared/types/processes.types.ts";
import collect_berries from '@/process-icon/pick_berries.png';
import kindling from '@/process-icon/kingling.png';
import fibers from '@/process-icon/vine.png';
import type {ProcessData} from "@/shared/types/game.types.ts";

export const foragingProcesses: {[key in ProcessId]?: ProcessData} = {
    //forage for edibles( different items can fall randomly)
    collect_berries: {
        id: "collect_berries",
        name: "Collect Berries",
        icon: collect_berries,
        description: "Assign a Wisp to search the nearby thickets and undergrowth. A basic but necessary act of survival. Primarily yields berries, but occasionally, something more interesting might be found among the roots and leaves.",
        duration: 30,
        xp: 6,
        text: "You found a handful of plump, dark berries near a mossy rock: ",
        inputs: [],
        outputs: [
            { type: "resource", id: "BERRIES", amount: 5 },
            { type: "resource", id: "BLACKBERRY_SEED", amount: 2, chance: 0.05 },
           // { type: "resource", id: "STRAWBERRY_SEED", amount: 2, chance: 0.08},
        ],
        effects: [],
    },
    gather_kindling: {
        id: "gather_kindling",
        name: "Gather Kindling",
        icon: kindling,
        description: "A bundle of dry, brittle twigs, bark, and pinecones. Catches fire far more readily than a whole log. An essential component for starting and maintaining a reliable flame.",
        duration: 40,
        xp: 8,
        text: "You find a perfect bundle of dry twigs under a fern: ",
        inputs: [],
        outputs: [
            { type: "resource", id: "TWIGS", amount: 3 }
        ],
        effects: [],
    },
    collect_fibers: {
        //forage for materials (fibers, twigs ... etc)
        id: "collect_fibers",
        name: "Gather Plant fibers",
        icon: fibers,
        description: "A bundle of dry, brittle twigs, bark, and pinecones. Catches fire far more readily than a whole log. An essential component for starting and maintaining a reliable flame.",
        duration: 35,
        xp: 6,
        text: "Untangling these vines is tedious, but the fibers are high quality: ",
        inputs: [],
        outputs: [
            { type: "resource", id: "FIBER", amount: 4 },
            { type: "resource", id: "WEED_SEED", amount: 2, chance: 0.3},

        ],
        effects: [],
    }
}