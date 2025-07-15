import {MapGenerator} from "@/core/worldgen/MapGenerator.ts";
import {MapRenderer} from "@/core/worldgen/map_renderer.ts";
import {Rivers} from "@/core/worldgen/features/Rivers.feature.ts";
import {Settlements} from "@/core/worldgen/features/Settlements.feature.ts";
import {Territories} from "@/core/worldgen/features/Territories.feature.ts";
import {Roads} from "@/core/worldgen/features/Roads.feature.ts";
import {WorldGenerationFeature} from "@/core/worldgen/WorldGenerationFeature.ts";

export function generateWorld(seed: string, outputPath: string = 'world_map.png') {
    const mapGenerator = new MapGenerator(seed);
    const worldMap = mapGenerator.generateMap();

    const features: WorldGenerationFeature[] = [
        new Rivers(worldMap, seed),
        new Settlements(worldMap, seed),
        new Territories(worldMap, seed),
        new Roads(worldMap, seed),
    ];

    for (const feature of features) {
        feature.execute();
    }

    const mapRenderer = new MapRenderer(worldMap);
    mapRenderer.renderAllMaps(outputPath);

}
