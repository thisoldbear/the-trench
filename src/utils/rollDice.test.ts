import { expect, test, describe } from "vitest";
import { rollDice } from "./rollDice";

describe("rollDice", () => {
  test("returns a number between 1 and sides (inclusive)", () => {
    const result = rollDice(6);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });

  test("handles d20 rolls", () => {
    const result = rollDice(20);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(20);
  });

  test("handles d3 rolls", () => {
    const result = rollDice(3);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(3);
  });

  test("returns 1 when rolling d1", () => {
    const result = rollDice(1);
    expect(result).toBe(1);
  });

  test("handles d100 rolls", () => {
    const result = rollDice(100);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(100);
  });

  test("statistical distribution (1000 rolls should cover full range)", () => {
    const sides = 6;
    const rolls = new Set<number>();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const result = rollDice(sides);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(sides);
      rolls.add(result);
    }

    // With 1000 rolls of d6, we should see all 6 numbers
    expect(rolls.size).toBe(sides);
  });

  test("statistical distribution for d20 (1000 rolls)", () => {
    const sides = 20;
    const rolls = new Set<number>();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const result = rollDice(sides);
      rolls.add(result);
    }

    // With 1000 rolls of d20, we should see most numbers (allow for statistical variance)
    expect(rolls.size).toBeGreaterThan(15);
  });

  test("never returns 0", () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDice(6);
      expect(result).not.toBe(0);
    }
  });

  test("never returns value greater than sides", () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDice(10);
      expect(result).toBeLessThanOrEqual(10);
    }
  });
});
