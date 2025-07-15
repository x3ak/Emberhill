import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";
import type {BuildingState} from "@/shared/types/building.types.ts";
import type {ProcessState} from "@/shared/types/process.types.ts";

import type {ResourceId} from "@/shared/types/resources.types.ts";

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