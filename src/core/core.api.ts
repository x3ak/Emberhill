import type {ResourceData, ResourceId} from "@/shared/types/resource.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {RESOURCES} from "./data/resources-data.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {game} from "./engine.ts";

export function sendTick() {
    game.dispatch({type: 'TICK' })
}

function getResourceData(id: ResourceId): ResourceData {
    return RESOURCES[id];
}

function getProcessData(buildingId: BuildingId, processId: ProcessId): ProcessData | null {
    return BUILDINGS[buildingId].processes[processId] || null;
}

function getBuildingData(id: BuildingId): BuildingData {
    return BUILDINGS[id];
}

const buildingLevelUp = (buildingId: BuildingId) => {
    game.dispatch({type: 'UPGRADE_BUILDING', payload: {buildingId: buildingId}});
}

const unassignWisp = (buildingId: BuildingId) => {
    game.dispatch({type: 'UNASSIGN_WISP', payload: {buildingId: buildingId}});
}

const assignWisp = (buildingId: BuildingId) => {
    game.dispatch({type: 'ASSIGN_WISP', payload: {buildingId: buildingId}});
}

const setProcess = (buildingId: BuildingId, processId: ProcessId) => {
    game.dispatch({type: 'SET_PROCESS', payload: {buildingId: buildingId, processId: processId}});
}

const unsetProcess = (buildingId: BuildingId) => {
    game.dispatch({type: 'UNSET_PROCESS', payload: {buildingId: buildingId}});
}

export const coreAPI = {
    sendTick,
    getResourceData,
    getProcessData,
    building: {
        assignWisp,
        unassignWisp,
        setProcess,
        unsetProcess,
        getData: getBuildingData,
        upgrade: buildingLevelUp,
    }
}