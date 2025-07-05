import type {ResourcesState} from "@/shared/types/resource.types.ts";
import type {WarmstoneState} from "@/shared/types/warmstone.types.ts";
import type {BuildingState} from "@/shared/types/building.types.ts";
import type {ProcessState} from "@/shared/types/process.type.ts";

export type GameState = {
    wisps: {
        freeWisps: number,
        busyWisps: number,
    }
};

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