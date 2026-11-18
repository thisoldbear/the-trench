import { expect, test, vi, describe, beforeEach } from "vitest";
import { rollDice } from "@/utils/rollDice";
import { useGame } from "@/context/GameContext";
import { generateInitialState } from "@/context/GameContext";
import { useAdvanceStep } from "./useAdvanceStep";
import { rooms } from "@/datasheets/rooms";
import { enemies, enemiesNight2 } from "@/datasheets/enemies";
import { chests } from "@/datasheets/chests";
import { traps } from "@/datasheets/traps";
import { createMessage } from "@/utils/messages";

vi.mock("@/utils/rollDice");
vi.mock("@/context/GameContext", async () => {
  const actual = await vi.importActual<typeof import("@/context/GameContext")>(
    "@/context/GameContext",
  );
  return {
    ...actual,
    useGame: vi.fn(),
  };
});

describe("useAdvanceStep", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let rollQueue: number[] = [];

  beforeEach(() => {
    dispatch = vi.fn();
    vi.mocked(useGame).mockReturnValue({
      state: generateInitialState(),
      dispatch,
    });
    vi.mocked(rollDice).mockImplementation(() => rollQueue.shift() ?? 1);
    vi.mocked(rollDice).mockClear();
    rollQueue = [];
  });

  test("captures dice roll in message when entering Dark Trench", () => {
    rollQueue = [4];
    const advanceStep = useAdvanceStep();
    advanceStep();

    expect(dispatch).toHaveBeenCalledWith({
      type: "active_step",
      payload: {
        activeStep: rooms[0],
        messages: [
          expect.objectContaining({
            text: "You rolled 4 on Table I (Exploration). Entered: Dark Trench",
          }),
        ],
      },
    });
  });

  test("captures dice roll in message when entering Chapel", () => {
    rollQueue = [1];
    const advanceStep = useAdvanceStep();
    advanceStep();

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "active_step",
        payload: expect.objectContaining({
          activeStep: rooms[1],
          messages: [
            expect.objectContaining({
              text: "You rolled 1 on Table I (Exploration). Entered: Chapel",
            }),
          ],
        }),
      }),
    );
  });

  test("captures both dice rolls in message when encountering Enemy", () => {
    rollQueue = [15, 14];
    const advanceStep = useAdvanceStep();
    advanceStep();

    expect(dispatch).toHaveBeenCalledWith({
      type: "active_step",
      payload: {
        activeStep: enemies[0],
        messages: [
          expect.objectContaining({
            text: "You rolled 15 on Table I (Exploration) then 14 on Table III A (Monsters). Encountered: Zombie Soldier",
          }),
        ],
      },
    });
  });

  test("captures both dice rolls in message when finding Chest", () => {
    rollQueue = [9, 2];
    const advanceStep = useAdvanceStep();
    advanceStep();

    expect(dispatch).toHaveBeenCalledWith({
      type: "active_step",
      payload: {
        activeStep: chests[0],
        messages: [
          expect.objectContaining({
            text: "You rolled 9 on Table I (Exploration) then 2 on Table II A (Booty). Found: Medic Bag",
          }),
        ],
      },
    });
  });

  test("captures both dice rolls in message when triggering Trap", () => {
    // 19, 10 for trap selection, then trap damage roll
    rollQueue = [19, 10, 1];
    const advanceStep = useAdvanceStep();
    advanceStep();

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "active_step",
        payload: expect.objectContaining({
          activeStep: traps[0],
          messages: [
            expect.objectContaining({
              text: "You rolled 19 on Table I (Exploration) then 10 on Table IV (Traps). Trap: Barbed Wire",
            }),
          ],
        }),
      }),
    );
  });

  test("preserves existing opts messages and appends encounter roll message", () => {
    rollQueue = [6];
    const advanceStep = useAdvanceStep();
    advanceStep({
      messages: [createMessage("Some previous message")],
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: "active_step",
      payload: {
        activeStep: rooms[0],
        messages: [
          expect.objectContaining({ text: "Some previous message" }),
          expect.objectContaining({
            text: "You rolled 6 on Table I (Exploration). Entered: Dark Trench",
          }),
        ],
      },
    });
  });

  describe("pause step behavior", () => {
    test("triggers a pause step after lighting a lamp and preserves lamp message without dice roll", () => {
      const advanceStep = useAdvanceStep();
      advanceStep({
        rooms: 1,
        messages: [createMessage("Lit the lamp")],
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: "active_step",
        payload: {
          activeStep: expect.objectContaining({
            _type: "pause",
            name: "A moment of respite",
          }),
          rooms: 1,
          messages: [
            expect.objectContaining({ text: "Lit the lamp" }),
          ],
        },
      });
      // Should not have rolled on decision table
      expect(rollDice).not.toHaveBeenCalled();
    });

    test("triggers a pause step after 3 enemies have been defeated", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          enemiesDefeatedCount: 3,
          hasPaused: false,
        },
        dispatch,
      });

      vi.mocked(rollDice).mockClear();
      const advanceStep = useAdvanceStep();
      advanceStep();

      expect(dispatch).toHaveBeenCalledWith({
        type: "active_step",
        payload: {
          activeStep: expect.objectContaining({
            _type: "pause",
            name: "A moment of respite",
          }),
          messages: [],
        },
      });
      expect(rollDice).not.toHaveBeenCalled();
    });

    test("never triggers a pause step when advancing from a pause step", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          activeStep: {
            _type: "pause",
            name: "A moment of respite",
            description: "Some respite sentence",
          },
          enemiesDefeatedCount: 3,
          hasPaused: true,
        },
        dispatch,
      });

      rollQueue = [4];
      const advanceStep = useAdvanceStep();
      advanceStep();

      expect(dispatch).toHaveBeenCalledWith({
        type: "active_step",
        payload: {
          activeStep: rooms[0],
          messages: [
            expect.objectContaining({
              text: "You rolled 4 on Table I (Exploration). Entered: Dark Trench",
            }),
          ],
        },
      });
    });
  });

  describe("Night 2 Advance", () => {
    test("dispatches fight_on_another_night with Night 2 enemy when night: 2 is provided", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 13,
          night: 1,
        },
        dispatch,
      });

      rollQueue = [14, 1]; // 14 (enemy), 1 (Gas Ghoul on Night 2)
      const advanceStep = useAdvanceStep();
      advanceStep({ night: 2 });

      expect(dispatch).toHaveBeenCalledWith({
        type: "fight_on_another_night",
        payload: {
          activeStep: enemiesNight2[0],
          messages: [
            expect.objectContaining({
              text: "You rolled 14 on Table I (Exploration) then 1 on Table III B (Monsters). Encountered: Gas Ghoul",
            }),
          ],
        },
      });
    });

    test("deals +1 trap damage during Night 2 and includes hazard notice", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 15,
          night: 2,
          player: {
            ...generateInitialState().player,
            wounds: 20,
            totalWounds: 20,
          },
        },
        dispatch,
      });

      rollQueue = [19, 10, 2]; // 19 (trap), 10 (traps[0] Barbed Wire damage 2), rollDice(2) = 2
      // In Night 2, trap damage = base (2) + 1 = 3 damage!
      const advanceStep = useAdvanceStep();
      advanceStep();

      expect(dispatch).toHaveBeenCalledWith({
        type: "player_wounded",
        payload: {
          wounds: 17, // 20 - 3
          messages: [
            expect.objectContaining({
              text: expect.stringContaining("Night II hazard"),
            }),
          ],
        },
      });
    });

    test("deals +2 trap damage during Night 4", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 5,
          night: 4,
          player: {
            ...generateInitialState().player,
            wounds: 20,
            totalWounds: 20,
          },
        },
        dispatch,
      });

      rollQueue = [19, 10, 2]; // 19 (trap), 10 (traps[0] Barbed Wire damage 2), rollDice(2) = 2
      // In Night 4, trap damage = base (2) + 2 = 4 damage!
      const advanceStep = useAdvanceStep();
      advanceStep();

      expect(dispatch).toHaveBeenCalledWith({
        type: "player_wounded",
        payload: {
          wounds: 16, // 20 - 4
          messages: [
            expect.objectContaining({
              text: expect.stringContaining("Night IV hazard"),
            }),
          ],
        },
      });
    });

    test("reduces trap damage by 1 when player has trench-armor perk", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 5,
          night: 4,
          perks: ["trench-armor"],
          player: {
            ...generateInitialState().player,
            wounds: 20,
            totalWounds: 20,
          },
        },
        dispatch,
      });

      rollQueue = [19, 10, 2]; // 19 (trap), 10 (traps[0] damage 2), rollDice(2) = 2
      // In Night 4 with trench-armor: base (2) + 2 - 1 = 3 damage!
      const advanceStep = useAdvanceStep();
      advanceStep();

      expect(dispatch).toHaveBeenCalledWith({
        type: "player_wounded",
        payload: {
          wounds: 17, // 20 - 3
          messages: [
            expect.objectContaining({
              text: expect.stringContaining("Trench Armor reduced damage"),
            }),
          ],
        },
      });
    });

    test("heals 1d3 wounds at Chapel in Night 5 instead of full heal", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 5,
          night: 5,
          player: {
            ...generateInitialState().player,
            wounds: 5,
            totalWounds: 20,
          },
        },
        dispatch,
      });

      rollQueue = [1, 2]; // 1 (Chapel), 2 (1d3 heal = 2)
      const advanceStep = useAdvanceStep();
      advanceStep();

      expect(dispatch).toHaveBeenCalledWith({
        type: "player_restored",
        payload: {
          wounds: 7, // 5 + 2
          messages: [
            expect.objectContaining({
              text: expect.stringContaining("diminished sanctuary"),
            }),
          ],
        },
      });
    });

    test("triggers last_stand_used when trap damage is lethal and player has last-stand perk", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 0,
          night: 1,
          perks: ["last-stand"],
          lastStandUsedThisNight: false,
          player: {
            ...generateInitialState().player,
            wounds: 1,
          },
        },
        dispatch,
      });

      rollQueue = [19, 10, 2]; // 19 (trap), 10 (traps[0] Barbed Wire), rollDice(2) = 2 (lethal)
      const advanceStep = useAdvanceStep();
      advanceStep();

      const actionTypes = dispatch.mock.calls.map((c) => c[0]!.type);
      expect(actionTypes).toContain("last_stand_used");
      expect(actionTypes).not.toContain("game_over");
    });

    test("respects opts.playerWounds when advancing into a trap after taking flee damage", () => {
      vi.mocked(useGame).mockReturnValue({
        state: {
          ...generateInitialState(),
          rooms: 0,
          night: 1,
          player: {
            ...generateInitialState().player,
            wounds: 10, // Stale state in React hook closure
          },
        },
        dispatch,
      });

      // Advance into a trap dealing 2 damage, with playerWounds: 8 (reflecting recent flee damage)
      rollQueue = [19, 10, 2];
      const advanceStep = useAdvanceStep();
      advanceStep({ rooms: 0, playerWounds: 8 });

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "player_wounded",
          payload: expect.objectContaining({
            wounds: 6, // 8 - 2 = 6, NOT 10 - 2 = 8
          }),
        }),
      );
    });
  });
});
