import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import * as fs from 'fs';
import type {WorldMap, TerrainType} from '@/shared/types/world.types.ts'

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

export const TILE_SIZE = 4; // The size of each tile in pixels. 4px is good for a 100x100 map.


// --- Configuration for Contour Lines ---
const CONTOUR_CONFIG = {
    LINE_INTERVAL: 0.1, // Draw a line every 0.1 elevation increment
    LINE_COLOR: 'rgba(0, 0, 0, 0.15)', // A semi-transparent black looks great
    LINE_WIDTH: 1, // Keep it subtle
};

export class MapRenderer {
    private mapData: WorldMap;

    constructor(mapData: WorldMap) {
        this.mapData = mapData;

    }

    /**
     * The main public method. Orchestrates the rendering of all map types.
     * @param basePath A base path and name for the output files, e.g., 'world_output/my_world'.
     */
    public renderAllMaps(basePath: string): void {
        console.log('Rendering final biome map...');
        this.renderAndSave(`${basePath}_biome.png`, [
            this.drawBiomeMap,
            this.drawContourLines,
            this.drawPoliticalMap,
            this.drawRoads,
            this.drawSettlements,
            this.drawVillages,
        ]);

        
        this.renderAndSave(`${basePath}_elevation.png`, [this.drawElevationMap]);
        
        this.renderAndSave(`${basePath}_temperature.png`, [this.drawTemperatureMap]);
        
        
        this.renderAndSave(`${basePath}_moisture.png`, [this.drawMoistureMap]);

        
        this.renderAndSave(`${basePath}_rivers.png`, [this.drawRiversMap]);
        
        this.renderAndSave(`${basePath}_contours.png`, [this.drawContourLines]);

        console.log(`All maps rendered with base path: ${basePath}`);
    }


    private renderAndSave(outputPath: string, drawFunctions: ((context: CanvasRenderingContext2D) => void)[]): void {
        const canvasWidth = this.mapData.width * TILE_SIZE;
        const canvasHeight = this.mapData.height * TILE_SIZE;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const context: CanvasRenderingContext2D = canvas.getContext('2d');

        // Bind the drawFunction to this instance to ensure it can access `this.mapData`
        for (const drawFunction of drawFunctions) {
            // We no longer need .bind() because all our methods are arrow functions.
            // The `this` context is already correctly captured.
            drawFunction.bind(this)(context);
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
    }

    // --- Private Drawing Methods ---
    /**
     * Draws the final, colored biome map.
     */
    private drawBiomeMap(context: CanvasRenderingContext2D): void {
        for (let tile of this.mapData.grid.allTiles()) {
            if (tile.isRiver) {
                context.fillStyle = '#4a90e2'; // A distinct river blue
                context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {

                context.fillStyle = TERRAIN_COLORS[tile.terrain];
                context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }

    }

    private drawSettlements(context: CanvasRenderingContext2D): void {
        this.mapData.settlements.forEach((settlement, index) => {

            const tile = this.mapData.grid.getTile(settlement.y, settlement.x);

            context.beginPath();
            context.arc(tile.x * TILE_SIZE, tile.y * TILE_SIZE, 14, 0, 2 * Math.PI);
            context.fillStyle = this.getColorForId(index, this.mapData.settlements.length);
            context.fill();

            context.lineWidth = 2;
            context.strokeStyle = '#000000';
            context.stroke();
        })
    }

    private drawVillages(context: CanvasRenderingContext2D): void {
        const settlementColorId = new Map<string, number>();

        this.mapData.settlements.forEach((settlement, index) => {
            settlementColorId.set(settlement.id, index);
        })

        this.mapData.villages.forEach(village => {

            const tile = this.mapData.grid.getTile(village.y, village.x);

            context.beginPath();
            context.arc(tile.x * TILE_SIZE, tile.y * TILE_SIZE, 4, 0, 2 * Math.PI);
            context.fillStyle = this.getColorForId(settlementColorId.get(tile.village?.capital?.id || "") || 0, this.mapData.settlements.length, 0.2);
            context.fill();

            context.lineWidth = 2;
            context.strokeStyle = '#000000';
            context.stroke();
        })
    }

    private drawPoliticalMap(context: CanvasRenderingContext2D): void {
        const settlementColorId = new Map<string, number>();

        this.mapData.settlements.forEach((settlement, index) => {
            settlementColorId.set(settlement.id, index);
        })

        for (let tile of this.mapData.grid.allTiles()) {
            if (!tile.territoryOf) continue;

            context.fillStyle = this.getColorForId(settlementColorId.get(tile.territoryOf.id) || 0, this.mapData.settlements.length, 0.2);
            context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    private drawRoads(context: CanvasRenderingContext2D): void {
        for (let tile of this.mapData.grid.allTiles()) {
            if (tile.isRoad) {
                context.fillStyle = '#555555';
                context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
        for (let tile of this.mapData.grid.allTiles()) {
            if (tile.isRiver) {
                context.fillStyle = this.getColorForId(tile.riverId || 0, 100)
                context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }

        for (let tile of this.mapData.grid.allTiles()) {
            if (tile.isLake) {
                context.fillStyle = 'rgba(255,255,255, 0.5)';
                context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }




    }

    private getColorForId(id: number, maxId: number, alpha: number = 1): string {
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
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    }

    /**
     * A generic helper to draw any data layer as a grayscale image.
     * @param context The canvas context to draw on.
     * @param dataType The key of the data to render ('elevation', 'temperature', or 'moisture').
     */
    private drawGrayscaleMap(context: CanvasRenderingContext2D, dataType: 'elevation' | 'temperature' | 'moisture'): void {
        for (let tile of this.mapData.grid.allTiles()) {

            const value = tile[dataType]; // e.g., tile.elevation

            // Convert the 0-1 value to a 0-255 grayscale color component.
            const colorValue = Math.floor(value * 255);
            context.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
            context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        }

    }


    /**
     * Draws contour lines on the map to show the topology.
     * This should be called AFTER drawing the base terrain.
     * @param context The canvas context to draw on.
     */
    private drawContourLines(context: CanvasRenderingContext2D): void {
        const thresholds: number[] = [];
        for (let i = CONTOUR_CONFIG.LINE_INTERVAL; i < 1.0; i += CONTOUR_CONFIG.LINE_INTERVAL) {
            thresholds.push(i);
        }

        context.strokeStyle = CONTOUR_CONFIG.LINE_COLOR;
        context.lineWidth = CONTOUR_CONFIG.LINE_WIDTH;

        for (let currentTile of this.mapData.grid.allTiles()) {
            // --- Check Neighbor to the RIGHT ---
            const rightNeighbor = this.mapData.grid.getTile(currentTile.y, currentTile.x + 1);
            if (rightNeighbor) {
                // Check if any threshold is crossed between these two tiles
                for (const threshold of thresholds) {
                    if ((currentTile.elevation > threshold && rightNeighbor.elevation <= threshold) ||
                        (currentTile.elevation <= threshold && rightNeighbor.elevation > threshold))
                    {
                        // A line needs to be drawn on the vertical edge between them
                        const lineX = (currentTile.x + 1) * TILE_SIZE;
                        const lineY = currentTile.y * TILE_SIZE;

                        context.beginPath();
                        context.moveTo(lineX, lineY);
                        context.lineTo(lineX, lineY + TILE_SIZE);
                        context.stroke();

                        // We only need to draw one line per edge, even if multiple thresholds are crossed
                        break;
                    }
                }
            }

            // --- Check Neighbor BELOW ---
            const bottomNeighbor = this.mapData.grid.getTile(currentTile.y + 1, currentTile.x);
            if (bottomNeighbor) {
                // Check if any threshold is crossed between these two tiles
                for (const threshold of thresholds) {
                    if ((currentTile.elevation > threshold && bottomNeighbor.elevation <= threshold) ||
                        (currentTile.elevation <= threshold && bottomNeighbor.elevation > threshold))
                    {
                        // A line needs to be drawn on the horizontal edge between them
                        const lineX = currentTile.x * TILE_SIZE;
                        const lineY = (currentTile.y + 1) * TILE_SIZE;

                        context.beginPath();
                        context.moveTo(lineX, lineY);
                        context.lineTo(lineX + TILE_SIZE, lineY);
                        context.stroke();

                        break;
                    }
                }
            }
        }

    }
}