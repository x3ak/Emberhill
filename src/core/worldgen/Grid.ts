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

    // 1 to 10 where 1 is easy 10 is impossible
    public getTileMovementCost(tile: Tile): number {
        // if (tile.terrain == 'COASTAL_WATER' || tile.terrain == 'DEEP_OCEAN' || tile.terrain == 'SNOWY_MOUNTAIN') {
        //     return 10;
        // }

        switch (tile.terrain) {

            case "SNOWY_MOUNTAIN":
            case "DEEP_OCEAN":
                return 10;

            case "MOUNTAIN":
                return 8;

            case "DESERT":
            case "TUNDRA":
                return 4;

            case "COASTAL_WATER":
                if (tile.isRiver) {
                    return 2;
                }

                return 10;


            case "TAIGA":
            case "JUNGLE":
                return 3;

            case "SAVANNA":
            case "FOREST":
            case "BEACH":
                return 2;

            case "PLAINS":
                return 1;
        }
    }

    public calculateTileScore(tile: Tile): number {
        let score = 0;

        // Bonus for being near fresh water (river/lake)
        if (this.isNeighboring(tile, t => t.isRiver || t.isLake)) {
            score += 20;
        }

        // Bonus for being on the coast
        if (this.isNeighboring(tile, t => t.terrain === 'COASTAL_WATER')) {
            score += 15;
        }

        // Bonus for fertile land
        if (tile.terrain === 'PLAINS') score += 10;

        // Small bonus for access to wood
        if (this.isNeighboring(tile, t => t.terrain === 'FOREST')) {
            score += 5;
        }

        // Small bonus for access to stone/ore
        if (this.isNeighboring(tile, t => t.terrain === 'MOUNTAIN')) {
            score += 5;
        }

        return score;
    }

    public isNeighboring(tile: Tile, condition: (neighbor: Tile) => boolean): boolean {
        for (const neighbor of this.getTilesInRadius(tile, 2)) {
            if (condition(neighbor)) {
                return true;
            }
        }
        return false;
    }

    public getTile(y: number, x: number): Tile {
        return this.tiles[y]?.[x];
    }

}