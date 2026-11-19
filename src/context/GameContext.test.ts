import { describe, expect, test } from "vitest";
import { gameReducer, generateInitialState } from "./GameContext";
import { enemies } from "@/datasheets/enemies";
import { createPauseStep } from "@/datasheets/pause";

describe("GameContext reducer - lamp and fleeing mechanics", () => {
  test("initial state starts with 0 rooms lit", () => {
    const state = generateInitialState();
    expect(state.rooms).toBe(0);
  });

  test("active_step updates rooms when lamp is extinguished on flee", () => {
    const initialState = generateInitialState();
    const stateWithLamps = { ...initialState, rooms: 3 };

    const enemy = enemies[0]!;
    const newRooms = stateWithLamps.rooms - 1;
    const updatedState = gameReducer(stateWithLamps, {
      type: "active_step",
      payload: {
        activeStep: enemy,
        rooms: newRooms,
        messages: [{ id: "1", text: "Fled from combat. A lamp went out." }],
      },
    });

    expect(updatedState.rooms).toBe(2);
    expect(updatedState.messages).toContainEqual({
      id: "1",
      text: "Fled from combat. A lamp went out.",
    });
    // Player wounds should not be changed by active_step
    expect(updatedState.player.wounds).toBe(initialState.player.wounds);
  });

  test("fleeing with 0 lamps wounds player", () => {
    const initialState = generateInitialState();
    const stateWithZeroLamps = { ...initialState, rooms: 0 };
    const fleeDamage = 2;

    const woundedState = gameReducer(stateWithZeroLamps, {
      type: "player_wounded",
      payload: {
        wounds: stateWithZeroLamps.player.wounds - fleeDamage,
      },
    });

    expect(woundedState.player.wounds).toBe(initialState.player.wounds - fleeDamage);
  });

  test("fleeing with 0 lamps triggers game over if damage is lethal", () => {
    const initialState = generateInitialState();
    const lowHealthState = {
      ...initialState,
      rooms: 0,
      player: { ...initialState.player, wounds: 2 },
    };

    const gameOverState = gameReducer(lowHealthState, { type: "game_over" });
    expect(gameOverState.gameOver).toBe(true);
    expect(gameOverState.player.wounds).toBe(0);
  });

  test("active_step preserves rooms count if rooms payload is undefined", () => {
    const initialState = generateInitialState();
    const stateWithLamps = { ...initialState, rooms: 5 };

    const enemy = enemies[0]!;
    const updatedState = gameReducer(stateWithLamps, {
      type: "active_step",
      payload: {
        activeStep: enemy,
      },
    });

    expect(updatedState.rooms).toBe(5);
  });

  test("messages are capped at MAX_MESSAGES to prevent unbounded growth", () => {
    const initialState = generateInitialState();
    let state = initialState;

    for (let i = 0; i < 60; i++) {
      state = gameReducer(state, {
        type: "player_wounded",
        payload: {
          wounds: 10,
          messages: [{ id: String(i), text: `Message ${i}` }],
        },
      });
    }

    expect(state.messages.length).toBe(50);
    expect(state.messages[0]!.text).toBe("Message 10");
    expect(state.messages[49]!.text).toBe("Message 59");
  });

  describe("pause step and enemy count tracking", () => {
    test("initial state starts with enemiesDefeatedCount 0 and hasPaused false", () => {
      const state = generateInitialState();
      expect(state.enemiesDefeatedCount).toBe(0);
      expect(state.hasPaused).toBe(false);
    });

    test("active_step with pause step sets hasPaused to true", () => {
      const state = generateInitialState();
      const pauseStep = createPauseStep(0);
      const updated = gameReducer(state, {
        type: "active_step",
        payload: { activeStep: pauseStep },
      });
      expect(updated.hasPaused).toBe(true);
      expect(updated.activeStep).toEqual(pauseStep);
    });

    test("enemy_defeated increments enemiesDefeatedCount", () => {
      const state = {
        ...generateInitialState(),
        activeStep: enemies[0]!,
        enemiesDefeatedCount: 1,
      };
      const updated = gameReducer(state, {
        type: "enemy_defeated",
        payload: { wounds: 0 },
      });
      expect(updated.enemiesDefeatedCount).toBe(2);
      expect(updated.enemiesKilled).toBe(1);
    });

    test("first enemy encounter after pause step resets enemiesDefeatedCount and clears hasPaused", () => {
      const state = {
        ...generateInitialState(),
        hasPaused: true,
        enemiesDefeatedCount: 3,
      };
      const updated = gameReducer(state, {
        type: "active_step",
        payload: { activeStep: enemies[0]! },
      });
      expect(updated.enemiesDefeatedCount).toBe(0);
      expect(updated.hasPaused).toBe(false);
    });

    test("enemy encounter without prior pause step preserves enemiesDefeatedCount", () => {
      const state = {
        ...generateInitialState(),
        hasPaused: false,
        enemiesDefeatedCount: 2,
      };
      const updated = gameReducer(state, {
        type: "active_step",
        payload: { activeStep: enemies[0]! },
      });
      expect(updated.enemiesDefeatedCount).toBe(2);
      expect(updated.hasPaused).toBe(false);
    });
  });

  describe("seed management", () => {
    test("initial state has a seed assigned", () => {
      const state = generateInitialState();
      expect(state.seed).toBeDefined();
    });

    test("initial state accepts a custom seed", () => {
      const state = generateInitialState("custom-seed-42");
      expect(state.seed).toBe("custom-seed-42");
    });

    test("restart action preserves custom seed when provided", () => {
      const state = generateInitialState("old-seed");
      const restarted = gameReducer(state, {
        type: "restart",
        payload: { seed: "new-seed-100" },
      });
      expect(restarted.seed).toBe("new-seed-100");
    });
  });

  describe("fight_on_another_night", () => {
    test("sets night to 2, increases base toughness by 1, and raises HP to 20", () => {
      const state = { ...generateInitialState(), rooms: 13 };
      expect(state.night).toBe(1);
      expect(state.rooms).toBe(13);
      expect(state.player.toughness).toBe(3);
      expect(state.player.totalToughness).toBe(3);
      expect(state.player.totalWounds).toBe(15);

      const nextState = gameReducer(state, {
        type: "fight_on_another_night",
      });

      expect(nextState.night).toBe(2);
      expect(nextState.rooms).toBe(0);
      expect(nextState.player.totalToughness).toBe(4);
      expect(nextState.player.toughness).toBe(4);
      expect(nextState.player.totalWounds).toBe(20);
      expect(nextState.player.wounds).toBe(20);
      expect(nextState.messages.length).toBeGreaterThan(0);
      expect(nextState.messages[0]!.text).toContain("fight on for Night 2");
    });

    test("sets activeStep when payload contains activeStep", () => {
      const state = generateInitialState();
      const nextState = gameReducer(state, {
        type: "fight_on_another_night",
        payload: {
          activeStep: enemies[0]!,
        },
      });

      expect(nextState.activeStep).toEqual(enemies[0]);
      expect(nextState.activeStepUuid).toBeDefined();
      expect(nextState.steps).toBe(1);
    });

    test("resets lastStandUsedThisNight and replenishes pistol if player has munitions-crate perk", () => {
      const state = {
        ...generateInitialState(),
        lastStandUsedThisNight: true,
        perks: ["munitions-crate"],
        player: {
          ...generateInitialState().player,
          weapons: [{ ...generateInitialState().player.weapons[0]!, ammo: 2 }],
        },
      };

      const nextState = gameReducer(state, {
        type: "fight_on_another_night",
      });

      expect(nextState.lastStandUsedThisNight).toBe(false);
      const pistol = nextState.player.weapons.find((w) => w.id === "pistol");
      expect(pistol?.ammo).toBe(15);
    });
  });

  describe("perks reducer actions", () => {
    test("perk_select with ironclad increases toughness and totalToughness", () => {
      const state = generateInitialState();
      const nextState = gameReducer(state, {
        type: "perk_select",
        payload: { perkId: "ironclad" },
      });

      expect(nextState.perks).toContain("ironclad");
      expect(nextState.player.totalToughness).toBe(state.player.totalToughness + 1);
      expect(nextState.player.toughness).toBe(state.player.toughness + 1);
    });

    test("perk_select with sharpshooter increases hitModifier", () => {
      const state = generateInitialState();
      const nextState = gameReducer(state, {
        type: "perk_select",
        payload: { perkId: "sharpshooter" },
      });

      expect(nextState.perks).toContain("sharpshooter");
      expect(nextState.player.hitModifier).toBe(state.player.hitModifier + 1);
    });

    test("perk_select with munitions-crate grants +15 pistol ammo immediately", () => {
      const state = generateInitialState();
      const initialPistolAmmo = state.player.weapons.find((w) => w.id === "pistol")?.ammo ?? 20;
      const nextState = gameReducer(state, {
        type: "perk_select",
        payload: { perkId: "munitions-crate" },
      });

      expect(nextState.perks).toContain("munitions-crate");
      const pistol = nextState.player.weapons.find((w) => w.id === "pistol");
      expect(pistol?.ammo).toBe(initialPistolAmmo + 15);
    });

    test("weapon_ammo_add replenishes ammo up to weapon capacity", () => {
      const state = generateInitialState();
      // Deplete pistol ammo to 5
      const stateWithLowAmmo = {
        ...state,
        player: {
          ...state.player,
          weapons: state.player.weapons.map((w) =>
            w.id === "pistol" ? { ...w, ammo: 5 } : w,
          ),
        },
      };

      const replenishedState = gameReducer(stateWithLowAmmo, {
        type: "weapon_ammo_add",
        payload: { weaponId: "pistol", amount: 10 },
      });

      const pistol = replenishedState.player.weapons.find((w) => w.id === "pistol");
      expect(pistol?.ammo).toBe(15);

      // Capped at 20 max capacity
      const cappedState = gameReducer(replenishedState, {
        type: "weapon_ammo_add",
        payload: { weaponId: "pistol", amount: 10 },
      });
      const cappedPistol = cappedState.player.weapons.find((w) => w.id === "pistol");
      expect(cappedPistol?.ammo).toBe(20);
    });

    test("last_stand_used sets lastStandUsedThisNight and leaves player at 1 HP", () => {
      const state = {
        ...generateInitialState(),
        perks: ["last-stand"],
        lastStandUsedThisNight: false,
        player: { ...generateInitialState().player, wounds: 10 },
      };

      const nextState = gameReducer(state, {
        type: "last_stand_used",
      });

      expect(nextState.lastStandUsedThisNight).toBe(true);
      expect(nextState.player.wounds).toBe(1);
    });

    test("equipped_weapon_remove_ammo retains pistol in inventory with 0 ammo because it is replenishable", () => {
      const initial = generateInitialState();
      const pistolUuid = initial.player.weapons[0]!.uuid;
      const stateWith1Ammo = {
        ...initial,
        player: {
          ...initial.player,
          equippedWeapon: pistolUuid,
          weapons: [{ ...initial.player.weapons[0]!, ammo: 1 }],
        },
      };

      const nextState = gameReducer(stateWith1Ammo, {
        type: "equipped_weapon_remove_ammo",
      });

      const pistol = nextState.player.weapons.find((w) => w.uuid === pistolUuid);
      expect(pistol).toBeDefined();
      expect(pistol?.ammo).toBe(0);
    });

    test("equipped_weapon_remove_ammo retains shotgun in inventory with 0 ammo because it is replenishable", () => {
      const initial = generateInitialState();
      const shotgun = {
        _type: "gun" as const,
        damage: 6 as const,
        damageModifier: 3,
        name: "Shotgun",
        description: "PULL!",
        id: "shotgun" as const,
        notes: "",
        strength: 4,
        limited: true,
        ammo: 1,
        maxAmmo: 11,
        uuid: "test-shotgun-uuid",
      };
      const stateWithShotgun = {
        ...initial,
        player: {
          ...initial.player,
          equippedWeapon: "test-shotgun-uuid",
          weapons: [...initial.player.weapons, shotgun],
        },
      };

      const nextState = gameReducer(stateWithShotgun, {
        type: "equipped_weapon_remove_ammo",
      });

      const foundShotgun = nextState.player.weapons.find((w) => w.uuid === "test-shotgun-uuid");
      expect(foundShotgun).toBeDefined();
      expect(foundShotgun?.ammo).toBe(0);
    });

    test("equipped_weapon_remove_ammo removes non-replenishable weapons (like grenade) when ammo reaches 0", () => {
      const initial = generateInitialState();
      const grenade = {
        _type: "explosive" as const,
        damage: 6 as const,
        damageModifier: 4,
        name: "Grenade",
        description: "Duck and cover.",
        id: "grenade" as const,
        notes: "",
        strength: 5,
        limited: true,
        ammo: 1,
        maxAmmo: 1,
        uuid: "test-grenade-uuid",
      };
      const stateWithGrenade = {
        ...initial,
        player: {
          ...initial.player,
          equippedWeapon: "test-grenade-uuid",
          weapons: [...initial.player.weapons, grenade],
        },
      };

      const nextState = gameReducer(stateWithGrenade, {
        type: "equipped_weapon_remove_ammo",
      });

      const foundGrenade = nextState.player.weapons.find((w) => w.uuid === "test-grenade-uuid");
      expect(foundGrenade).toBeUndefined();
      expect(nextState.messages.some((m) => m.text.includes("Grenade was used and removed"))).toBe(true);
    });

    test("player_hit_modifier_remove restores hitModifier to totalHitModifier", () => {
      const initial = generateInitialState();
      const stateWithBuff = {
        ...initial,
        player: {
          ...initial.player,
          totalHitModifier: 1, // Sharpshooter perk
          hitModifier: 2, // Sharpshooter + Cigarettes
        },
      };

      const nextState = gameReducer(stateWithBuff, {
        type: "player_hit_modifier_remove",
      });

      expect(nextState.player.hitModifier).toBe(1);
    });
  });
});
