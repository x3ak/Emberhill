export const MAP_CONFIG = {
    WIDTH: 400,
    HEIGHT: 400,
};
export const NOISE_CONFIG = {
    ELEVATION_SCALE: 0.014,
    DETAIL_SCALE: 0.03,
    DETAIL_AMPLITUDE: 0.2, // How much impact the detail noise has. Should be less than 1.0
    TEMPERATURE_SCALE: 0.02,
    MOISTURE_SCALE: 0.05,
    SEA_NOISE_SCALE: 0.01, // VERY low frequency for large, smooth shapes
};
export const TEMP_CONFIG = {
    NOISE_SCALE: 0.01, // Low frequency for large, smooth climate bands
    MIN_TEMP: 0.25,    // The coldest a lowland area can be (prevents Tundra)
    MAX_TEMP: 0.75,    // The hottest a lowland area can be (prevents Desert)
    GRADIENT_STRENGTH: 0.25, // How much the north-south gradient affects temp (e.g., 20%)
};
export const ELEVATION_EFFECTS = {
    TEMP_DROP_FACTOR: 0.20, // How much colder high elevations get
    // We can add a power to make the effect non-linear
    TEMP_DROP_POWER: 1.8,
};
export const TERRAIN_THRESHOLDS = {
    // Water is now only in the bottom 25% of the elevation range
    DEEP_OCEAN: 0.08,
    COASTAL_WATER: 0.11,
    // Beach is a very narrowband
    BEACH: 0.14,
    // Mountains are pushed to the very top
    MOUNTAIN: 0.785,
    SNOWY_MOUNTAIN: 0.90,
};