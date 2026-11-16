import { expect, test, vi, describe, beforeEach } from "vitest";
import { rollDice } from "@/utils/rollDice";
import { useGame } from "@/context/GameContext";
import { generateInitialState } from "@/context/GameContext";
import { useAdvanceStep } from "./useAdvanceStep";
import { rooms } from "@/datasheets/rooms";
import { enemies } from "@/datasheets/enemies";
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
            text: "You rolled 4. Entered: Dark Trench",
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
              text: "You rolled 1. Entered: Chapel",
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
            text: "You rolled 15 then 14. Encountered: Zombie Soldier",
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
            text: "You rolled 9 then 2. Found: Medic Bag",
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
              text: "You rolled 19 then 10. Trap: Barbed Wire",
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
            text: "You rolled 6. Entered: Dark Trench",
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
              text: "You rolled 4. Entered: Dark Trench",
            }),
          ],
        },
      });
    });
  });
});
