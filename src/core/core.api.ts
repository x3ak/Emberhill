import type {ResourceData, ResourceId} from "@/shared/types/resource.types.ts";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import {RESOURCES} from "./data/resources-data.ts";
import {BUILDINGS} from "./data/buildings-data.ts";
import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {useGameDispatch} from "../hooks/useGame.ts";

const gameDispatch = useGameDispatch();

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
    gameDispatch({type: 'UPGRADE_BUILDING', payload: {buildingId: buildingId}});
}

const unassignWisp = (buildingId: BuildingId) => {
    gameDispatch({type: 'UNASSIGN_WISP', payload: {buildingId: buildingId}});
}

const assignWisp = (buildingId: BuildingId) => {
    gameDispatch({type: 'ASSIGN_WISP', payload: {buildingId: buildingId}});
}

const setProcess = (buildingId: BuildingId, processId: ProcessId) => {
    gameDispatch({type: 'SET_PROCESS', payload: {buildingId: buildingId, processId: processId}});
}

const unsetProcess = (buildingId: BuildingId) => {
    gameDispatch({type: 'UNSET_PROCESS', payload: {buildingId: buildingId}});
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