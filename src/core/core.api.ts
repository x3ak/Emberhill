import type {ProcessId} from "@/shared/types/processes.types.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {workerAPI} from "./worker.api.ts";
import {RESOURCES} from "@/core/data/resources.data.ts";
import type {BuildingData, ProcessData, ResourceData} from "@/shared/types/game.types.ts";
import type {ResourceId} from "@/shared/types/resources.types.ts";
import {PROCESSES} from "@/core/data/processes.data.ts";
import {PROGRESSION} from "@/core/data/progression.data.ts";

function getResourceData(id: ResourceId): ResourceData {
    if (!RESOURCES[id]) {
        throw new Error(`Resource ${id} not found!`);
    }
    // @ts-ignore
    return RESOURCES[id];
}

function getProcessData(processId: ProcessId): ProcessData | null {
    return PROCESSES[processId];
}

function getBuildingData(id: BuildingId): BuildingData {
    // @ts-ignore
    return BUILDINGS[id];
}

const getWarmstoneProgression = () => {
    return PROGRESSION['warmstone'];
}


const buildingLevelUp = (buildingId: BuildingId) => {
    workerAPI.dispatch({type: 'UPGRADE_BUILDING', payload: {buildingId: buildingId}});
}

const unassignWisp = (buildingId: BuildingId) => {
    workerAPI.dispatch({type: 'UNASSIGN_WISP', payload: {buildingId: buildingId}});
}

const assignWisp = (buildingId: BuildingId) => {
    workerAPI.dispatch({type: 'ASSIGN_WISP', payload: {buildingId: buildingId}});
}

const setProcess = (buildingId: BuildingId, processId: ProcessId) => {
    workerAPI.dispatch({type: 'SET_PROCESS', payload: {buildingId: buildingId, processId: processId}});
}

const unsetProcess = (buildingId: BuildingId) => {
    workerAPI.dispatch({type: 'UNSET_PROCESS', payload: {buildingId: buildingId}});
}

const upgradeWarmstone = () => {
    workerAPI.dispatch({type: 'UPGRADE_WARMSTONE'});
}

export const coreAPI = {
    getResourceData,
    getProcessData,
    building: {
        assignWisp,
        unassignWisp,
        setProcess,
        unsetProcess,
        getData: getBuildingData,
        upgrade: buildingLevelUp,
    },
    upgradeWarmstone,
    getWarmstoneProgression,
}