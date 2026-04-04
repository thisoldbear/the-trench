/**
 * Simulates rolling a die with a given number of sides.
 * @param {number} sides - The number of sides on the die (e.g., 6 or 20).
 * @returns {number} - A random integer between 1 and the number of sides.
 */
export function rollDice(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}
