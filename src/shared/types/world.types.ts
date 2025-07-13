export type TerrainType =
    | 'DEEP_OCEAN' | 'COASTAL_WATER' | 'BEACH'
    | 'PLAINS' | 'FOREST' | 'JUNGLE' | 'SAVANNA' | 'DESERT'
    | 'TAIGA' | 'TUNDRA'
    | 'MOUNTAIN' | 'SNOWY_MOUNTAIN';

// Represents a single tile on the map
export interface Tile {
    x: number;
    y: number;
    isRiver: boolean;
    riverId: number;
    // tile: Tile;
    isLake: boolean;
    isLakeEdge: boolean;
    terrain: TerrainType;
    elevation: number;   // 0.0 (low) to 1.0 (high)
    temperature: number; // 0.0 (cold) to 1.0 (hot)
    moisture: number;    // 0.0 (dry) to 1.0 (wet)
    // We will add more properties here later, like `river: boolean` or `settlementId: string | null`
}

// Represents the entire generated map
export interface WorldMap {
    width: number;
    height: number;
    grid: Tile[][];
}