export const AllProcessIds = [
    'cut_tree_oak', 'cut_tree_birch', 'forage_for_kindling', 'cut_tree_pine', 'strip_birch_bark', 'search_for_mushrooms', 'cut_tree_maple', 'clear_underbrush', 'tap_maple_for_sap', 'cut_tree_yew', 'gather_fallen_feathers', 'prune_oak_trees', 'inspect_hollow_logs', 'cut_tree_ironwood', 'gather_glowing_moss', 'carve_decoy_totem', 'cut_tree_whisperwood', 'find_ancient_seed', 'commune_with_forest', 'harvest_sunpetal_blossom',
    'burn_log_oak', 'burn_log_birch',
    'mine_stone', 'mine_copper_ore',
    'collect_berries', 'gather_kindling', 'collect_fibers',
    'grow_blackberries',
    'create_crude_hoe', "till_soil",
] as const;

export type ProcessId = typeof AllProcessIds[number];

