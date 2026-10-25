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
) {
  const diceResult = rollDice(20);

  if (diceResult <= 1) {
    const woundRoll = rollDice(3);
    const remainingWounds = currentPlayer.wounds - woundRoll;

    if (remainingWounds <= 0) {
      dispatch({
        type: "player_wounded",
        payload: {
          wounds: 0,
          messages: [
            createMessage(`${chest.name} was a trap. Received ${woundRoll} wounds.`),
          ],
        },
      });
      dispatch({ type: "game_over" });
      return [];
    }

    dispatch({
      type: "player_wounded",
      payload: {
        wounds: remainingWounds,
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
      const weaponIndex = rollDice(weapons.length) - 1;
      return [weapons[weaponIndex]!];
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
