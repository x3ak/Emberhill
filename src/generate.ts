// Get the seed from command line arguments or use a default
import {generateWorld} from "@/core/worldgen";

const seed = process.argv[2] || `world_${Date.now()}`;

console.log(`--- Starting World Generation with Seed: "${seed}" ---`);
generateWorld(seed, `world_output_${seed}.png`);