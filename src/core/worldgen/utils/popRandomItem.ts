import {createSeededRNG} from "@/core/worldgen/utils/rng.ts";
import type {NoiseFunction2D} from "simplex-noise";

/**
 * Selects a random item from an array, removes it from that array,
 * and returns the removed item.
 *
 * Note: This function MUTATES the original array.
 *
 * @param array The array to pop an item from.
 * @param rng
 * @returns The randomly removed item from the array, or undefined if the array is empty.
 */
export function popRandomItem<T>(array: T[], rng: NoiseFunction2D): T | undefined {
    // If the array is empty, there's nothing to pop.
    if (array.length === 0) {
        return undefined;
    }

    // 1. Generate a random index from 0 to array.length - 1
    const randomIndex = Math.floor(rng() * array.length);

    // 2. Use splice() to remove 1 item at the randomIndex.
    // splice() returns an array of the removed items. Since we're only removing one,
    // we take the first element ([0]) of that returned array.
    const [removedItem] = array.splice(randomIndex, 1);

    // 3. Return the item that was removed.
    return removedItem;
}