
import type {Settlement} from "@/shared/types/world.types.ts";

export const SETTLEMENTS: {[ key in string]?: Settlement} = {
    settlement_0: { id: "settlement_0", x: 176, y: 105, name: "Unnamed Settlement", connections: [{id: "settlement_7", travelCost: 115},{id: "settlement_5", travelCost: 134},{id: "settlement_6", travelCost: 136}] },
    settlement_1: { id: "settlement_1", x: 138, y: 353, name: "Unnamed Settlement", connections: [{id: "settlement_3", travelCost: 157}] },
    settlement_2: { id: "settlement_2", x: 368, y: 137, name: "Unnamed Settlement", connections: [{id: "settlement_7", travelCost: 142},{id: "settlement_3", travelCost: 132}] },
    settlement_3: { id: "settlement_3", x: 263, y: 263, name: "Unnamed Settlement", connections: [{id: "settlement_4", travelCost: 116},{id: "settlement_1", travelCost: 157},{id: "settlement_2", travelCost: 132}] },
    settlement_4: { id: "settlement_4", x: 369, y: 374, name: "Unnamed Settlement", connections: [{id: "settlement_3", travelCost: 116}] },
    settlement_5: { id: "settlement_5", x: 47, y: 11, name: "Unnamed Settlement", connections: [{id: "settlement_0", travelCost: 134}] },
    settlement_6: { id: "settlement_6", x: 45, y: 199, name: "Unnamed Settlement", connections: [{id: "settlement_0", travelCost: 136}] },
    settlement_7: { id: "settlement_7", x: 288, y: 0, name: "Unnamed Settlement", connections: [{id: "settlement_0", travelCost: 115},{id: "settlement_2", travelCost: 142}] },
}
    