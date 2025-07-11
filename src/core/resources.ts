import {AllResourceIds, type ResourceId, type ResourcesState} from "@/shared/types/resource.types.ts";
import type {ResourceAmount} from "@/shared/types/process.types.ts";
import type {GameCommand} from "./commands.ts";
import {GameObject, Subscribable} from "./mixins/Subscribable.mixin.ts";


export class GameResources extends Subscribable<ResourcesState, typeof GameObject>(GameObject) {
    private resources: Map<ResourceId, number> = new Map<ResourceId, number>();

    constructor() {
        super();

        AllResourceIds.map((resourceId: ResourceId) => {
            this.resources.set(resourceId, 0);
        });
    }

    addResource(id: ResourceId, amount: number) {

        const currentAmount = this.resources.get(id) || 0;

        this.resources.set(id, currentAmount + amount);

        this.setDirty();
    }

    subResource(id: ResourceId, amount: number): void {

        const currentAmount = this.resources.get(id) || 0;

        this.resources.set(id, currentAmount - amount);

        this.setDirty();
    }

    getAmount(id: ResourceId): number {
        return this.resources.get(id) || 0;
    }

    spend(inputs: ResourceAmount[]) {
        inputs.forEach(processInput => {
            switch (processInput.type) {
                case 'resource':
                    this.subResource(processInput.id, processInput.amount);
                    break;
            }
        })
    }

    add(outputs: ResourceAmount[]) {
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
    public init(): void {
    }

    public ready(): void {
    }

    public update(_deltaTime: number, _commands: GameCommand[]): void {

    }

    protected computeSnapshot(): ResourcesState {
        const resources:Map<ResourceId, number> = new Map<ResourceId, number>();

        AllResourceIds.map((resourceId: ResourceId) => {
            resources.set(resourceId, this.getAmount(resourceId));
        });

        return {
            resources: resources,
        }
    }
}