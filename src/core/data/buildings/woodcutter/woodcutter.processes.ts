import type {ProcessId} from "@/shared/types/processes.types.ts";

import treeOak from '@/process-icon/tree_oak.png';
import treeBirch from '@/process-icon/tree_birch.png';
import treePine from '@/process-icon/tree_pine.png';
import treeMaple from '@/process-icon/tree_maple.png';
import type {ProcessData} from "@/shared/types/game.types.ts";

export const woodcutterProcesses: {[key in ProcessId]?: ProcessData} = {
    cut_tree_oak: {
        id: "cut_tree_oak",
        name: "Cut Oak Tree",
        icon: treeOak,
        description: "A sturdy, common hardwood. The backbone of any new settlement, providing reliable logs for basic construction.",
        duration: 5,
        xp: 5,
        text: "The familiar scent of oak fills the air.",
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_OAK", amount: 1 },
            { type: "resource", id: "LOG_OAK", amount: 1, chance: 0.05 }
        ],
        effects: []
    },
    cut_tree_birch: {
        id: "cut_tree_birch",
        name: "Cut Birch Tree",
        icon: treeBirch,
        description: "Fell a slender birch. Its pale wood is light, and its bark has many uses.",
        duration: 15,
        xp: 15,
        text: "The paper-like bark peels away.",
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_BIRCH", amount: 1 }
        ],
        effects: []
    },
    cut_tree_pine: {
        id: "cut_tree_pine",
        name: "Cut Pine Tree",
        icon: treePine,
        description: "Harvest a fragrant pine. Its sticky resin is a valuable secondary resource.",
        duration: 25,
        xp: 25,
        text: "The sharp scent of pine needles is invigorating.",
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_PINE", amount: 1 },
            { type: "resource", id: "RESIN", amount: 1, chance: 0.25 }
        ],
        effects: []
    },
    cut_tree_maple: {
        id: "cut_tree_maple",
        name: "Cut Maple Tree",
        icon: treeMaple,
        description: "A dense, beautiful hardwood prized by carpenters. Takes longer to fell but yields sturdy timber.",
        duration: 50,
        xp: 55,
        text: "The heavy thud of maple echoes through the woods.",
        inputs: [],
        outputs: [
            { type: "resource", id: "LOG_MAPLE", amount: 1 }
        ],
        effects: []
    },
} ;
