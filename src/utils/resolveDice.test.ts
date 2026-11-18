import { chests } from "@/datasheets/chests";
import { enemies, enemiesNight2, enemiesNight3 } from "@/datasheets/enemies";
import { rooms } from "@/datasheets/rooms";
import { traps } from "@/datasheets/traps";
import { expect, test, vi, describe, beforeEach } from "vitest";
import { rollDice } from "./rollDice";

vi.mock("./rollDice");

let rollQueue: number[] = [];

import { rollOnDecisionTable, resolveDecisionTable } from "./resolveDice";

describe("rollOnDecisionTable", () => {
  beforeEach(() => {
    vi.mocked(rollDice).mockImplementation(() => rollQueue.shift() ?? 1);
    vi.mocked(rollDice).mockClear();
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
    test("returns Barbed Wire trap when secondDice is <= 10", () => {
      rollQueue = [19, 10];
      const result = rollOnDecisionTable();
      expect(result).toEqual(traps[0]);
    });

    test("returns Collapsed Wall trap when secondDice is 11-15", () => {
      rollQueue = [19, 15];
      const result = rollOnDecisionTable();
      expect(result).toEqual(traps[1]);
    });

    test("returns Gas Cloud trap when secondDice is 16-18", () => {
      rollQueue = [19, 18];
      const result = rollOnDecisionTable();
      expect(result).toEqual(traps[2]);
    });

    test("returns Unexploded Bomb trap when secondDice is 19-20", () => {
      rollQueue = [19, 20];
      const result = rollOnDecisionTable();
      expect(result).toEqual(traps[3]);
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

describe("resolveDecisionTable", () => {
  beforeEach(() => {
    vi.mocked(rollDice).mockImplementation(() => rollQueue.shift() ?? 1);
    vi.mocked(rollDice).mockClear();
    rollQueue = [];
  });

  test("returns Chapel with single roll when firstDice is 1", () => {
    rollQueue = [1];
    const result = resolveDecisionTable();
    expect(result).toEqual({
      step: rooms[1],
      rolls: [1],
      tables: ["Table I (Exploration)"],
    });
  });

  test("returns Dark Trench with single roll when firstDice is 5", () => {
    rollQueue = [5];
    const result = resolveDecisionTable();
    expect(result).toEqual({
      step: rooms[0],
      rolls: [5],
      tables: ["Table I (Exploration)"],
    });
  });

  test("returns Booty with two rolls when firstDice is 9 and secondDice is 2", () => {
    rollQueue = [9, 2];
    const result = resolveDecisionTable();
    expect(result).toEqual({
      step: chests[0],
      rolls: [9, 2],
      tables: ["Table I (Exploration)", "Table II A (Booty)"],
    });
  });

  test("returns Enemy with two rolls when firstDice is 15 and secondDice is 14", () => {
    rollQueue = [15, 14];
    const result = resolveDecisionTable();
    expect(result).toEqual({
      step: enemies[0],
      rolls: [15, 14],
      tables: ["Table I (Exploration)", "Table III A (Monsters)"],
    });
  });

  test("returns Trap with two rolls when firstDice is 19 and secondDice is 10", () => {
    rollQueue = [19, 10];
    const result = resolveDecisionTable();
    expect(result).toEqual({
      step: traps[0],
      rolls: [19, 10],
      tables: ["Table I (Exploration)", "Table IV (Traps)"],
    });
  });

  test("returns Dark Trench with single roll when firstDice is 20", () => {
    rollQueue = [20];
    const result = resolveDecisionTable();
    expect(result).toEqual({
      step: rooms[0],
      rolls: [20],
      tables: ["Table I (Exploration)"],
    });
  });

  describe("Night 2 Enemies Table (night === 2 or rooms >= 13)", () => {
    test("returns Gas Ghoul when secondDice is 1–14", () => {
      rollQueue = [14, 1];
      const result = resolveDecisionTable({ night: 2 });
      expect(result).toEqual({
        step: enemiesNight2[0],
        rolls: [14, 1],
        tables: ["Table I (Exploration)", "Table III B (Monsters)"],
      });
    });

    test("returns War Hound when secondDice is 15", () => {
      rollQueue = [14, 15];
      const result = resolveDecisionTable({ night: 2 });
      expect(result).toEqual({
        step: enemiesNight2[1],
        rolls: [14, 15],
        tables: ["Table I (Exploration)", "Table III B (Monsters)"],
      });
    });

    test("returns Corrupted Stormtrooper when secondDice is 16", () => {
      rollQueue = [14, 16];
      const result = resolveDecisionTable({ rooms: 14 });
      expect(result).toEqual({
        step: enemiesNight2[2],
        rolls: [14, 16],
        tables: ["Table I (Exploration)", "Table III B (Monsters)"],
      });
    });

    test("returns Possessed Officer when secondDice is 17-19", () => {
      rollQueue = [14, 18];
      const result = resolveDecisionTable(15);
      expect(result).toEqual({
        step: enemiesNight2[3],
        rolls: [14, 18],
        tables: ["Table I (Exploration)", "Table III B (Monsters)"],
      });
    });

    test("returns Golgotha Behemoth when secondDice is 20", () => {
      rollQueue = [14, 20];
      const result = resolveDecisionTable({ night: 2, rooms: 16 });
      expect(result).toEqual({
        step: enemiesNight2[4],
        rolls: [14, 20],
        tables: ["Table I (Exploration)", "Table III B (Monsters)"],
      });
    });
  });

  describe("Night 4 & 5 Enemies Table (night >= 4)", () => {
    test("returns Ironclad Abomination when secondDice is 1–14", () => {
      rollQueue = [14, 1];
      const result = resolveDecisionTable({ night: 4 });
      expect(result).toEqual({
        step: enemiesNight3[0],
        rolls: [14, 1],
        tables: ["Table I (Exploration)", "Table III C (Monsters)"],
      });
    });

    test("returns Dreadstalker Hound when secondDice is 15", () => {
      rollQueue = [14, 15];
      const result = resolveDecisionTable({ night: 4 });
      expect(result).toEqual({
        step: enemiesNight3[1],
        rolls: [14, 15],
        tables: ["Table I (Exploration)", "Table III C (Monsters)"],
      });
    });

    test("returns Flamethrower Fiend when secondDice is 16", () => {
      rollQueue = [14, 16];
      const result = resolveDecisionTable({ night: 5 });
      expect(result).toEqual({
        step: enemiesNight3[2],
        rolls: [14, 16],
        tables: ["Table I (Exploration)", "Table III C (Monsters)"],
      });
    });

    test("returns Trench Archon when secondDice is 17-19", () => {
      rollQueue = [14, 18];
      const result = resolveDecisionTable({ night: 5 });
      expect(result).toEqual({
        step: enemiesNight3[3],
        rolls: [14, 18],
        tables: ["Table I (Exploration)", "Table III C (Monsters)"],
      });
    });

    test("returns The Trench Sovereign when secondDice is 20", () => {
      rollQueue = [14, 20];
      const result = resolveDecisionTable({ night: 5 });
      expect(result).toEqual({
        step: enemiesNight3[4],
        rolls: [14, 20],
        tables: ["Table I (Exploration)", "Table III C (Monsters)"],
      });
    });
  });
});
