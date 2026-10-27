import { enemies, type Enemy } from "@/datasheets/enemies";
import { player } from "@/datasheets/player";
import { weapons } from "@/datasheets/weapons";
import { expect, test, vi, describe, beforeEach } from "vitest";
import { rollDice } from "./rollDice";

vi.mock("./rollDice");

let rollQueue: number[] = [];

import { hitOn, fightLoop, resolveWeaponAmmo } from "./fight";

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
      expect(hitOn(currentPlayer.weapons[0]?.strength!, enemy.toughness)).toBe(
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

// Test enemy (Swarm of Rats): wounds 4, damage d3+0, toughness 2, strength 2
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

describe("resolveWeaponAmmo", () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
  });

  test("dispatches equipped_weapon_remove_ammo for limited weapons", () => {
    resolveWeaponAmmo({ ...weapons[0] }, dispatch);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]![0]!.type).toBe(
      "equipped_weapon_remove_ammo",
    );
  });

  test("does not dispatch for non-limited weapons", () => {
    resolveWeaponAmmo({ ...weapons[1] }, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("fightLoop", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let testPlayer: typeof player;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.mocked(rollDice).mockImplementation(() => rollQueue.shift() ?? 1);
    vi.mocked(rollDice).mockClear();
    rollQueue = [];
    // Set up player with equipped weapon
    testPlayer = {
      ...player,
      weapons: [
        { ...player.weapons[0]!, uuid: "test-pistol-uuid" },
        { ...player.weapons[1]!, uuid: "test-knife-uuid" },
      ],
      equippedWeapon: "test-pistol-uuid",
    };
  });

  test("does nothing when player is already dead", () => {
    fightLoop({ ...testPlayer, wounds: 0 }, { ...testEnemy }, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("does nothing when enemy is already dead", () => {
    fightLoop({ ...testPlayer }, { ...testEnemy, wounds: 0 }, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("does nothing when no weapon is equipped", () => {
    fightLoop({ ...testPlayer, equippedWeapon: null }, { ...testEnemy }, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("dispatches enemy_defeated and removes ammo when enemy is killed", () => {
    // Player rolls 6 (hit, needs 3+), damage 6 → 6+1=7 kills 4hp enemy
    rollQueue = [6, 6];
    fightLoop({ ...testPlayer }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_defeated");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(0);
    expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
    expect(dispatch.mock.calls[1]![0]!.type).toBe(
      "equipped_weapon_remove_ammo",
    );
  });

  test("dispatches enemy_wounded, removes ammo, then player_wounded on enemy miss", () => {
    // Player rolls 3 (hit, needs 3+), damage 1 → 1+0=1, enemy at 3hp
    // Enemy rolls 1 (miss, needs 5+)
    rollQueue = [3, 1, 1];
    fightLoop({ ...testPlayer }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(3);
    expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
    expect(dispatch.mock.calls[1]![0]!.type).toBe(
      "equipped_weapon_remove_ammo",
    );
    expect(dispatch.mock.calls[2]![0]!.type).toBe("player_wounded");
    expect(dispatch.mock.calls[2]![0]!.payload.wounds).toBe(15);
    expect(dispatch.mock.calls[2]![0]!.payload.messages).toHaveLength(1);
  });

  test("dispatches miss with unchanged enemy wounds when player misses", () => {
    // Player rolls 1 (miss, needs 3+), enemy rolls 1 (miss, needs 5+)
    rollQueue = [1, 1];
    fightLoop({ ...testPlayer }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(4);
    expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
    expect(dispatch.mock.calls[1]![0]!.type).toBe(
      "equipped_weapon_remove_ammo",
    );
    expect(dispatch.mock.calls[2]![0]!.type).toBe("player_wounded");
    expect(dispatch.mock.calls[2]![0]!.payload.wounds).toBe(15);
  });

  test("dispatches player_wounded with damage when enemy hits", () => {
    // Player rolls 1 (miss, needs 3+)
    // Enemy rolls 5 (hit, needs 5+), damage 2 → 2+0=2, player at 13hp
    rollQueue = [1, 5, 2];
    fightLoop({ ...testPlayer }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[2]![0]!.type).toBe("player_wounded");
    expect(dispatch.mock.calls[2]![0]!.payload.wounds).toBe(13);
    expect(dispatch.mock.calls[2]![0]!.payload.messages).toHaveLength(2);
  });

  test("dispatches game_over when player is killed", () => {
    // Player rolls 1 (miss, needs 3+)
    // Enemy rolls 6 (hit, needs 5+), damage 3 → 3+0=3
    // Player has 2 wounds → 2-3=-1 ≤ 0 → game over
    rollQueue = [1, 6, 3];
    fightLoop({ ...testPlayer, wounds: 2 }, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[1]![0]!.type).toBe(
      "equipped_weapon_remove_ammo",
    );
    expect(dispatch.mock.calls[2]![0]!.type).toBe("game_over");
  });

  test("skips ammo removal with non-limited weapon", () => {
    const playerWithKnife = {
      ...testPlayer,
      equippedWeapon: "test-knife-uuid",
    };
    // Player rolls 3 (hit, needs 3+), damage 1 → 1+0=1, enemy at 3hp
    // Enemy rolls 1 (miss, needs 5+)
    rollQueue = [3, 1, 1];
    fightLoop(playerWithKnife, { ...testEnemy }, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("enemy_wounded");
    expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(3);
    expect(dispatch.mock.calls[1]![0]!.type).toBe("player_wounded");
  });
});
