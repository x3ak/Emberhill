// src/core/worldgen/map_generator.ts

import {createNoise2D, type NoiseFunction2D} from 'simplex-noise';
import { createSeededRNG } from './utils/rng'; // Assuming you have this utility
import type {TerrainType, Tile, WorldMap} from '@/shared/types/world.types.ts'

import {apply as applyRiversFeature} from "@/core/worldgen/features/rivers.feature.ts";
import {getTilesInRadius} from "@/core/worldgen/utils/grid.ts";

const TEMP_CONFIG = {
    NOISE_SCALE: 0.01, // Low frequency for large, smooth climate bands
    MIN_TEMP: 0.25,    // The coldest a lowland area can be (prevents Tundra)
    MAX_TEMP: 0.75,    // The hottest a lowland area can be (prevents Desert)
    GRADIENT_STRENGTH: 0.2, // How much the north-south gradient affects temp (e.g., 20%)
};

const ELEVATION_EFFECTS = {
    TEMP_DROP_FACTOR: 0.20, // How much colder high elevations get
    // We can add a power to make the effect non-linear
    TEMP_DROP_POWER: 1.8,
};

// --- CONFIGURATION ---
export const MAP_CONFIG = {
    WIDTH: 200,
    HEIGHT: 200,
};

const NOISE_CONFIG = {
    ELEVATION_SCALE: 0.024,
    TEMPERATURE_SCALE: 0.02,
    MOISTURE_SCALE: 0.05,
    SEA_NOISE_SCALE: 0.01, // VERY low frequency for large, smooth shapes
};

// --- THRESHOLDS ---
// const TERRAIN_THRESHOLDS = {
//     DEEP_OCEAN: 0.2,
//     COASTAL_WATER: 0.3,
//     BEACH: 0.35,
//     MOUNTAIN: 0.8,
//     SNOWY_MOUNTAIN: 0.9,
// };

const TERRAIN_THRESHOLDS = {
    // Water is now only in the bottom 25% of the elevation range
    DEEP_OCEAN: 0.1,
    COASTAL_WATER: 0.2,
    // Beach is a very narrow band
    BEACH: 0.23,
    // Mountains are pushed to the very top
    MOUNTAIN: 0.80,
    SNOWY_MOUNTAIN: 0.95,
};

export class MapGenerator {
    private seed: string
    private elevationNoise: NoiseFunction2D;
    private temperatureNoise: NoiseFunction2D;
    private moistureNoise: NoiseFunction2D;
    private seaCarvingNoise: NoiseFunction2D;



    constructor(seed: string) {
        this.seed = seed;

        this.elevationNoise = createNoise2D(createSeededRNG(this.seed + '_elevation'));
        this.temperatureNoise = createNoise2D(createSeededRNG(this.seed + '_temperature'));
        this.moistureNoise = createNoise2D(createSeededRNG(this.seed + '_moisture'));

        this.seaCarvingNoise = createNoise2D(createSeededRNG(seed + '_seas'));

    }

    /**
     * The main public method that orchestrates the entire map generation process.
     */
    public generateMap(): WorldMap {
        const grid = this.createInitialGrid();

        // Layer 1: Base Data Generation
        this.applyBaseNoise(grid);
        this.applyBaseTemperatureNoise(grid);

        // Layer 2: Interdependent Modifications
        this.applyContinentMask(grid);
        this.applyCoastalGradient(grid);
        this.finalizeElevation(grid);


        this.assignElevationBiomes(grid);
        applyRiversFeature(this.seed, grid);

        this.modifyTemperatureByElevation(grid);
        this.modifyMoistureByProximityToWater(grid);
        this.applyRainShadows(grid);

        this.assignElevationBiomes(grid);




        return {
            width: MAP_CONFIG.WIDTH,
            height: MAP_CONFIG.HEIGHT,
            grid,
        };
    }

    private createInitialGrid(): Tile[][] {
        const grid: Tile[][] = [];
        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            grid[y] = [];
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                grid[y][x] = {
                    riverId: 0,
                    x, y,
                    terrain: 'DEEP_OCEAN', // Default
                    elevation: 0,
                    temperature: 0,
                    moisture: 0,
                    isRiver: false,
                    isLake: false,
                    isLakeEdge: false
                };
            }
        }
        return grid;
    }

    private applyBaseNoise(grid: Tile[][]): void {
        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                // Generate noise values from -1 to 1
                const elevNoise = this.elevationNoise(x * NOISE_CONFIG.ELEVATION_SCALE, y * NOISE_CONFIG.ELEVATION_SCALE);
                const moistNoise = this.moistureNoise(x * NOISE_CONFIG.MOISTURE_SCALE, y * NOISE_CONFIG.MOISTURE_SCALE);

                // Normalize to 0-1 range
                grid[y][x].elevation = (elevNoise + 1) / 2;
                grid[y][x].moisture = (moistNoise + 1) / 2;
            }
        }
    }

    private applyContinentMask(grid: Tile[][]): void {
        const centerX = MAP_CONFIG.WIDTH / 2;
        const centerY = MAP_CONFIG.HEIGHT / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                const dx = centerX - x;
                const dy = centerY - y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const normalizedDist = dist / maxDist;
                const mask = 1 - Math.pow(normalizedDist, 2.2);

                // Creates a smooth gradient from 1.0 at center to 0.0 at corners
                // const mask = Math.pow(1 - (dist / maxDist), 0.5);


                grid[y][x].elevation *= mask;
            }
        }
    }
    private applyBaseTemperatureNoise(grid: Tile[][]): void {
        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                // 1. Get a base noise value from -1 to 1
                const noiseValue = this.temperatureNoise(x * TEMP_CONFIG.NOISE_SCALE, y * TEMP_CONFIG.NOISE_SCALE);

                // 2. Normalize to a 0-1 range
                let normalizedTemp = (noiseValue + 1) / 2;

                // 3. "Clamp and Bias": Squeeze the 0-1 range into our desired temperate range.
                // For example, if MIN_TEMP is 0.25 and MAX_TEMP is 0.75, the range is 0.5 wide.
                // A normalizedTemp of 0.5 becomes: 0.25 + 0.5 * (0.75 - 0.25) = 0.5
                // A normalizedTemp of 1.0 becomes: 0.25 + 1.0 * (0.5) = 0.75
                normalizedTemp = TEMP_CONFIG.MIN_TEMP + normalizedTemp * (TEMP_CONFIG.MAX_TEMP - TEMP_CONFIG.MIN_TEMP);

                // 4. Apply a gentle vertical gradient (Equator-to-Poles effect)
                // `y / MAP_CONFIG.HEIGHT` gives a value from 0.0 (top/north) to 1.0 (bottom/south).
                const gradientValue = y / MAP_CONFIG.HEIGHT;
                // We shift the gradient so it ranges from -0.5 to +0.5, then scale it by our strength factor.
                const gradientEffect = (gradientValue - 0.5) * TEMP_CONFIG.GRADIENT_STRENGTH;

                let finalTemp = normalizedTemp + gradientEffect;

                // 5. Final clamp to ensure values stay within the 0-1 bounds after the gradient is applied.
                grid[y][x].temperature = Math.max(0, Math.min(1, finalTemp));
            }
        }
    }
    private modifyTemperatureByElevation(grid: Tile[][]): void {



        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                const tile = grid[y][x];

                if (tile.elevation <= TERRAIN_THRESHOLDS.BEACH) {
                    continue;
                }

                if (tile.elevation > TERRAIN_THRESHOLDS.SNOWY_MOUNTAIN) {
                    tile.temperature = TEMP_CONFIG.MIN_TEMP;
                }

                const elevationFactor = Math.pow(tile.elevation, ELEVATION_EFFECTS.TEMP_DROP_POWER);

                // Subtract the temperature drop from the current temperature.
                tile.temperature -= elevationFactor * ELEVATION_EFFECTS.TEMP_DROP_FACTOR;

                // Clamp the result to ensure temperature doesn't go below 0.
                tile.temperature = Math.max(TEMP_CONFIG.MIN_TEMP, tile.temperature);

            }
        }
    }

    private modifyMoistureByProximityToWater(grid: Tile[][]): void {
        const MOISTURE_SPREAD_FACTOR = 0.15;
        // This is a simplified diffusion. A real one would be multi-pass.
        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                const tile = grid[y][x];
                if (tile.terrain !== 'COASTAL_WATER') continue;
                if (tile.isRiver)  {
                    console.log('moisture', x, y, tile);
                }

                for (const neighbor of getTilesInRadius(grid[y][x], grid, 2)) {
                    neighbor.moisture += MOISTURE_SPREAD_FACTOR;
                    neighbor.moisture = Math.min(1, neighbor.moisture);
                }

            }
        }
    }

    private applyRainShadows(grid: Tile[][]): void {
        const MOISTURE_DROP_RATE = 0.05;

        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            let currentMoisture = 1.0; // Start with full moisture at the edge
            for (let x = MAP_CONFIG.WIDTH - 1; x >= 0; x--) {
                const tile = grid[y][x];
                const prevTile = grid[y][x + 1];

                // If going up a mountain, lose moisture (it's raining)
                if (prevTile && tile.elevation > prevTile.elevation) {
                    currentMoisture -= (tile.elevation - prevTile.elevation) * MOISTURE_DROP_RATE * 5;
                }
                currentMoisture = Math.max(0, currentMoisture);

                // Blend the tile's base moisture with the "air moisture"
                tile.moisture = (tile.moisture + currentMoisture) / 2;
            }
        }
    }

    private assignElevationBiomes(grid: Tile[][]): void {
        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                const tile = grid[y][x];

                if (tile.elevation <= TERRAIN_THRESHOLDS.DEEP_OCEAN) {
                    tile.terrain = 'DEEP_OCEAN';
                    continue;
                }

                if (tile.elevation <= TERRAIN_THRESHOLDS.COASTAL_WATER) {
                    tile.terrain = 'COASTAL_WATER';
                    continue;
                }

                if (tile.elevation <= TERRAIN_THRESHOLDS.BEACH) {
                    tile.terrain = 'BEACH';
                    continue;
                }

                if (tile.elevation <= TERRAIN_THRESHOLDS.MOUNTAIN) {
                    tile.terrain = this.getTerrainBasedOnWeater(tile);
                    continue;
                }

                if (tile.elevation <= TERRAIN_THRESHOLDS.SNOWY_MOUNTAIN) {
                    tile.terrain = 'MOUNTAIN';
                    continue;
                }

                tile.terrain = 'SNOWY_MOUNTAIN'
            }
        }
    }

    private getTerrainBasedOnWeater(tile: Tile): TerrainType {
        if (tile.temperature > 0.75) { // Hot
            if (tile.moisture > 0.66) return 'JUNGLE';
            if (tile.moisture > 0.33) return 'SAVANNA';

            return 'DESERT';
        }

        if (tile.temperature > 0.25) { // Temperate
            if (tile.moisture > 0.66) return 'FOREST';

            return 'PLAINS';
        }

        // Cold
        if (tile.moisture > 0.5) return 'TAIGA';

        return 'TUNDRA';

    }




    /**
     * Pushes elevation down along the map edges to create oceans and coastlines.
     * @param grid The map grid to modify.
     */
    private applyCoastalGradient(grid: Tile[][]): void {
        const MAP_WIDTH = MAP_CONFIG.WIDTH;
        const MAP_HEIGHT = MAP_CONFIG.HEIGHT;
        // How far inland the coastal effect should reach.
        const BORDER_INFLUENCE = MAP_WIDTH * 0.2; // 20% of the map width


        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                // Calculate distance from the left edge (or any edge you choose)
                const distFromLeft = x;

                let multiplier = 1.0;

                // Apply a gradient only within the border influence zone
                if (distFromLeft < BORDER_INFLUENCE) {
                    // Creates a smooth gradient from 0.0 at the edge to 1.0 at the influence boundary
                    multiplier = distFromLeft / BORDER_INFLUENCE;
                }

                // You could add logic for other edges too:
                // const distFromRight = MAP_WIDTH - 1 - x;
                // if (distFromRight < BORDER_INFLUENCE) {
                //     multiplier = Math.min(multiplier, distFromRight / BORDER_INFLUENCE);
                // }

                // Apply the multiplier. Using Math.pow makes the coastline sharper.
                grid[y][x].elevation *= Math.pow(multiplier, 1.5);
            }
        }
    }


    /**
     * Globally adjusts the elevation to control the final land-to-water ratio.
     * @param grid The map grid to modify.
     */
    private finalizeElevation(grid: Tile[][]): void {
        const RAISE_LAND_FACTOR = 0.15; // Add this value to all elevations

        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                // Globally raise the land level
                grid[y][x].elevation += RAISE_LAND_FACTOR;
                // Clamp the max elevation to 1.0
                grid[y][x].elevation = Math.min(1.0, grid[y][x].elevation);
            }
        }
    }



}