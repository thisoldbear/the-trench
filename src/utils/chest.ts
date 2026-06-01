import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import type { Chest } from "@/datasheets/chests";
import { equipment } from "@/datasheets/equipment";
import { weapons } from "@/datasheets/weapons";
import { rollDice } from "./rollDice";
import { createMessage } from "./messages";

export function rollOnChestTable(chest: Chest, dispatch: Dispatch<GameAction>) {
  const diceResult = rollDice(20);

  if (diceResult <= 1) {
    const woundRoll = rollDice(3);

    dispatch({
      type: "player_wounded",
      payload: {
        wounds: woundRoll,
        messages: [
          createMessage(`${chest.name} was a trap. Received ${woundRoll} wounds.`),
        ],
      },
    });

    return [];
  }

  if (chest.id === "medic-bag") {
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
    // Empty
    if (diceResult <= 1) {
      return [];
    }

    if (diceResult <= 14) {
      return [weapons[Math.floor(Math.random() * weapons.length)]!];
    }

    if (diceResult <= 16) {
      // Gin
      return [equipment[2]!];
    }

    if (diceResult <= 20) {
      // Hip flask
      return [equipment[3]!];
    }
  }

  return [];
}
