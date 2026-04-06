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
  // if (firstDice <= 8) {
  //   return {
  //     ...rooms[0],
  //     name: "Booty",
  //   };
  // }

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

    if (secondDice <= 17) {
      return enemies[3];
    }

    if (secondDice <= 18) {
      return enemies[4];
    }

    return enemies[5];
  }

  // Trap
  if (firstDice <= 19) {
    return traps[0];
  }

  // Trench
  return rooms[0];
}
