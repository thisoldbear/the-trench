import {
  randomInt,
  setSeed,
  getSeed,
  resetPRNG,
  random,
  createPRNG,
  generateRandomSeed,
} from "./prng";

/**
 * Simulates rolling a die with a given number of sides using a seedable PRNG.
 * @param {number} sides - The number of sides on the die (e.g., 6 or 20).
 * @returns {number} - A random integer between 1 and the number of sides.
 */
export function rollDice(sides: number): number {
  if (!Number.isFinite(sides) || sides < 1) {
    throw new Error(`Invalid number of sides: ${sides}`);
  }
  const integerSides = Math.floor(sides);
  return randomInt(1, integerSides);
}

export { setSeed, getSeed, resetPRNG, random, createPRNG, generateRandomSeed };
