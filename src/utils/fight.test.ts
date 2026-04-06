import { enemies, type Enemy } from "@/datasheets/enemies";
import { player } from "@/datasheets/player";
import { expect, test, mock, describe, beforeEach } from "bun:test";

let rollQueue: number[] = [];
const mockRollDice = mock((sides: number) => rollQueue.shift() ?? 1);

mock.module("./rollDice", () => ({
  rollDice: mockRollDice,
}));

import { hitOn, fightLoop } from "./fight";

const expectedPlayerHitOn: Record<string, number> = {
  "Swarm of Rats": 3,
  "Zombie Soldier": 4,
  "Rabid Dog": 3,
  "Spectral Soldier": 4,
  "Possessed Soldier": 5,
  "Trench Tyrant": 5,
};

const expectedEnemyHitOn: Record<string, number> = {
  "Swarm of Rats": 5,
  "Zombie Soldier": 4,
  "Rabid Dog": 4,
  "Spectral Soldier": 4,
  "Possessed Soldier": 3,
  "Trench Tyrant": 3,
};

describe("hitOn", () => {
  enemies.forEach((enemy) => {
    test(`Player hit against ${enemy.name} for ${expectedPlayerHitOn[enemy.name]}+`, () => {
      const currentPlayer = { ...player };
      expect(hitOn(currentPlayer.weapons[0]?.strength, enemy.toughness)).toBe(
        expectedPlayerHitOn[enemy.name]!,
      );
    });

    test(`${enemy.name} hit against player for ${expectedEnemyHitOn[enemy.name]}+`, () => {
      const currentPlayer = { ...player };
      expect(hitOn(enemy.strength, currentPlayer.toughness)).toBe(
        expectedEnemyHitOn[enemy.name]!,
      );
    });
  });
});

// Test enemy: wounds 4, damage d3+0, toughness 2, strength 2
// Player (Pistol): wounds 15, damage d6+1, toughness 3, strength 3
// Player needs 3+ to hit (str 3 > tough 2)
// Enemy needs 5+ to hit (str 2 < tough 3)

const testEnemy = {
  _type: "enemy",
  attack: 1,
  damage: 3,
  damageModifier: 0,
  name: "Swarm of Rats",
  notes: "",
  strength: 2,
  toughness: 2,
  wounds: 4,
  totalWounds: 4,
} as Enemy;

describe("fightLoop", () => {
  let dispatch: ReturnType<typeof mock>;

  beforeEach(() => {
    dispatch = mock(() => {});
    mockRollDice.mockClear();
    rollQueue = [];
  });

  test("does nothing when player is already dead", () => {
    fightLoop({ ...player, wounds: 0 }, { ...testEnemy }, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("does nothing when enemy is already dead", () => {
    fightLoop({ ...player }, { ...testEnemy, wounds: 0 }, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("dispatches enemy_defeated when enemy is killed", () => {
    // Player rolls 6 (hit, needs 3+), damage 6 → 6+1=7 kills 4hp enemy
    rollQueue = [6, 6];
    fightLoop({ ...player }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_defeated");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(0);
  });

  test("dispatches enemy_wounded when enemy survives", () => {
    // Player rolls 3 (hit, needs 3+), damage 1 → 1+1=2, enemy at 2hp
    // Enemy rolls 1 (miss, needs 5+)
    rollQueue = [3, 1, 1];
    fightLoop({ ...player }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(2);
  });

  test("dispatches miss when player rolls too low", () => {
    // Player rolls 1 (miss, needs 3+), enemy rolls 1 (miss, needs 5+)
    rollQueue = [1, 1];
    fightLoop({ ...player }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(4); // unchanged
  });

  test("dispatches player_wounded when enemy hits", () => {
    // Player rolls 1 (miss), enemy rolls 5 (hit, needs 5+), damage 3 → 3+0=3
    rollQueue = [1, 5, 3];
    fightLoop({ ...player }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[1]![0]!.type).toBe("player_wounded");
    expect(dispatch.mock.calls[1]![0]!.payload.wounds).toBe(12); // 15-3
  });

  test("dispatches game_over when player is killed", () => {
    // Player rolls 1 (miss), enemy rolls 5 (hit, needs 5+), damage 3 → 3+0=3
    rollQueue = [1, 5, 3];
    fightLoop({ ...player, wounds: 1 }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[1]![0]!.type).toBe("game_over");
  });

  test("enemy miss leaves player wounds unchanged", () => {
    // Player rolls 1 (miss, needs 3+), enemy rolls 4 (miss, needs 5+)
    rollQueue = [1, 4];
    fightLoop({ ...player }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[1]![0]!.type).toBe("player_wounded");
    expect(dispatch.mock.calls[1]![0]!.payload.wounds).toBe(15); // unchanged
  });
});
