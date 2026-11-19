import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import type { Chest } from "@/datasheets/chests";
import { equipment } from "@/datasheets/equipment";
import { player, type Player } from "@/datasheets/player";
import { weapons } from "@/datasheets/weapons";
import { rollDice } from "./rollDice";
import { createMessage } from "./messages";

export function rollOnChestTable(
  chest: Chest,
  dispatch: Dispatch<GameAction>,
  currentPlayer: Pick<Player, "wounds"> = player,
  options?: {
    night?: number;
    perks?: string[];
    lastStandUsed?: boolean;
  },
) {
  const isNightTwo = (options?.night ?? 1) >= 2;
  const currentNight = options?.night ?? 1;
  const diceResult = rollDice(20);

  if (diceResult <= 1) {
    const baseWounds = rollDice(3);
    const perilBonus = isNightTwo ? 1 : 0;
    const hasTrenchArmor = Boolean(options?.perks?.includes("trench-armor"));
    const romanNumerals = ["", "I", "II", "III", "IV", "V"];
    const nightRoman = romanNumerals[currentNight] || `${currentNight}`;

    const woundRoll = hasTrenchArmor
      ? Math.max(1, baseWounds + perilBonus - 1)
      : baseWounds + perilBonus;
    const remainingWounds = currentPlayer.wounds - woundRoll;

    let trapMessage = isNightTwo
      ? `${chest.name} was a trap. Received ${woundRoll} wounds (${baseWounds} + 1 Night ${nightRoman} peril).`
      : `${chest.name} was a trap. Received ${woundRoll} wounds.`;

    if (hasTrenchArmor) {
      if (isNightTwo) {
        trapMessage = `${chest.name} was a trap. Received ${woundRoll} wounds (${baseWounds} + 1 Night ${nightRoman} peril - 1 Trench Armor). (Trench Armor reduced damage by 1)`;
      } else {
        trapMessage = `${chest.name} was a trap. Received ${woundRoll} wounds (${baseWounds} - 1 Trench Armor). (Trench Armor reduced damage by 1)`;
      }
    }

    if (remainingWounds <= 0) {
      if (options?.perks?.includes("last-stand") && !options?.lastStandUsed) {
        dispatch({
          type: "last_stand_used",
          payload: {
            messages: [
              createMessage(trapMessage),
              createMessage("Last Stand! Defied death and survived at 1 HP."),
            ],
          },
        });
        return [];
      }

      dispatch({
        type: "player_wounded",
        payload: {
          wounds: 0,
          messages: [createMessage(trapMessage)],
        },
      });
      dispatch({ type: "game_over" });
      return [];
    }

    dispatch({
      type: "player_wounded",
      payload: {
        wounds: remainingWounds,
        messages: [createMessage(trapMessage)],
      },
    });

    return [];
  }

  if (chest.id === "medic-bag") {
    if (isNightTwo) {
      if (diceResult <= 8) {
        // Bandage
        return [equipment[0]!];
      }
      if (diceResult <= 13) {
        // Morphine
        return [equipment[1]!];
      }
      if (diceResult <= 17) {
        // First Aid Kit (+6 HP)
        return [equipment[4]!];
      }
      // 18-20: Adrenaline Shot (+2 hit, +2 damage)
      return [equipment[5]!];
    }

    // Empty
    if (diceResult <= 1) {
      return [];
    }

    if (diceResult <= 14) {
      // Bandage
      return [equipment[0]!];
    }

    if (diceResult <= 19) {
      // Morphine
      return [equipment[1]!];
    }
  }

  if (chest.id === "corpse") {
    if (isNightTwo) {
      if (diceResult <= 7) {
        const [, ...lootableWeapons] = weapons;
        const weaponIndex = rollDice(lootableWeapons.length) - 1;
        return [lootableWeapons[weaponIndex]!];
      }
      if (diceResult <= 10) {
        // Pistol Ammo
        return [equipment[6]!];
      }
      if (diceResult <= 12) {
        // Shotgun Ammo
        return [equipment[7]!];
      }
      if (diceResult <= 14) {
        // Hip flask
        return [equipment[3]!];
      }
      if (diceResult <= 17) {
        // Adrenaline Shot
        return [equipment[5]!];
      }
      // 18-20: First Aid Kit
      return [equipment[4]!];
    }

    // Empty
    if (diceResult <= 1) {
      return [];
    }

    if (diceResult <= 8) {
      const [, ...lootableWeapons] = weapons;
      const weaponIndex = rollDice(lootableWeapons.length) - 1;
      return [lootableWeapons[weaponIndex]!];
    }

    if (diceResult <= 11) {
      // Pistol Ammo
      return [equipment[6]!];
    }

    if (diceResult <= 14) {
      // Shotgun Ammo
      return [equipment[7]!];
    }

    if (diceResult <= 16) {
      // Gin / Cigarettes
      return [equipment[2]!];
    }

    if (diceResult <= 20) {
      // Hip flask
      return [equipment[3]!];
    }
  }

  return [];
}
