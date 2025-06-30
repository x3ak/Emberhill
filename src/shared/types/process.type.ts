import type {ResourceId} from "@/shared/types/resource.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";

export const AllProcessIds = [
    'cut_tree_oak', 'cut_tree_birch',
    'burn_log_oak', 'burn_log_birch'
] as const;

export type ProcessId = typeof AllProcessIds[number];

export type ProcessInputOutput =
    | { type: "resource"; id: ResourceId; amount: number }

export type ProcessRequirement =
    | { type: "min_building_level"; id: BuildingId; amount: number; }

export type ProcessEffect = {
    warmstone_vitality_restoration: number; // amount of vitality restored per second
}

export type ProcessData = {
    id: ProcessId;
    name: string;
    description: string;
    duration: number; // how much time it takes to perform the process/action
    text: string;
    xp: number;
    requirements: ProcessRequirement[];
    inputs: ProcessInputOutput[];
    outputs: ProcessInputOutput[];
    effects: ProcessEffect[];  // effects are applied while the process is active
}
