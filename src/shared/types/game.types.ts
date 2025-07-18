import type {ResourceId} from "@/shared/types/resources.types.ts";
import type {ProcessId} from "@/shared/types/processes.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";

export type GameState = {
    wisps: {
        freeWisps: number,
        busyWisps: number,
    }
};

export type ResourceData = {
    id: ResourceId;
    name: string;
    description: string;
    icon?: string;
}
export type ResourcesState = {
    resources: Map<ResourceId, number>
}
export type ResourceAmount =
    | { type: "resource"; id: ResourceId; amount: number; chance?: number }

export type ProcessData = {
    id: ProcessId;
    buildingId: BuildingId;
    name: string;
    description: string;
    icon?: string;
    duration: number; // how much time it takes to perform the process/action
    text: string;
    xp: number;
    inputs: ResourceAmount[];
    outputs: ResourceAmount[];
}
export type ProcessStatus = 'STOPPED' | 'IDLE' | 'PAUSED' | 'RUNNING';
export type ProcessState = {
    id: ProcessId;
    processId: ProcessId;
    secondsSpent: number;
    duration: number;
    timeLeft: number;
    percentage: number;
    isProcessing: boolean;
    isActive: boolean;
    isUnlocked: boolean;
    status: ProcessStatus;
}
export type UnlockReward =
    | { type: "unlock_process"; processId: ProcessId; }
    | { type: "unlock_building"; buildingId: BuildingId }
    | { type: "grant_wisp"; amount: number }
    | { type: "global_modifier"; modifier: string; value: number };
export type BuildingLevelUp = {
    xp: number;
    resources: ResourceAmount[];
    rewards: UnlockReward[];
}
export type ProgressionData = {
    [level: number]: BuildingLevelUp
}
export type BuildingData = {
    id: BuildingId;
    name: string;
    processes: Map<ProcessId, ProcessData>,
    progression: ProgressionData,
}
export type BuildingState = {
    id: BuildingId;
    level: number;
    xp: number;
    isUnlocked: boolean;
    wispAssigned: boolean;
    canLevelUp: boolean;
    currentProcessId: ProcessId | null;
}
export type WarmstoneState = {
    currentVitality: number,
    maxVitality: number,
    currentLevel: number,
    essence: number,
    essenceForNextLevel: number,
    canLevelUp: boolean,
}
export type FullGameState = {
    resources: ResourcesState;
    warmstone: WarmstoneState;
    wisps: {
        freeWisps: number,
        busyWisps: number,
    },
    buildings: BuildingState[],
    processes: ProcessState[],
}

export type EconomyState = {

}

export type NationState = {
    id: string;
    population: number;
    name: string;
    villagesCount: number;
}