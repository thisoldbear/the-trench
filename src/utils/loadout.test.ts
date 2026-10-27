import { equipment } from "@/datasheets/equipment";
import { weapons } from "@/datasheets/weapons";
import { expect, test, vi, describe, beforeEach } from "vitest";
import { rollDice } from "./rollDice";

vi.mock("./rollDice");

let rollQueue: number[] = [];

import { weaponsLoadout, equipmentLoadout } from "./loadout";

describe("weaponsLoadout", () => {
  beforeEach(() => {
    vi.mocked(rollDice).mockImplementation(() => rollQueue.shift() ?? 1);
    vi.mocked(rollDice).mockClear();
    rollQueue = [];
  });

  test("always includes Pistol as first weapon with UUID", () => {
    rollQueue = [3];
    const result = weaponsLoadout();

    expect(result[0]!.id).toBe("pistol");
    expect(result[0]!.uuid).toBeDefined();
    expect(result[0]!.uuid).not.toBe("");
  });

  test("includes second weapon based on dice roll", () => {
    rollQueue = [1]; // (1-1) % 7 = 0 → weapons[1] (Knife)
    const result = weaponsLoadout();

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("pistol");
    expect(result[1]!.id).toBe("knife");
  });

  test("selects Sword when dice roll is 2", () => {
    rollQueue = [2]; // (2-1) % 7 = 1 → weapons[2] (Sword)
    const result = weaponsLoadout();

    expect(result).toHaveLength(2);
    expect(result[1]!.id).toBe("sword");
  });

  test("selects Rifle when dice roll is 3", () => {
    rollQueue = [3]; // (3-1) % 7 = 2 → weapons[3] (Rifle)
    const result = weaponsLoadout();

    expect(result).toHaveLength(2);
    expect(result[1]!.id).toBe("rifle");
  });

  test("wraps around with modulo when dice roll is 6", () => {
    rollQueue = [6]; // (6-1) % 7 = 5 → weapons[6] (Flare Gun)
    const result = weaponsLoadout();

    expect(result).toHaveLength(2);
    expect(result[1]!.id).toBe("flare-gun");
  });

  test("each weapon has a unique UUID", () => {
    rollQueue = [2];
    const result = weaponsLoadout();

    expect(result[0]!.uuid).toBeDefined();
    expect(result[1]!.uuid).toBeDefined();
    expect(result[0]!.uuid).not.toBe(result[1]!.uuid);
  });

  test("weapons maintain all properties from datasheet", () => {
    rollQueue = [1];
    const result = weaponsLoadout();

    // Check first weapon properties
    expect(result[0]!.name).toBe(weapons[0]!.name);
    expect(result[0]!.damage).toBe(weapons[0]!.damage);
    expect(result[0]!.strength).toBe(weapons[0]!.strength);
    expect(result[0]!.limited).toBe(weapons[0]!.limited);
    expect(result[0]!.ammo).toBe(weapons[0]!.ammo);

    // Check second weapon properties
    expect(result[1]!.name).toBe(weapons[1]!.name);
    expect(result[1]!.damage).toBe(weapons[1]!.damage);
  });
});

describe("equipmentLoadout", () => {
  test("returns Bandage with UUID", () => {
    const result = equipmentLoadout();

    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("bandage");
    expect(result[0]!.uuid).toBeDefined();
    expect(result[0]!.uuid).not.toBe("");
  });

  test("maintains all equipment properties", () => {
    const result = equipmentLoadout();

    expect(result[0]!.name).toBe(equipment[0]!.name);
    expect(result[0]!.description).toBe(equipment[0]!.description);
    expect(result[0]!._type).toBe(equipment[0]!._type);
  });

  test("generates unique UUID on each call", () => {
    const result1 = equipmentLoadout();
    const result2 = equipmentLoadout();

    expect(result1[0]!.uuid).not.toBe(result2[0]!.uuid);
  });
});
