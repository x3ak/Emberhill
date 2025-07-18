import type Grid from "@/core/worldgen/Grid.ts";
import type {ResourceAmount} from "@/shared/types/game.types.ts";

export type TerrainType =
    | 'DEEP_OCEAN' | 'COASTAL_WATER' | 'BEACH'
    | 'PLAINS' | 'FOREST' | 'JUNGLE' | 'SAVANNA' | 'DESERT'
    | 'TAIGA' | 'TUNDRA'
    | 'MOUNTAIN' | 'SNOWY_MOUNTAIN';

// Represents a single tile on the map
export interface Tile {
    x: number;
    y: number;
    isRoad: boolean;
    isRiver: boolean;
    riverId: number | null;
    isLake: boolean;
    terrain: TerrainType;
    elevation: number;   // 0.0 (low) to 1.0 (high)
    temperature: number; // 0.0 (cold) to 1.0 (hot)
    moisture: number;    // 0.0 (dry) to 1.0 (wet)
    settlement: Settlement | null;
    village: Village | null;
    territoryOf: Settlement | null
}
export interface SettlementConnection {
    id: string;
    travelCost: number;
}

export interface Settlement {
    x: number;
    y: number;
    id: string;
    name: string;
    connections: SettlementConnection[];
}

export type VillageSpecialization = "FARMING" | "MINING" | "WOODCUTTING" | "NOTHING";

export interface Village {
    x: number;
    y: number;
    id: string;
    name: string;
    capital: Settlement | null;
    specialization: VillageSpecialization;
    production: ResourceAmount[],
}

// Represents the entire generated map
export interface WorldMap {
    width: number;
    height: number;
    grid: Grid;
    settlements: Settlement[];
    villages: Village[];
}