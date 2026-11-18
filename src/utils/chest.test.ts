import { chests } from "@/datasheets/chests";
import { equipment } from "@/datasheets/equipment";
import { weapons } from "@/datasheets/weapons";
import { expect, test, vi, describe, beforeEach } from "vitest";
import { rollDice } from "./rollDice";

vi.mock("./rollDice");

let rollQueue: number[] = [];

import type { GameAction } from "@/context/GameContext";
import { rollOnChestTable } from "./chest";

describe("rollOnChestTable", () => {
  let dispatch: ReturnType<typeof vi.fn<(action: GameAction) => void>>;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.mocked(rollDice).mockImplementation(() => rollQueue.shift() ?? 1);
    vi.mocked(rollDice).mockClear();
    rollQueue = [];
  });

  describe("Trap (all chests)", () => {
    test("dispatches player_wounded with subtracted wounds and returns empty array when roll is 1", () => {
      rollQueue = [1, 2];
      const result = rollOnChestTable({ ...chests[0] }, dispatch, { wounds: 14 });

      expect(result).toEqual([]);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_wounded");
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(12);
      expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "trap",
      );
    });

    test("dispatches player_wounded with 0 wounds and game_over when trap damage is fatal", () => {
      rollQueue = [1, 3];
      const result = rollOnChestTable({ ...chests[0] }, dispatch, { wounds: 2 });

      expect(result).toEqual([]);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_wounded");
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(0);
      expect(dispatch.mock.calls[1]![0]!.type).toBe("game_over");
    });
  });

  describe("Medic Bag", () => {
    test("returns Bandage when roll is 2", () => {
      rollQueue = [2];
      const result = rollOnChestTable({ ...chests[0] }, dispatch);

      expect(result).toEqual([equipment[0]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Bandage when roll is 14", () => {
      rollQueue = [14];
      const result = rollOnChestTable({ ...chests[0] }, dispatch);

      expect(result).toEqual([equipment[0]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Morphine when roll is 15", () => {
      rollQueue = [15];
      const result = rollOnChestTable({ ...chests[0] }, dispatch);

      expect(result).toEqual([equipment[1]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Morphine when roll is 19", () => {
      rollQueue = [19];
      const result = rollOnChestTable({ ...chests[0] }, dispatch);

      expect(result).toEqual([equipment[1]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns empty array when roll is 20", () => {
      rollQueue = [20];
      const result = rollOnChestTable({ ...chests[0] }, dispatch);

      expect(result).toEqual([]);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("Corpse", () => {
    test("returns random weapon when roll is 2", () => {
      rollQueue = [2];
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toHaveLength(1);
      expect(weapons as readonly unknown[]).toContainEqual(result[0]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns random weapon when roll is 14", () => {
      rollQueue = [14];
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toHaveLength(1);
      expect(weapons as readonly unknown[]).toContainEqual(result[0]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Cigarettes (Gin) when roll is 15", () => {
      rollQueue = [15];
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toEqual([equipment[2]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Cigarettes (Gin) when roll is 16", () => {
      rollQueue = [16];
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toEqual([equipment[2]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Hip Flask when roll is 17", () => {
      rollQueue = [17];
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toEqual([equipment[3]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns Hip Flask when roll is 20", () => {
      rollQueue = [20];
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toEqual([equipment[3]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("returns empty array when roll is 1 (trap handled first)", () => {
      rollQueue = [1, 3, 3]; // d20=1, two d3 calls for damage (bug in source)
      const result = rollOnChestTable({ ...chests[1] }, dispatch);

      expect(result).toEqual([]);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Night 2 Chests (options.night === 2)", () => {
    test("Night 2 chest trap deals 1d3+1 damage and includes Night II message", () => {
      rollQueue = [1, 2]; // d20=1 (trap), d3=2 (+1 Night 2 peril = 3 damage)
      const result = rollOnChestTable(
        { ...chests[0] },
        dispatch,
        { wounds: 20 },
        { night: 2 },
      );

      expect(result).toEqual([]);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_wounded");
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(17);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Night II peril",
      );
    });

    test("Night 2 Medic Bag returns First Aid Kit on roll 16", () => {
      rollQueue = [16];
      const result = rollOnChestTable(
        { ...chests[0] },
        dispatch,
        { wounds: 10 },
        { night: 2 },
      );

      expect(result).toEqual([equipment[4]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("Night 2 Medic Bag returns Adrenaline Shot on roll 20", () => {
      rollQueue = [20];
      const result = rollOnChestTable(
        { ...chests[0] },
        dispatch,
        { wounds: 10 },
        { night: 2 },
      );

      expect(result).toEqual([equipment[5]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("Night 2 Corpse returns Adrenaline Shot on roll 17", () => {
      rollQueue = [17];
      const result = rollOnChestTable(
        { ...chests[1] },
        dispatch,
        { wounds: 10 },
        { night: 2 },
      );

      expect(result).toEqual([equipment[5]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("Night 2 Corpse returns First Aid Kit on roll 20", () => {
      rollQueue = [20];
      const result = rollOnChestTable(
        { ...chests[1] },
        dispatch,
        { wounds: 10 },
        { night: 2 },
      );

      expect(result).toEqual([equipment[4]]);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("Last Stand saves player from fatal chest booby trap", () => {
      rollQueue = [1, 3]; // roll 1 (trap), d3=3 (fatal against 1 wound)
      const result = rollOnChestTable(
        { ...chests[0] },
        dispatch,
        { wounds: 1 },
        { perks: ["last-stand"], lastStandUsed: false },
      );

      expect(result).toEqual([]);
      const actionTypes = dispatch.mock.calls.map((c) => c[0]!.type);
      expect(actionTypes).toContain("last_stand_used");
      expect(actionTypes).not.toContain("game_over");
    });
  });
});
