import {MapGenerator} from "@/core/worldgen/MapGenerator.ts";
import {MapRenderer} from "@/core/worldgen/map_renderer.ts";
import {Rivers} from "@/core/worldgen/features/Rivers.feature.ts";
import {Settlements} from "@/core/worldgen/features/Settlements.feature.ts";
import {Roads} from "@/core/worldgen/features/Roads.feature.ts";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";
import fs from "fs";
import VillageProductionFeature from "@/core/worldgen/features/VillageProductionFeature.ts";

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

    fs.writeFileSync("settlements.json", JSON.stringify(worldMap.settlements));
    fs.writeFileSync("villages.json", JSON.stringify(worldMap.villages));

    //
    // //
    // const simpleSettlements = worldMap.settlements.map(s => {
    //     return {
    //         id: s.id,
    //         name: s.name,
    //         pos: {x: s.tile.x,  y: s.tile.y},
    //         connections: s.connections.map(c => {
    //             return {settlement: c.settlement.id, travelCost: c.travelCost};
    //         })
    //     }
    // });
    //
    //
    // // fs.writeFileSync("map.json", JSON.stringify(worldMap));
    //
    // // var data = fs.readFileSync("map.json", 'utf-8');
    // // const map = JSON.parse(data);
    // //
    // // const worldMap: WorldMap = {
    // //     width: map.width,
    // //     height: map.height,
    // //     settlements: map.settlements as Settlement[],
    // //     grid: new Grid(map.grid.tiles),
    // // }
    // //
    // // // console.log(JSON.stringify(map.settlements))
    // //
    // // // console.log(typeof map.grid as Grid);

    const mapRenderer = new MapRenderer(worldMap);
    mapRenderer.renderAllMaps(outputPath);

    // const loader = new MapLoader();
    // loader.loadFromFiles();
}

