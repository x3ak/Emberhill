import {MapGenerator} from "@/core/worldgen/MapGenerator.ts";
import {MapRenderer} from "@/core/worldgen/map_renderer.ts";
import {SettlementPlacer} from "@/core/worldgen/features/SettlementPlacer.ts";
import {TerritoryExpander} from "@/core/worldgen/features/TerritoryExpander.ts";

export function generateWorld(seed: string, outputPath: string = 'world_map.png') {
    const mapGenerator = new MapGenerator(seed);
    const worldMap = mapGenerator.generateMap();

    const settlementPlacer = new SettlementPlacer(worldMap);
    const settlements = settlementPlacer.placeFoundingSettlements();

    const territoryExpander = new TerritoryExpander(worldMap, settlements);
    territoryExpander.expandTerritories();

    const mapRenderer = new MapRenderer(worldMap);
    mapRenderer.renderAllMaps(outputPath);

}

// After generating the map: