import { equipment } from "@/datasheets/equipment";
import { player } from "@/datasheets/player";
import { expect, test, vi, describe, beforeEach } from "vitest";
import { applyEquipmentEffect } from "./equipmentEffects";

describe("applyEquipmentEffect", () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
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

    test("caps restored wounds at player.totalWounds", () => {
      const playerState = {
        wounds: 14,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[0]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(
        player.totalWounds,
      );
    });

    test("applies healBonus from Combat Medic perk to Bandage", () => {
      const playerState = {
        wounds: 5,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
        healBonus: 3,
      };

      applyEquipmentEffect(equipment[0]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(11); // 5 + 3 + 3
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
        "Cigarettes added +1 to hit rolls",
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
        "Cigarettes added +1 to hit rolls",
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

  describe("first-aid-kit", () => {
    test("restores 6 wounds up to max wounds", () => {
      const playerState = {
        wounds: 8,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[4]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_restored");
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(14);
    });

    test("caps restored wounds at dynamic totalWounds of 20", () => {
      const playerState = {
        wounds: 18,
        totalWounds: 20,
        toughness: 4,
        damageModifier: 0,
        hitModifier: 0,
      };

      applyEquipmentEffect(equipment[4]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.payload.wounds).toBe(20);
    });
  });

  describe("adrenaline-shot", () => {
    test("adds +2 to hit modifier and +2 to damage modifier", () => {
      const playerState = {
        wounds: 10,
        toughness: 4,
        damageModifier: 1,
        hitModifier: 1,
      };

      applyEquipmentEffect(equipment[5]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("player_hit_modifier_add");
      expect(dispatch.mock.calls[0]![0]!.payload.hitModifier).toBe(3);
      expect(dispatch.mock.calls[1]![0]!.type).toBe("player_damage_add");
      expect(dispatch.mock.calls[1]![0]!.payload.damageModifier).toBe(3);
    });
  });

  describe("pistol-ammo", () => {
    test("replenishes pistol ammo by up to 10 rounds", () => {
      const playerState = {
        wounds: 10,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
        weapons: [
          {
            _type: "gun" as const,
            damage: 6 as const,
            damageModifier: 0,
            name: "Pistol",
            description: "Standard issue.",
            id: "pistol" as const,
            notes: "",
            strength: 3,
            limited: true,
            ammo: 5,
            maxAmmo: 20,
            uuid: "test-pistol",
          },
        ],
      };

      applyEquipmentEffect(equipment[6]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("weapon_ammo_add");
      expect(dispatch.mock.calls[0]![0]!.payload.weaponId).toBe("pistol");
      expect(dispatch.mock.calls[0]![0]!.payload.amount).toBe(10);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Pistol ammo replenished (+10 rounds, now 15/20)",
      );
    });
  });

  describe("shotgun-ammo", () => {
    test("replenishes shotgun ammo by up to 5 shells", () => {
      const playerState = {
        wounds: 10,
        toughness: 3,
        damageModifier: 0,
        hitModifier: 0,
        weapons: [
          {
            _type: "gun" as const,
            damage: 6 as const,
            damageModifier: 3,
            name: "Shotgun",
            description: "PULL!",
            id: "shotgun" as const,
            notes: "",
            strength: 4,
            limited: true,
            ammo: 2,
            maxAmmo: 11,
            uuid: "test-shotgun",
          },
        ],
      };

      applyEquipmentEffect(equipment[7]!, playerState, dispatch);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0]![0]!.type).toBe("weapon_ammo_add");
      expect(dispatch.mock.calls[0]![0]!.payload.weaponId).toBe("shotgun");
      expect(dispatch.mock.calls[0]![0]!.payload.amount).toBe(5);
      expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
        "Shotgun ammo replenished (+5 shells, now 7/11)",
      );
    });
  });
});
