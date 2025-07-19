import {GameObject, Subscribable} from "@/core/mixins/Subscribable.mixin.ts";
import type {NationState} from "@/shared/types/game.types.ts";
import type {Settlement, Village} from "@/shared/types/world.types.ts";
import type {GameCommand} from "@/core/commands.ts";

const NATION_CONFIG = {
    cycle_seconds: 5,
    food_per_pop: 1/40, // 10 population eat one food
    tools_per_village: 1 // 1 wood/stone/mining per village per cycle
}

export default class Nation  extends Subscribable<NationState, typeof GameObject>(GameObject) {

    private id: string;
    private population: number;
    private capital: Settlement;
    private villages: Village[];

    private cycleTimer: number = 0;

    constructor(capital: Settlement, villages: Village[], population: number) {
        super();

        this.id = capital.id;
        this.population = population;
        this.capital = capital;
        this.villages = villages;
    }

    update(deltaTime: number, gameCommands: GameCommand[]): void {
        this.cycleTimer += deltaTime;

        let cyclesPassed = Math.floor(this.cycleTimer / NATION_CONFIG.cycle_seconds);

        for (let i = 0; i < cyclesPassed; i++) {

            const producedFood = this.computeFoodProduction();
            const foodConsumption = this.computeFoodConsumption();

            const foodBalance = producedFood - foodConsumption;

            if (foodBalance > 0) {
                gameCommands.push({type: "ECONOMY_RESOURCE_SUPPLY", payload: {nation: this, resources: [{type: "resource", id: "BERRIES", amount: foodBalance}]}})
            } else {
                gameCommands.push({type: "ECONOMY_RESOURCE_DEMAND", payload: {nation: this, resources: [{type: "resource", id: "BERRIES", amount: Math.abs(foodBalance)}]}})
            }
        }

        this.cycleTimer -= NATION_CONFIG.cycle_seconds * cyclesPassed;
    }

    private computeFoodProduction(): number {
        return this.villages.reduce((accumulator, village) => {
            if (village.specialization === "FARMING") {
                return accumulator + 1;
            }

            return accumulator;
        }, 0)
    }

    private computeFoodConsumption(): number {
        return this.population * NATION_CONFIG.food_per_pop;
    }

    protected computeSnapshot(): NationState {
        return {
            id: this.id,
            population: this.population,
            name: this.capital.name,
            villagesCount: this.villages.length,
        }
    }

}