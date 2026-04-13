import { chests } from "@/datasheets/chests";
import { enemies } from "@/datasheets/enemies";
import { rooms } from "@/datasheets/rooms";
import { traps } from "@/datasheets/traps";
import { expect, test, mock, describe, beforeEach } from "bun:test";

let rollQueue: number[] = [];
const mockRollDice = mock((sides: number) => rollQueue.shift() ?? 1);

mock.module("./rollDice", () => ({
  rollDice: mockRollDice,
}));

import { rollOnDecisionTable } from "./resolveDice";

describe("rollOnDecisionTable", () => {
  beforeEach(() => {
    mockRollDice.mockClear();
    rollQueue = [];
  });

  describe("Chapel (firstDice ≤ 2)", () => {
    test("returns Chapel when firstDice is 1", () => {
      rollQueue = [1];
      const result = rollOnDecisionTable();
      expect(result).toEqual(rooms[1]);
    });

    test("returns Chapel when firstDice is 2", () => {
      rollQueue = [2];
      const result = rollOnDecisionTable();
      expect(result).toEqual(rooms[1]);
    });
  });

  describe("Trench (firstDice 3-8)", () => {
    test("returns Dark Trench when firstDice is 3", () => {
      rollQueue = [3];
      const result = rollOnDecisionTable();
      expect(result).toEqual(rooms[0]);
    });

    test("returns Dark Trench when firstDice is 8", () => {
      rollQueue = [8];
      const result = rollOnDecisionTable();
      expect(result).toEqual(rooms[0]);
    });
  });

  describe("Booty (firstDice 9-12)", () => {
    test("returns Medic Bag when firstDice is 9 and secondDice is 1", () => {
      rollQueue = [9, 1];
      const result = rollOnDecisionTable();
      expect(result).toEqual(chests[0]);
    });

    test("returns Medic Bag when firstDice is 12 and secondDice is 10", () => {
      rollQueue = [12, 10];
      const result = rollOnDecisionTable();
      expect(result).toEqual(chests[0]);
    });

    test("returns Corpse when firstDice is 10 and secondDice is 11", () => {
      rollQueue = [10, 11];
      const result = rollOnDecisionTable();
      expect(result).toEqual(chests[1]);
    });

    test("returns Corpse when firstDice is 12 and secondDice is 20", () => {
      rollQueue = [12, 20];
      const result = rollOnDecisionTable();
      expect(result).toEqual(chests[1]);
    });
  });

  describe("Enemies (firstDice 13-18)", () => {
    test("returns Zombie Soldier when secondDice is 1", () => {
      rollQueue = [13, 1];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[0]);
    });

    test("returns Zombie Soldier when secondDice is 14", () => {
      rollQueue = [15, 14];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[0]);
    });

    test("returns Swarm of Rats when secondDice is 15", () => {
      rollQueue = [16, 15];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[1]);
    });

    test("returns Rabid Dog when secondDice is 16", () => {
      rollQueue = [17, 16];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[2]);
    });

    test("returns Possessed Soldier when secondDice is 17", () => {
      rollQueue = [18, 17];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[3]);
    });

    test("returns Possessed Soldier when secondDice is 19", () => {
      rollQueue = [13, 19];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[3]);
    });

    test("returns Trench Tyrant when secondDice is 20", () => {
      rollQueue = [14, 20];
      const result = rollOnDecisionTable();
      expect(result).toEqual(enemies[4]);
    });
  });

  describe("Trap (firstDice = 19)", () => {
    test("returns Barbed Wire trap when firstDice is 19", () => {
      rollQueue = [19];
      const result = rollOnDecisionTable();
      expect(result).toEqual(traps[0]);
    });
  });

  describe("Edge cases", () => {
    test("returns Dark Trench when firstDice is 20", () => {
      rollQueue = [20];
      const result = rollOnDecisionTable();
      expect(result).toEqual(rooms[0]);
    });
  });
});
