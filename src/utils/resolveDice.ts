import { chests } from "../datasheets/chests";
import { enemies } from "../datasheets/enemies";
import { rooms } from "../datasheets/rooms";
import { traps } from "../datasheets/traps";
import { rollDice } from "./rollDice";

export function rollOnDecisionTable() {
  const firstDice = rollDice(20);
  const secondDice = rollDice(20);

  // Trench
  if (firstDice <= 6) {
    return rooms[0];
  }

  // Chapel
  if (firstDice <= 7) {
    return rooms[1];
  }

  // Booty
  if (firstDice <= 8) {
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

    // Ghost
    // if (secondDice <= 18) {
    //   return enemies[4];
    // }

    return enemies[4];
  }

  // Trap
  if (firstDice <= 19) {
    return traps[0];
  }

  // Trench
  return rooms[0];
}
