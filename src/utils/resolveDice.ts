import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { chests } from "@/datasheets/chests";
import { enemies } from "@/datasheets/enemies";
import { rooms } from "@/datasheets/rooms";
import { traps } from "@/datasheets/traps";
import { rollDice } from "./rollDice";

export function rollOnDecisionTable(): Room | Enemy | Trap | Chest {
  const firstDice = rollDice(20);
  const secondDice = rollDice(20);

  // Chapel
  if (firstDice <= 2) {
    return rooms[1];
  }

  // Trench
  if (firstDice <= 8) {
    return rooms[0];
  }

  // Booty
  if (firstDice <= 12) {
    if (secondDice <= 10) {
      return chests[0];
    }

    return chests[1];
  }

  // Enemies
  if (firstDice <= 18) {
    if (secondDice <= 14) {
      return enemies[0];
    }

    if (secondDice <= 15) {
      return enemies[1];
    }

    if (secondDice <= 16) {
      return enemies[2];
    }

    if (secondDice <= 19) {
      return enemies[3];
    }

    return enemies[4];
  }

  // Trap
  if (firstDice <= 19) {
    return traps[0];
  }

  // Trench
  return rooms[0];
}
