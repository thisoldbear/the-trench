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
});
