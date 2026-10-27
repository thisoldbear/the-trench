import { chests } from "@/datasheets/chests";
import { equipment } from "@/datasheets/equipment";
import { weapons } from "@/datasheets/weapons";
import { expect, test, mock, describe, beforeEach } from "bun:test";

let rollQueue: number[] = [];
const mockRollDice = mock((sides: number) => rollQueue.shift() ?? 1);

mock.module("./rollDice", () => ({
  rollDice: mockRollDice,
}));

import { rollOnChestTable } from "./chest";

describe("rollOnChestTable", () => {
  let dispatch: ReturnType<typeof mock>;

  beforeEach(() => {
    dispatch = mock(() => {});
    mockRollDice.mockClear();
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
});
