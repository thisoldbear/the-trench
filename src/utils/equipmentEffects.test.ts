import { equipment } from "@/datasheets/equipment";
import { player } from "@/datasheets/player";
import { expect, test, mock, describe, beforeEach } from "bun:test";
import { applyEquipmentEffect } from "./equipmentEffects";

describe("applyEquipmentEffect", () => {
  let dispatch: ReturnType<typeof mock>;

  beforeEach(() => {
    dispatch = mock(() => {});
  });

  describe("Morphine", () => {
    test("adds +2 toughness when below max cap", () => {
      const playerState = {
        wounds: 10,
        toughness: player.totalToughness,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[1]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_toughness_add");
      expect(dispatch.mock.calls[0]![0]!.payload.toughness).toBe(
        player.totalToughness + 2,
      );
      expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Toughness increased",
      );
    });

    test("does not dispatch when toughness exceeds max cap", () => {
      const playerState = {
        wounds: 10,
        toughness: player.totalToughness + 3,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[1]!, playerState, dispatch);

      expect(dispatch).not.toHaveBeenCalled();
    });

    test("adds toughness when exactly at max cap", () => {
      const playerState = {
        wounds: 10,
        toughness: player.totalToughness + 2,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[1]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.toughness).toBe(
        player.totalToughness + 4,
      );
    });
  });

  describe("Bandage", () => {
    test("restores 3 wounds", () => {
      const playerState = {
        wounds: 10,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[0]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_restored");
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(13);
      expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Bandage restored 3 health",
      );
    });

    test("restores wounds from low health", () => {
      const playerState = {
        wounds: 2,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[0]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(5);
    });
  });

  describe("Cigarettes", () => {
    test("adds +1 hit modifier", () => {
      const playerState = {
        wounds: 10,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[2]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_hit_modifier_add");
      expect(dispatch.mock.calls[0]![0]!.payload.hitModifier).toBe(1);
      expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Cigarettes added 1 to hit results",
      );
    });

    test("stacks with existing hit modifier", () => {
      const playerState = {
        wounds: 10,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 2,
      };

      applyEquipmentEffect(equipment[2]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.hitModifier).toBe(3);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Cigarettes added 3 to hit results",
      );
    });
  });

  describe("Hip Flask", () => {
    test("adds +1 toughness and +2 damage modifier", () => {
      const playerState = {
        wounds: 10,
        toughness: player.totalToughness,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[3]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_toughness_add");
      expect(dispatch.mock.calls[0]![0]!.payload.toughness).toBe(
        player.totalToughness + 1,
      );
      expect(dispatch.mock.calls[1]![0]!.type).toBe("player_damage_add");
      expect(dispatch.mock.calls[1]![0]!.payload.damageModifier).toBe(2);
    });

    test("only adds damage when toughness exceeds cap", () => {
      const playerState = {
        wounds: 10,
        toughness: player.totalToughness + 2,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[3]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_damage_add");
      expect(dispatch.mock.calls[0]![0]!.payload.damageModifier).toBe(2);
    });

    test("stacks damage modifier with existing modifier", () => {
      const playerState = {
        wounds: 10,
        toughness: player.totalToughness + 2,
        damageModifier: 3,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[3]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.damageModifier).toBe(5);
    });
  });
});
