import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";
import type {BuildingId, BuildingState} from "@/shared/types/building.types.ts";

import type {ResourceId} from "@/shared/types/resources.types.ts";
import type {ProcessId} from "@/shared/types/process.types.ts";

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
export type ProcessRequirement =
    | { type: "min_building_level"; id: BuildingId; amount: number; }
export type ProcessEffect = {
    warmstone_vitality_restoration: number; // amount of vitality restored per second
}
export type ProcessData = {
    id: ProcessId;
    name: string;
    description: string;
    icon?: string;
    duration: number; // how much time it takes to perform the process/action
    text: string;
    xp: number;
    inputs: ResourceAmount[];
    outputs: ResourceAmount[];
    effects: ProcessEffect[];  // effects are applied while the process is active
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