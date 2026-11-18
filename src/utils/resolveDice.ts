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
  tables: string[];
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
    return {
      step: rooms[1],
      rolls: [firstDice],
      tables: ["Table I (Exploration)"],
    };
  }

  // Trench
  if (firstDice <= 8) {
    return {
      step: rooms[0],
      rolls: [firstDice],
      tables: ["Table I (Exploration)"],
    };
  }

  // Booty
  if (firstDice <= 12) {
    const secondDice = rollDice(20);
    const bootyTable =
      nightNum >= 2 ? "Table II B (Booty)" : "Table II A (Booty)";
    if (secondDice <= 10) {
      return {
        step: chests[0],
        rolls: [firstDice, secondDice],
        tables: ["Table I (Exploration)", bootyTable],
      };
    }

    return {
      step: chests[1],
      rolls: [firstDice, secondDice],
      tables: ["Table I (Exploration)", bootyTable],
    };
  }

  // Enemies
  if (firstDice <= 18) {
    const secondDice = rollDice(20);
    const enemyList =
      nightNum >= 4 ? enemiesNight3 : nightNum >= 2 ? enemiesNight2 : enemies;
    const monsterTable =
      nightNum >= 4
        ? "Table III C (Monsters)"
        : nightNum >= 2
          ? "Table III B (Monsters)"
          : "Table III A (Monsters)";
    const enemy =
      secondDice <= 14
        ? enemyList[0]
        : secondDice <= 15
          ? enemyList[1]
          : secondDice <= 16
            ? enemyList[2]
            : secondDice <= 19
              ? enemyList[3]
              : enemyList[4];

    return {
      step: enemy,
      rolls: [firstDice, secondDice],
      tables: ["Table I (Exploration)", monsterTable],
    };
  }

  // Trap
  if (firstDice <= 19) {
    const secondDice = rollDice(20);
    const trap =
      secondDice <= 10
        ? traps[0]
        : secondDice <= 15
          ? traps[1]
          : secondDice <= 18
            ? traps[2]
            : traps[3];

    return {
      step: trap,
      rolls: [firstDice, secondDice],
      tables: ["Table I (Exploration)", "Table IV (Traps)"],
    };
  }

  // Trench
  return {
    step: rooms[0],
    rolls: [firstDice],
    tables: ["Table I (Exploration)"],
  };
}

export function rollOnDecisionTable(
  options?: DecisionOptions | number,
): Room | Enemy | Trap | Chest {
  return resolveDecisionTable(options).step;
}
