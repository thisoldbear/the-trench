import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { chests } from "@/datasheets/chests";
import { enemies, enemiesNight2, enemiesNight3 } from "@/datasheets/enemies";
import { rooms } from "@/datasheets/rooms";
import { traps } from "@/datasheets/traps";
import { rollDice } from "./rollDice";

export type DecisionResult = {
  step: Room | Enemy | Trap | Chest;
  rolls: number[];
};

export type DecisionOptions = {
  rooms?: number;
  night?: number;
};

export function resolveDecisionTable(
  options?: DecisionOptions | number,
): DecisionResult {
  const nightNum =
    typeof options === "number"
      ? (options >= 13 ? 2 : options)
      : (options?.night ?? ((options?.rooms ?? 0) >= 13 ? 2 : 1));

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
    const enemyList =
      nightNum >= 4 ? enemiesNight3 : nightNum >= 2 ? enemiesNight2 : enemies;
    if (secondDice <= 14) {
      return { step: enemyList[0], rolls: [firstDice, secondDice] };
    }

    if (secondDice <= 15) {
      return { step: enemyList[1], rolls: [firstDice, secondDice] };
    }

    if (secondDice <= 16) {
      return { step: enemyList[2], rolls: [firstDice, secondDice] };
    }

    if (secondDice <= 19) {
      return { step: enemyList[3], rolls: [firstDice, secondDice] };
    }

    return { step: enemyList[4], rolls: [firstDice, secondDice] };
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

export function rollOnDecisionTable(
  options?: DecisionOptions | number,
): Room | Enemy | Trap | Chest {
  return resolveDecisionTable(options).step;
}
