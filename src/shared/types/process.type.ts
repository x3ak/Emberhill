import type {ResourceId} from "@/shared/types/resource.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";

export const AllProcessIds = [
    'cut_tree_oak', 'cut_tree_birch', 'forage_for_kindling', 'cut_tree_pine', 'strip_birch_bark', 'search_for_mushrooms', 'cut_tree_maple', 'clear_underbrush', 'tap_maple_for_sap', 'cut_tree_yew', 'gather_fallen_feathers', 'prune_oak_trees', 'inspect_hollow_logs', 'cut_tree_ironwood', 'gather_glowing_moss', 'carve_decoy_totem', 'cut_tree_whisperwood', 'find_ancient_seed', 'commune_with_forest', 'harvest_sunpetal_blossom',
    'burn_log_oak', 'burn_log_birch'
] as const;

export type ProcessId = typeof AllProcessIds[number];

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
    duration: number; // how much time it takes to perform the process/action
    text: string;
    xp: number;
    requirements: ProcessRequirement[];
    inputs: ResourceAmount[];
    outputs: ResourceAmount[];
    effects: ProcessEffect[];  // effects are applied while the process is active
}
