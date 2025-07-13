import {MapGenerator} from "@/core/worldgen/MapGenerator.ts";
import {MapRenderer} from "@/core/worldgen/map_renderer.ts";

export function generateWorld(seed: string, outputPath: string = 'world_map.png') {
    const mapGenerator = new MapGenerator(seed);
    const worldMap = mapGenerator.generateMap();

    const mapRenderer = new MapRenderer(worldMap);
    mapRenderer.renderAllMaps(outputPath);

}

// After generating the map: