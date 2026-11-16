import { expect, test, describe } from "vitest";
import { rollDice, setSeed, resetPRNG, getSeed, createPRNG } from "./rollDice";

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

  test("throws error when sides is less than 1 or not finite", () => {
    expect(() => rollDice(0)).toThrow("Invalid number of sides");
    expect(() => rollDice(-5)).toThrow("Invalid number of sides");
    expect(() => rollDice(NaN)).toThrow("Invalid number of sides");
    expect(() => rollDice(Infinity)).toThrow("Invalid number of sides");
  });

  describe("seedable determinism", () => {
    test("produces the exact same sequence given the same numeric seed", () => {
      setSeed(42);
      const sequence1 = Array.from({ length: 20 }, () => rollDice(20));

      setSeed(42);
      const sequence2 = Array.from({ length: 20 }, () => rollDice(20));

      expect(sequence1).toEqual(sequence2);
    });

    test("produces the exact same sequence given the same string seed", () => {
      setSeed("the-dark-trench-2026");
      const sequence1 = Array.from({ length: 20 }, () => rollDice(6));

      setSeed("the-dark-trench-2026");
      const sequence2 = Array.from({ length: 20 }, () => rollDice(6));

      expect(sequence1).toEqual(sequence2);
    });

    test("resetPRNG without arguments resets back to current seed", () => {
      setSeed(999);
      const firstRoll = rollDice(100);
      const secondRoll = rollDice(100);

      resetPRNG();
      expect(rollDice(100)).toBe(firstRoll);
      expect(rollDice(100)).toBe(secondRoll);
    });

    test("different seeds produce different sequences", () => {
      setSeed(1001);
      const seq1 = Array.from({ length: 10 }, () => rollDice(20));

      setSeed(2002);
      const seq2 = Array.from({ length: 10 }, () => rollDice(20));

      expect(seq1).not.toEqual(seq2);
    });

    test("getSeed returns current seed", () => {
      setSeed("my-test-seed");
      expect(getSeed()).toBe("my-test-seed");
    });

    test("isolated createPRNG instances are independent", () => {
      const prngA = createPRNG(123);
      const prngB = createPRNG(123);

      expect(prngA.nextInt(1, 100)).toBe(prngB.nextInt(1, 100));
      expect(prngA.next()).toBe(prngB.next());
    });
  });
});
