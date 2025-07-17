import type {Settlement} from "@/shared/types/world.types.ts";

export const SETTLEMENTS: {[ key in string]?: Settlement} = {
    settlement_0 : {
        "x": 176,
        "y": 105,
        "id": "settlement_0",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_5", "travelCost": 134}, {"id": "settlement_6", "travelCost": 136}]
    },
    settlement_1 : {
        "x": 138,
        "y": 353,
        "id": "settlement_1",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_3", "travelCost": 157}, {"id": "settlement_6", "travelCost": 158}]
    },

    settlement_2 : {
        "x": 368,
        "y": 137,
        "id": "settlement_2",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_3", "travelCost": 132}]
    },

    settlement_3 : {
        "x": 263,
        "y": 263,
        "id": "settlement_3",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_4", "travelCost": 116}, {
            "id": "settlement_1",
            "travelCost": 157
        }, {"id": "settlement_2", "travelCost": 132}]
    },

    settlement_4 : {
        "x": 369,
        "y": 374,
        "id": "settlement_4",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_3", "travelCost": 116}]
    },

    settlement_5 : {
        "x": 47,
        "y": 11,
        "id": "settlement_5",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_0", "travelCost": 134}]
    },

    settlement_6 : {
        "x": 45,
        "y": 199,
        "id": "settlement_6",
        "name": "Unnamed Settlement",
        "connections": [{"id": "settlement_0", "travelCost": 136}, {"id": "settlement_1", "travelCost": 158}]
    }
}

