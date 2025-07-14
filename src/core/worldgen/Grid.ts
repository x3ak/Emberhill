import type {Tile} from "@/shared/types/world.types.ts";
import {MAP_CONFIG} from "@/core/worldgen/MapGenerator.ts";

export default class Grid {
    private tiles: Tile[][] = [];

    constructor(tiles: Tile[][]) {
        this.tiles = tiles;
    }

    public *allTiles(): Generator<Tile, void, void> {

        for (let y = 0; y < MAP_CONFIG.HEIGHT; y++) {
            for (let x = 0; x < MAP_CONFIG.WIDTH; x++) {
                yield this.tiles[y][x];
            }
        }
    }

    public getRawTiles(): Tile[][] {
        return this.tiles;
    }

    public hasNeighbouringRiver(tile: Tile, radius: number): boolean {
        return this.getTilesInRadius(tile, radius)
            .find(tile => tile.isRiver) !== undefined;
    }

    public getTilesInRadius(centerTile: Tile, radius: number): Tile[] {
        const neighbors: Tile[] = [];
        // Loop through a square area centered on the tile.
        // The loop goes from -radius to +radius on both axes.
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                // Skip the center tile itself.
                if (dx === 0 && dy === 0) continue;

                const neighborX = centerTile.x + dx;
                const neighborY = centerTile.y + dy;

                // --- Boundary Check ---
                if (
                    neighborY >= 0 && neighborY < this.tiles.length &&
                    neighborX >= 0 && neighborX < this.tiles[0].length
                ) {
                    neighbors.push(this.tiles[neighborY][neighborX]);
                }
            }
        }

        return neighbors;
    }

    public getTile(y: number, x: number): Tile {
        return this.tiles[y][x];
    }

}