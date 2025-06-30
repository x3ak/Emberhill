import type {ResourceId} from "@/shared/types/resource.types.ts";
import type {ResourceAmount} from "@/shared/types/process.type.ts";

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

    setResource(id: ResourceId, amount: number): void {
        this.resources[id] = amount;
    }

    getAmount(id: ResourceId): number {
        return this.resources[id];
    }

    getResources(): Record<ResourceId, number> {
        return this.resources;
    }

    hasEnoughResourcesToStartTheProcess(inputs: ResourceAmount[]): boolean {
        let hasEnough = true;
        inputs.forEach(processInput => {
            switch (processInput.type) {
                case 'resource':
                    if (!this.hasResource(processInput.id, processInput.amount)) {
                        hasEnough = false;
                    }
                    break;
            }
        })

        return hasEnough;
    }

    spendResourcesForProcess(inputs: ResourceAmount[]) {
        inputs.forEach(processInput => {
            switch (processInput.type) {
                case 'resource':
                    this.subResource(processInput.id, processInput.amount);
                    break;
            }
        })
    }

    addResourcesFromProcess(outputs: ResourceAmount[]) {
        outputs.forEach(processOutput => {
            switch (processOutput.type) {
                case 'resource':
                    this.addResource(processOutput.id, processOutput.amount);
                    break;
            }
        })
    }
}