import { createCanvas } from 'canvas';
import * as fs from 'fs';
import type { WorldMap, TerrainType } from '@/shared/types/world.types.ts'

// Define a color palette for our terrain types.
const TERRAIN_COLORS: Record<TerrainType, string> = {
    // --- Water Body Colors ---
    DEEP_OCEAN:    '#1c2e78', // A very deep, dark navy blue
    COASTAL_WATER: '#3b5998', // A standard, clearer blue for shallower water

    // --- Land Transition Colors ---
    BEACH:         '#f2dcb3', // A soft, pale sand color

    // --- Temperate Biome Colors (The "Default" Look) ---
    PLAINS:        '#90c67c', // A pleasant, light green for grasslands
    FOREST:        '#4a934a', // A rich, standard forest green

    // --- Hot Biome Colors ---
    DESERT:        '#e6c86e', // A warm, sandy yellow
    SAVANNA:       '#91b15d', // An earthier, ochre/dry grass color
    JUNGLE:        '#1e4a2d', // A deep, humid, dark green

    // --- Cold Biome Colors ---
    TUNDRA:        '#c4d1d9', // A pale, slightly blueish-gray for frozen ground
    TAIGA:         '#688a8c', // A cool, blue-green for pine/snowy forests

    // --- High Elevation Colors ---
    MOUNTAIN:      '#8d7b6f', // A stony, brownish-gray
    SNOWY_MOUNTAIN:'#e0e0e0', // A bright, almost white gray for snow-capped peaks
};

const TILE_SIZE = 4; // The size of each tile in pixels. 4px is good for a 100x100 map.

export class MapRenderer {
    private mapData: WorldMap;
    private canvas;
    private context;

    constructor(mapData: WorldMap) {
        this.mapData = mapData;

        // Create a virtual canvas in memory.
        const canvasWidth = this.mapData.width * TILE_SIZE;
        const canvasHeight = this.mapData.height * TILE_SIZE;
        this.canvas = createCanvas(canvasWidth, canvasHeight);
        this.context = this.canvas.getContext('2d');
    }

    /**
     * The main public method. Orchestrates the rendering of all map types.
     * @param basePath A base path and name for the output files, e.g., 'world_output/my_world'.
     */
    public renderAllMaps(basePath: string): void {
        console.log('Rendering final biome map...');
        this.renderAndSave(`${basePath}_biome.png`, this.drawBiomeMap);

        console.log('Rendering elevation map...');
        this.renderAndSave(`${basePath}_elevation.png`, this.drawElevationMap);

        console.log('Rendering temperature map...');
        this.renderAndSave(`${basePath}_temperature.png`, this.drawTemperatureMap);

        console.log('Rendering moisture map...');
        this.renderAndSave(`${basePath}_moisture.png`, this.drawMoistureMap);

        console.log('Rendering river map...');
        this.renderAndSave(`${basePath}_rivers.png`, this.drawRiversMap);

        console.log(`All maps rendered with base path: ${basePath}`);
    }


    /**
     * A generic helper method to handle the canvas creation, drawing, and saving.
     * @param outputPath The full path for the output PNG file.
     * @param drawFunction The specific drawing function to execute on the canvas context.
     */
    private renderAndSave(outputPath: string, drawFunction: (context: CanvasRenderingContext2D) => void): void {
        const canvasWidth = this.mapData.width * TILE_SIZE;
        const canvasHeight = this.mapData.height * TILE_SIZE;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const context = canvas.getContext('2d');

        // Bind the drawFunction to this instance to ensure it can access `this.mapData`
        drawFunction.bind(this)(context);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
    }

    // --- Private Drawing Methods ---
    /**
     * Draws the final, colored biome map.
     */
    private drawBiomeMap(context: CanvasRenderingContext2D): void {
        for (let y = 0; y < this.mapData.height; y++) {
            for (let x = 0; x < this.mapData.width; x++) {
                const tile = this.mapData.grid[y][x];

                if (tile.isRiver) {
                    context.fillStyle = '#4a90e2'; // A distinct river blue
                    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else {

                    context.fillStyle = TERRAIN_COLORS[tile.terrain];
                    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    /**
     * Draws a grayscale representation of the elevation data.
     * Black = 0.0 (low), White = 1.0 (high).
     */
    private drawElevationMap(context: CanvasRenderingContext2D): void {
        this.drawGrayscaleMap(context, 'elevation');
    }

    /**
     * Draws a grayscale representation of the temperature data.
     * Black = 0.0 (cold), White = 1.0 (hot).
     */
    private drawTemperatureMap(context: CanvasRenderingContext2D): void {
        this.drawGrayscaleMap(context, 'temperature');
    }

    /**
     * Draws a grayscale representation of the moisture data.
     * Black = 0.0 (dry), White = 1.0 (wet).
     */
    private drawMoistureMap(context: CanvasRenderingContext2D): void {
        this.drawGrayscaleMap(context, 'moisture');
    }

    private drawRiversMap(context: CanvasRenderingContext2D): void {
        for (let y = 0; y < this.mapData.height; y++) {
            for (let x = 0; x < this.mapData.width; x++) {
                const tile = this.mapData.grid[y][x];

                if (tile.isRiver) {
                    context.fillStyle = this.getColorForId(tile.riverId, 1000)
                    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        for (let y = 0; y < this.mapData.height; y++) {
            for (let x = 0; x < this.mapData.width; x++) {
                const tile = this.mapData.grid[y][x];
                if (tile.isLake) {
                    context.fillStyle = 'rgba(255,255,255, 0.5)';
                    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }



    }

    private getColorForId(id: number, maxId: number): string {
        // 1. Calculate the hue.
        // We divide the 360 degrees of the color wheel by the total number of rivers
        // and multiply by the current river's ID to get an evenly spaced color.
        const hue = Math.floor((id / maxId) * 360);

        // 2. Keep saturation and lightness constant for a consistent look.
        // 80% saturation is vibrant but not neon.
        // 50% lightness is the pure, full color.
        const saturation = 80; // in percent
        const lightness = 50;  // in percent

        // 3. Return the formatted CSS color string.
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    /**
     * A generic helper to draw any data layer as a grayscale image.
     * @param context The canvas context to draw on.
     * @param dataType The key of the data to render ('elevation', 'temperature', or 'moisture').
     */
    private drawGrayscaleMap(context: CanvasRenderingContext2D, dataType: 'elevation' | 'temperature' | 'moisture'): void {
        for (let y = 0; y < this.mapData.height; y++) {
            for (let x = 0; x < this.mapData.width; x++) {
                const value = this.mapData.grid[y][x][dataType]; // e.g., tile.elevation

                // Convert the 0-1 value to a 0-255 grayscale color component.
                const colorValue = Math.floor(value * 255);
                context.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

                context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}