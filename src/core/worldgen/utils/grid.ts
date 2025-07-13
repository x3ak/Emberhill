import type {Tile} from "@/shared/types/world.types.ts";


export function hasNeighbouringRiver(tile: Tile, grid: Tile[][], radius: number): boolean {
    return getTilesInRadius(tile, grid, radius)
        .find(tile => tile.isRiver) !== undefined;
}

export function getTilesInRadius(centerTile: Tile, grid: Tile[][], radius: number): Tile[] {
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
                neighborY >= 0 && neighborY < grid.length &&
                neighborX >= 0 && neighborX < grid[0].length
            ) {
                neighbors.push(grid[neighborY][neighborX]);
            }
        }
    }

    return neighbors;
}

