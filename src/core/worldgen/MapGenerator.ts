import {createNoise2D, type NoiseFunction2D} from 'simplex-noise';
import {createSeededRNG} from './utils/rng'; // Assuming you have this utility
import type {TerrainType, Tile, WorldMap} from '@/shared/types/world.types.ts'

import Grid from "@/core/worldgen/Grid.ts";
import {ELEVATION_EFFECTS, MAP_CONFIG, NOISE_CONFIG, TEMP_CONFIG, TERRAIN_THRESHOLDS} from "@/core/worldgen/config.ts";

export class MapGenerator {
    private readonly seed: string
    private readonly elevationNoise: NoiseFunction2D;
    private readonly detailNoise: NoiseFunction2D;
    private readonly temperatureNoise: NoiseFunction2D;
    private readonly moistureNoise: NoiseFunction2D;


    constructor(seed: string) {
        this.seed = seed;

        this.elevationNoise = createNoise2D(createSeededRNG(this.seed + '_elevation'));
        this.detailNoise = createNoise2D(createSeededRNG(this.seed + '_detail_elevation'));
        this.temperatureNoise = createNoise2D(createSeededRNG(this.seed + '_temperature'));
        this.moistureNoise = createNoise2D(createSeededRNG(this.seed + '_moisture'));

    }

    /**
     * The main public method that orchestrates the entire map generation process.
     */
    public generateMap(): WorldMap {
        const grid = this.createInitialGrid();

        const gridObj = new Grid(grid);

        // Layer 1: Base Data Generation
        this.createBaseElevation(gridObj);
        this.createBaseMoisture(gridObj);
        this.createBaseTemperature(gridObj);

        // Layer 2: Interdependent Modifications
        this.applyContinentMask(gridObj);

        this.assignElevationBiomes(gridObj);

        this.modifyTemperatureByElevation(gridObj);
        this.modifyMoistureByProximityToWater(gridObj);
        this.applyRainShadows(grid);




        // this.assignElevationBiomes(gridObj);


        return {
            width: MAP_CONFIG.WIDTH,
            height: MAP_CONFIG.HEIGHT,
            grid: gridObj,
            settlements: [],
            villages: [],
        };
    }



    private createInitialGrid(): Tile[][] {
        const grid: Tile[][] = [];
        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            grid[y] = [];
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                grid[y][x] = {
                    x, y,
                    terrain: 'DEEP_OCEAN', // Default
                    elevation: 0,
                    temperature: 0,
                    moisture: 0,
                    isRoad: false,
                    riverId: null,
                    isRiver: false,
                    isLake: false,
                    settlement: null,
                    territoryOf: null,
                    village: null,
                };
            }
        }
        return grid;
    }


    private createBaseElevation(grid: Grid): void {

        const MAP_WIDTH = MAP_CONFIG.WIDTH;
        // How far inland the coastal effect should reach.
        const BORDER_INFLUENCE = MAP_WIDTH * 0.2; // 20% of the map width


        for (const tile of grid.allTiles()) {
            const baseElevNoise = this.elevationNoise(
                tile.x * NOISE_CONFIG.ELEVATION_SCALE,
                tile.y * NOISE_CONFIG.ELEVATION_SCALE
            );

            let elevation  = (baseElevNoise + 1) / 2;
            const detailElevNoise = this.detailNoise(
                tile.x * NOISE_CONFIG.DETAIL_SCALE, // Use the smaller scale
                tile.y * NOISE_CONFIG.DETAIL_SCALE
            );

            elevation += detailElevNoise * NOISE_CONFIG.DETAIL_AMPLITUDE;

            elevation = Math.max(0, Math.min(1, elevation));

            const distFromLeft = tile.x;
            let multiplier = 1.0;
            if (distFromLeft < BORDER_INFLUENCE) {
                multiplier = distFromLeft / BORDER_INFLUENCE;
            }

            // Apply the multiplier. Using Math.pow makes the coastline sharper.
            tile.elevation = elevation * Math.pow(multiplier, 1.5);

        }
    }

    private createBaseMoisture(grid: Grid): void {
        for (const tile of grid.allTiles()) {
            const moistNoise = this.moistureNoise(tile.x * NOISE_CONFIG.ELEVATION_SCALE, tile.y * NOISE_CONFIG.ELEVATION_SCALE);
            tile.moisture = (moistNoise + 1) / 2;
        }
    }


    private applyContinentMask(grid: Grid): void {
        const centerX = MAP_CONFIG.WIDTH / 2;
        const centerY = MAP_CONFIG.HEIGHT / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        for (const tile of grid.allTiles()) {
            const dx = centerX - tile.x;
            const dy = centerY - tile.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const normalizedDist = dist / maxDist;
            const mask = 1 - Math.pow(normalizedDist, 3);

            tile.elevation *= mask;
        }

    }

    private createBaseTemperature(grid: Grid): void {
        for (const tile of grid.allTiles()) {
            // 1. Get a base noise value from -1 to 1
            const noiseValue = this.temperatureNoise(tile.x * TEMP_CONFIG.NOISE_SCALE, tile.y * TEMP_CONFIG.NOISE_SCALE);

            // 2. Normalize to a 0-1 range
            let normalizedTemp = (noiseValue + 1) / 2;

            // 3. "Clamp and Bias": Squeeze the 0-1 range into our desired temperate range.
            // For example, if MIN_TEMP is 0.25 and MAX_TEMP is 0.75, the range is 0.5 wide.
            // A normalizedTemp of 0.5 becomes: 0.25 + 0.5 * (0.75 - 0.25) = 0.5
            // A normalizedTemp of 1.0 becomes: 0.25 + 1.0 * (0.5) = 0.75
            normalizedTemp = TEMP_CONFIG.MIN_TEMP + normalizedTemp * (TEMP_CONFIG.MAX_TEMP - TEMP_CONFIG.MIN_TEMP);

            // 4. Apply a gentle vertical gradient (Equator-to-Poles effect)
            // `y / MAP_CONFIG.HEIGHT` gives a value from 0.0 (top/north) to 1.0 (bottom/south).
            const gradientValue = tile.y / MAP_CONFIG.HEIGHT;
            // We shift the gradient so it ranges from -0.5 to +0.5, then scale it by our strength factor.
            const gradientEffect = (gradientValue - 0.5) * TEMP_CONFIG.GRADIENT_STRENGTH;

            let finalTemp = normalizedTemp + gradientEffect;

            // 5. Final clamp to ensure values stay within the 0-1 bounds after the gradient is applied.
            tile.temperature = Math.max(0, Math.min(1, finalTemp));
        }

    }

    private modifyTemperatureByElevation(grid: Grid): void {

        for (const tile of grid.allTiles()) {
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

    private modifyMoistureByProximityToWater(grid: Grid): void {
        const MOISTURE_SPREAD_FACTOR = 0.15;

        for (const tile of grid.allTiles()) {
            if (tile.terrain !== 'COASTAL_WATER') continue;

            for (const neighbor of grid.getTilesInRadius(tile, 2)) {
                neighbor.moisture += MOISTURE_SPREAD_FACTOR;
                neighbor.moisture = Math.min(1, neighbor.moisture);
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

    private assignElevationBiomes(grid: Grid): void {
        for (const tile of grid.allTiles()) {
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
                tile.terrain = this.getTerrainBasedOnWeather(tile);
                continue;
            }

            if (tile.elevation <= TERRAIN_THRESHOLDS.SNOWY_MOUNTAIN) {
                tile.terrain = 'MOUNTAIN';
                continue;
            }

            tile.terrain = 'SNOWY_MOUNTAIN'
        }
    }

    private getTerrainBasedOnWeather(tile: Tile): TerrainType {
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


}