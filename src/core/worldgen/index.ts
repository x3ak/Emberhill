import fs from "fs";

import {MapGenerator} from "@/core/worldgen/MapGenerator.ts";
import {MapRenderer} from "@/core/worldgen/map_renderer.ts";
import {Rivers} from "@/core/worldgen/features/Rivers.feature.ts";
import {Settlements} from "@/core/worldgen/features/Settlements.feature.ts";
import {Roads} from "@/core/worldgen/features/Roads.feature.ts";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";

import VillageProductionFeature from "@/core/worldgen/features/VillageProductionFeature.ts";
import type {Settlement, Village} from "@/shared/types/world.types.ts";

export function generateWorld(seed: string, outputPath: string = 'world_map.png') {
    const mapGenerator = new MapGenerator(seed);
    const worldMap = mapGenerator.generateMap();

    const features: WorldGenerationFeature[] = [
        new Rivers(worldMap, seed),
        new Settlements(worldMap, seed),
        new Roads(worldMap, seed),
        new VillageProductionFeature(worldMap, seed),
    ];

    for (const feature of features) {
        feature.execute();
    }

    saveSettlementsData(worldMap.settlements);
    saveVillagesData(worldMap.villages);

    const mapRenderer = new MapRenderer(worldMap);
    mapRenderer.renderAllMaps(outputPath);

}

function saveSettlementsData(settlements: Settlement[]) {
    const settlementsRows = settlements.map(row => {
        const connectionsString = row.connections.map(connection => {
            return `{id: "${connection.id}", travelCost: ${connection.travelCost}}`;
        }).join(',')
        return `${row.id}: { id: "${row.id}", x: ${row.x }, y: ${row.y}, name: "${row.name}", connections: [${connectionsString}] },`;
    }).join("\n    ");

    const dataText = `
import type {Settlement} from "@/shared/types/world.types.ts";

export const SETTLEMENTS: {[ key in string]?: Settlement} = {
    ${settlementsRows}
}
    `

    fs.writeFileSync("./src/core/data/settlements.data.ts", dataText);
}

function saveVillagesData(villages: Village[]) {
    const villagesRows = villages.map(row => {
        return `${row.id}: { id: "${row.id}", x: ${row.x }, y: ${row.y}, name: "${row.name}", specialization: "${row.specialization}", capital: SETTLEMENTS["${row.capital?.id}"] || null },`;
    }).join("\n    ");

    const dataText = `
import type {Village} from "@/shared/types/world.types.ts";
import {SETTLEMENTS} from "@/core/data/settlements.data.ts";

export const VILLAGES: {[ key in string]?: Village} = {
    ${villagesRows}
}
    `

    fs.writeFileSync("./src/core/data/villages.data.ts", dataText);
}