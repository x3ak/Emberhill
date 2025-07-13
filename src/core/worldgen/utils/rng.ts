import alea from 'alea';

/**
 * Creates a seeded pseudo-random number generator (PRNG).
 * @param seed A string or number to seed the generator.
 * @returns A function that behaves like Math.random() but is deterministic.
 */
export function createSeededRNG(seed: string | number) {
    return alea(seed);
}