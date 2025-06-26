import {type ResourceId} from "./data/resources-data.ts";

export class GameResources {
    private resources: Record<ResourceId, number> = {
        LOG_OAK: 0,
        LOG_BIRCH: 0,
    };

    addResource(id: ResourceId, amount: number) {
        this.resources[id] += amount;
    }

    hasResource(id: ResourceId, amount: number): boolean {
        return this.resources[id] >= amount;
    }

    subResource(id: ResourceId, amount: number): void {
        this.resources[id] -= amount;
    }

    getResources(): Record<ResourceId, number> {
        return this.resources;
    }
}