import type {ResourceData, ResourceId} from "@/shared/types/resource.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {RESOURCES} from "./data/resources-data.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {workerAPI} from "./worker.api.ts";

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
    }
}