import type { WorldMap } from '@/shared/types/world.types.ts';

export abstract class WorldGenerationFeature {
    protected readonly worldMap: WorldMap;
    protected readonly seed: string;

    protected constructor(worldMap: WorldMap, seed: string) {
        this.worldMap = worldMap;
        this.seed = seed;
    }

    public abstract execute(): void;
}
