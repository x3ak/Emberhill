import {GameObject, Subscribable} from "@/core/mixins/Subscribable.mixin.ts";
import type {NationState} from "@/shared/types/game.types.ts";
import type {Settlement, Village} from "@/shared/types/world.types.ts";
import type {GameCommand} from "@/core/commands.ts";

export default class Nation  extends Subscribable<NationState, typeof GameObject>(GameObject) {

    private id: string;
    private population: number;
    private capital: Settlement;
    private villages: Village[];

    constructor(capital: Settlement, villages: Village[], population: number) {
        super();

        this.id = capital.id;
        this.population = population;
        this.capital = capital;
        this.villages = villages;
    }

    update(_deltaTime: number, _gameCommands: GameCommand[]): void {

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