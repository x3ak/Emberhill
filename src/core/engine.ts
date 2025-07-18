import {Building} from "./Building.ts";
import {Wisp} from "./wisps.ts";
import {BUILDINGS} from "./data/buildings.data.ts";
import {Warmstone} from "./warmstone.ts";
import {GameResources} from "./resources.ts";
import type { BuildingId} from "@/shared/types/building.types.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";
import type {GameCommand} from "./commands.ts";
import {GameObject, Subscribable} from "./mixins/Subscribable.mixin.ts";
import type {PlayerCommand} from "@/shared/types/player.commands.ts";
import type {FullGameState, GameState, ProcessData} from "@/shared/types/game.types.ts";

import {Process} from "./Process.ts";
import {SIMULATION_SPEED} from "@/shared/Globals.ts";
import {Progression} from "./Progression.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";
import Nation from "@/core/Nation.ts";
import {SETTLEMENTS} from "@/core/data/settlements.data.ts";
import {VILLAGES} from "@/core/data/villages.data.ts";
import type {Village} from "@/shared/types/world.types.ts";


class GameEngine extends Subscribable<GameState, typeof GameObject>(GameObject) {

    private lastTickTime: number = performance.now();

    public readonly dispatch: (action: PlayerCommand) => void;

    public readonly resources: GameResources = new GameResources();

    private buildings: Map<BuildingId, Building> = new Map();
    private processes: Map<ProcessId, Process> = new Map();

    private wisps: Wisp[] = []

    private nations: Nation[] = [];

    private gameObjects: GameObject[] = [];

    public readonly warmstone: Warmstone = new Warmstone(1000);
    public readonly progression: Progression = new Progression();

    private isStarted: boolean = false;

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

    public getProcess(processId:ProcessId): Process {

        if (!this.processes.has(processId)) {
            throw new Error(`Process ${processId} not found!`);
        }

        // @ts-ignore
        return this.processes.get(processId);
    }

    init() {

        for (let buildingId in BUILDINGS) {
            const building = this.initBuilding(buildingId as  BuildingId);
            building.init();
            this.gameObjects.push(building);
            building.getProcesses().forEach(process => {
                process.init()
                this.gameObjects.push(process);
                this.processes.set(process.getId(), process);
            })
            this.buildings.set(buildingId as  BuildingId, building);
        }

        this.wisps.push(new Wisp());
        this.wisps.push(new Wisp());

        for (let settlementId in SETTLEMENTS) {
            const settlement = SETTLEMENTS[settlementId];
            if (!settlement) continue;

            const villages: Village[] = [];

            for (let villageId in VILLAGES) {
                const village =  VILLAGES[villageId];
                if (!village) continue;
                if (village.capital?.id === settlementId) {
                    villages.push(village)
                }
            }

            const nation = new Nation(
                settlement,
                villages,
                100
            );

            nation.init();
            this.gameObjects.push(nation);
            this.nations.push(nation);
        }

        this.warmstone.init();
        this.gameObjects.push(this.warmstone);

        this.resources.init();
        this.gameObjects.push(this.resources);
    }

    ready(gameCommands: GameCommand[]): void {
        this.gameObjects.forEach((gameObject: GameObject) => {
            gameObject.ready(gameCommands);
        })
    }

    private initBuilding(buildingId:BuildingId): Building {
        const buildingData = BUILDINGS[buildingId];
        if (!buildingData) {
            throw new Error(`Building DATA for ${buildingId} not found!`);
        }

        return new Building(buildingData);
    }

    // in init() we handle all object initialisations (similar to constructor)
    // in ready() we assume all objects are created, so we can now update their states



    start() {
        if (this.isStarted) {
            return;
        }

        console.info("Starting game...");

        this.init();

        const gameCommands: GameCommand[] = [];

        this.ready(gameCommands);

        this._dispatch({type: "TICK"}, gameCommands);

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

    private _dispatch(playerCommand: PlayerCommand, gameCommands?: GameCommand[]) {

        if (!gameCommands) {
            gameCommands = [];
        }

        const now = performance.now();
        const deltaTime = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;

        // update all game objects
        this.gameObjects.forEach((gameObject) => {
            gameObject.update(deltaTime * SIMULATION_SPEED, gameCommands);
        })

        // run inputs
        this.reducePlayerCommands(playerCommand, gameCommands);
        this.reduceGameCommands(gameCommands);

        // run post updates
        // here changes are pushed to UI for example
        this.gameObjects.forEach((gameObject: GameObject) => {
            gameObject.postUpdate();
        });
        this.postUpdate();
    }

    private reducePlayerCommands(command: PlayerCommand, gameCommands: GameCommand[]) {
        switch (command.type) {
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
                const processData: ProcessData | null = PROCESSES[processId] || null;
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

                building.upgrade(gameCommands);

                break;
            }

            case 'UPGRADE_WARMSTONE': {
                this.warmstone.upgrade(gameCommands);
                break;
            }
        }
    }



    private reduceGameCommands(gameCommands: GameCommand[]) {
        if (gameCommands.length === 0) {
            return;
        }

        let foodDemanded = 0;
        let foodSupply = 0;

        gameCommands.forEach(command => {
            // console.log("GAME_COMMAND", command);
            switch (command.type) {
                case 'SPEND_RESOURCES':
                    this.resources.spend(command.payload.resources)
                    break;
                case 'ADD_RESOURCES':
                    this.resources.add(command.payload.resources)
                    break;
                case 'ADD_XP':
                    this.buildings.get(command.payload.buildingId)?.addXP(command.payload.amount);
                    this.warmstone.onExperienceAdded(command.payload.amount);
                    break;
                case 'UNLOCK_PROCESS':
                    gameInstance.getProcess(command.payload.processId)?.setLocked(false)
                    break;
                case 'UNLOCK_BUILDING':
                    gameInstance.getBuilding(command.payload.buildingId)?.setLocked(false)
                    break;
                case 'ECONOMY_RESOURCE_SUPPLY':
                    command.payload.resources.forEach(resource => {
                        foodSupply += resource.amount || 0;
                    })

                    break;
                case 'ECONOMY_RESOURCE_DEMAND':
                    command.payload.resources.forEach(resource => {
                        foodDemanded += resource.amount || 0;
                    })
                    break;
            }


        })

        console.log("supply", foodSupply, "demand", foodDemanded)

        this.setDirty()
    }

    public computeFullGameSnapshot(): FullGameState {
        console.log("compute fullgame snapshot for " + this.lastTickTime);
        // this.start();

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