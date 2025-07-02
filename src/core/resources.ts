import {type ResourceId} from "@/shared/types/resource.types.ts";
import type {ResourceAmount} from "@/shared/types/process.type.ts";
import type {GameCommand} from "./commands.ts";

export class GameResources {
    private isDirty: boolean = false;

    private resources: Record<ResourceId, number> = {
        LOG_BIRCH: 0,
        LOG_OAK: 0,
        LOG_PINE: 0,
        LOG_MAPLE: 0,
        LOG_YEW: 0,
        LOG_IRONWOOD: 0,
        LOG_WHISPERWOOD: 0,
        ESSENCE_SHADOW: 0,
        BIRCH_BARK: 0,
        KINDLING: 0,
        RESIN: 0,
        FIBERS: 0,
        MAPLE_SAP: 0,
        FEATHERS: 0,
        SEED_ANCIENT: 0,
        GRUBS: 0,
        MUSHROOMS: 0,
        LOST_COIN: 0,
        MOSS_GLOWING: 0,
        TOTEM_DECOY: 0,
        BLOSSOM_SUNPETAL: 0,
        TOOL_BUCKET: 0,
        TOOL_STEEL_AXE: 0,
        TOOL_BLESSED_SICKLE: 0
    }
    addResource(id: ResourceId, amount: number) {

        this.resources[id] += amount;
        this.isDirty = true;
    }

    hasResource(id: ResourceId, amount: number): boolean {
        return this.resources[id] >= amount;
    }

    subResource(id: ResourceId, amount: number): void {
        this.resources[id] -= amount;
        this.isDirty = true;
    }

    setResource(id: ResourceId, amount: number): void {
        this.resources[id] = amount;
        this.isDirty = true;
    }

    getAmount(id: ResourceId): number {
        return this.resources[id];
    }

    getResources(): Record<ResourceId, number> {
        return this.resources;
    }

    hasEnoughToStartTheProcess(inputs: ResourceAmount[]): boolean {
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

    hasEnoughAfterPlanned(cost: ResourceAmount[], plannedSpends: GameCommand[]): boolean {
        if (cost.length == 0) {
            return true;
        }

        const spendMap = new Map<ResourceId, number>();

        plannedSpends
            .filter(s => s.type == "SPEND_RESOURCES")
            .flatMap(s => s.payload.resources)
            .forEach(spend => {
                spendMap.set(spend.id, (spendMap.get(spend.id) || 0) + spend.amount);
            })

        for (const costItem of cost) {
            const currentAmount = this.getAmount(costItem.id);
            const plannedAmount = spendMap.get(costItem.id) || 0;

            if (costItem.amount > currentAmount - plannedAmount) {
                return false;
            }
        }

        return true;
    }

    hasChanged(): boolean {
        return this.isDirty;
    }
}