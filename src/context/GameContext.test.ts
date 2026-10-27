import { describe, expect, test } from "vitest";
import { gameReducer, generateInitialState } from "./GameContext";
import { enemies } from "@/datasheets/enemies";

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
});
