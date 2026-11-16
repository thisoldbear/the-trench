import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { chests } from "@/datasheets/chests";
import { enemies } from "@/datasheets/enemies";
import { rooms } from "@/datasheets/rooms";
import { traps } from "@/datasheets/traps";
import { rollDice } from "./rollDice";

export type DecisionResult = {
  step: Room | Enemy | Trap | Chest;
  rolls: number[];
};

export function resolveDecisionTable(): DecisionResult {
  const firstDice = rollDice(20);

  // Chapel
  if (firstDice <= 2) {
    return { step: rooms[1], rolls: [firstDice] };
  }

  // Trench
  if (firstDice <= 8) {
    return { step: rooms[0], rolls: [firstDice] };
  }

  // Booty
  if (firstDice <= 12) {
    const secondDice = rollDice(20);
    if (secondDice <= 10) {
      return { step: chests[0], rolls: [firstDice, secondDice] };
    }

    return { step: chests[1], rolls: [firstDice, secondDice] };
  }

  // Enemies
  if (firstDice <= 18) {
    const secondDice = rollDice(20);
    if (secondDice <= 14) {
      return { step: enemies[0], rolls: [firstDice, secondDice] };
    }

    if (secondDice <= 15) {
      return { step: enemies[1], rolls: [firstDice, secondDice] };
    }

    if (secondDice <= 16) {
      return { step: enemies[2], rolls: [firstDice, secondDice] };
    }

    if (secondDice <= 19) {
      return { step: enemies[3], rolls: [firstDice, secondDice] };
    }

    return { step: enemies[4], rolls: [firstDice, secondDice] };
  }

  // Trap
  if (firstDice <= 19) {
    const secondDice = rollDice(20);
    if (secondDice <= 10) {
      return { step: traps[0], rolls: [firstDice, secondDice] };
    }
    if (secondDice <= 15) {
      return { step: traps[1], rolls: [firstDice, secondDice] };
    }
    if (secondDice <= 18) {
      return { step: traps[2], rolls: [firstDice, secondDice] };
    }
    return { step: traps[3], rolls: [firstDice, secondDice] };
  }

  // Trench
  return { step: rooms[0], rolls: [firstDice] };
}

export function rollOnDecisionTable(): Room | Enemy | Trap | Chest {
  return resolveDecisionTable().step;
}
