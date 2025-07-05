import {Building} from "./Building.ts";
import {Wisp} from "./wisps.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import {Warmstone, warmstone} from "./warmstone.ts";
import {GameResources} from "./resources.ts";
import {type BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessData} from "@/shared/types/process.types.ts";
import type {GameCommand} from "./commands.ts";
import {EmptyBase, Subscribable} from "./mixins/Subscribable.mixin.ts";
import type {PlayerCommand} from "@/shared/types/player.commands.ts";
import type {FullGameState, GameState} from "@/shared/types/game.types.ts";

export const SIMULATION_SPEED: number = 1;


class GameEngine extends Subscribable<GameState, typeof EmptyBase>(EmptyBase) {

    private lastTickTime: number = performance.now();

    public readonly dispatch: (action: PlayerCommand) => void;

    public readonly resources: GameResources = new GameResources();

    private buildings: Map<BuildingId, Building> = new Map();

    private wisps: Wisp[] = []

    public readonly warmstone: Warmstone = new Warmstone(1000);

    constructor() {

        super();
        console.log("GameEngine instance created.");

        this.dispatch = this._dispatch.bind(this);



    }

    public getBuildings(): Map<BuildingId, Building> {
        return this.buildings;
    }

    public getBuilding(buildingId:BuildingId): Building {

        if (!this.buildings.has(buildingId)) {
            throw new Error(`Building ${buildingId} not found!`);
        }

        // @ts-ignore
        return this.buildings.get(buildingId);
    }

    init() {

        // find a better way to handle
        const woodcutter = new Building(BUILDINGS.woodcutter);
        this.buildings.set('woodcutter', woodcutter);

        const campfire = new Building(BUILDINGS.campfire);
        this.buildings.set('campfire', campfire);


        this.wisps.push(new Wisp());
        this.wisps.push(new Wisp());
    }


    start() {
        this.init();

        this.buildings.forEach((building) => building.init())
        this.buildings.forEach((building) => building.getProcesses().forEach(process => process.init()))

        this.buildings.forEach((building) => building.ready())
        this.buildings.forEach((building) => building.getProcesses().forEach(process => process.ready()))


        setInterval(() => {
            this._dispatch({type: "TICK"});
        }, 400)
    }

    computeSnapshot(): GameState {
        return {
            wisps: {
                freeWisps: this.wisps.filter(wisp => !wisp.isAssigned).length,
                busyWisps: this.wisps.filter(wisp => wisp.isAssigned).length,
            }
        };

    }

    private _dispatch(playerCommand: PlayerCommand) {
        const gameCommands: GameCommand[] = [];

        const now = performance.now();
        const deltaTime = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;

        this.runUpdates(deltaTime, gameCommands);

        this.reducePlayerCommands(playerCommand);

        this.reduceGameCommands(gameCommands);

        this.buildings.forEach((building) => {
            building.postUpdate()
            building.getProcesses().forEach(process => process.postUpdate());
        })

        this.resources.postUpdate();
        this.postUpdate();
    }

    private runUpdates(deltaTime: number, gameCommands: GameCommand[]): void {
        if (warmstone.update(deltaTime)) {
            this.setDirty()
        }

        this.buildings.forEach((building) => {
            building.update(deltaTime, gameCommands)
            building.getProcesses().forEach(process => process.update(deltaTime, gameCommands));
        })

        // this.wisps
        //     .forEach(wisp => {
        //         wisp.runForEveryAssignment((building) => {
        //             building.update(deltaTime, gameCommands);
        //             building.getCurrentProcess()?.update(deltaTime, gameCommands);
        //         })
        //     });
    }

    private reducePlayerCommands(command: PlayerCommand) {
        switch (command.type) {
            case 'TICK': {
                // is handled before in runUpdates
                break;
            }

            case 'ASSIGN_WISP': {
                const freeWisp = this.getUnassignedWisp();
                if (!freeWisp) {
                    break;
                }

                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.assignWisp(freeWisp);

                break;
            }

            case 'UNASSIGN_WISP': {
                const {buildingId} = command.payload;
                this.buildings.get(buildingId)?.unassignWisp();

                break;
            }

            case 'SET_PROCESS': {
                const {buildingId, processId} = command.payload;
                const processData: ProcessData | null = BUILDINGS[buildingId].processes[processId] || null;
                if (!processData) {
                    break
                }

                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.setProcess(processData);

                break;
            }

            case 'UNSET_PROCESS': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.unsetProcess();

                break;
            }

            case 'UPGRADE_BUILDING': {
                const {buildingId} = command.payload;
                let building = this.buildings.get(buildingId);
                if (!building) {
                    break
                }

                building.upgrade();

                break;
            }
        }
    }

    private reduceGameCommands(gameCommands: GameCommand[]) {
        if (gameCommands.length === 0) {
            return;
        }

        gameCommands.forEach(command => {
            console.log("GAME_COMMAND", command);
            switch (command.type) {
                case 'SPEND_RESOURCES':
                    this.resources.spend(command.payload.resources)
                    break;
                case 'ADD_RESOURCES':
                    this.resources.add(command.payload.resources)
                    break;
                case 'ADD_XP':
                    this.buildings.get(command.payload.buildingId)?.addXP(command.payload.amount)
                    break;
            }
        })

        this.setDirty()
    }

    public computeFullGameSnapshot(): FullGameState {

        const buildingsState = [... this.buildings]
            .map(([_buildingId, building]) => building.getSnapshot());

        const processesState = [... this.buildings].flatMap(([_buildingId, building]) => {
            return [... building.getProcesses()].map(([_processId, process]) => process.getSnapshot())
        });

        return {

            warmstone: this.warmstone.getSnapshot(),
            resources: this.resources.getSnapshot(),
            wisps: {
                freeWisps: this.wisps.filter(wisp => !wisp.isAssigned).length,
                busyWisps: this.wisps.filter(wisp => wisp.isAssigned).length,
            },
            buildings: buildingsState,
            processes: processesState,
        }
    }

    private getUnassignedWisp(): Wisp | undefined {
        return this.wisps.find(wisp => !wisp.isAssigned);
    }

}

const gameEngineInstance = new GameEngine();

export const gameInstance = gameEngineInstance as GameEngine;

export type { GameEngine };