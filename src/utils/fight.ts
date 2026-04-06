import type { Enemy } from "@/datasheets/enemies";
import { rollDice } from "./rollDice";
import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";

export function hitOn(attackerStrength: any, defenderToughness: any) {
  let hitOn = 3;

  if (attackerStrength === defenderToughness) {
    hitOn = 4;
  }

  if (attackerStrength < defenderToughness) {
    hitOn = 5;
  }

  return hitOn;
}

export function fightLoop(
  player: any,
  enemy: Enemy,
  dispatch: Dispatch<GameAction>,
) {
  if (player.wounds <= 0 || enemy.wounds <= 0) return;

  const weapon = player.equippedWeapon;
  const playerRolled = rollDice(6);
  const playerHit = playerRolled >= hitOn(weapon.strength, enemy.toughness);

  if (playerHit) {
    const damage = rollDice(weapon.damage) + weapon.damageModifier;
    const enemyWounds = enemy.wounds - damage;

    if (enemyWounds <= 0) {
      dispatch({
        type: "enemy_defeated",
        payload: {
          wounds: 0,
          message: [
            `You rolled a ${playerRolled}. ${enemy.name} took ${damage} damage`,
            `${enemy.name} defeated`,
          ],
        },
      });
      return;
    }

    dispatch({
      type: "enemy_wounded",
      payload: {
        wounds: enemyWounds,
        message: [
          `You rolled a ${playerRolled}`,
          `${enemy.name} took ${damage} damage`,
        ],
      },
    });
  } else {
    dispatch({
      type: "enemy_wounded",
      payload: {
        wounds: enemy.wounds,
        message: [`You rolled a ${playerRolled} (miss)`],
      },
    });
  }

  const enemyRolled = rollDice(6);
  const enemyHit = enemyRolled >= hitOn(enemy.strength, player.toughness);

  if (enemyHit) {
    const damage = rollDice(enemy.damage) + enemy.damageModifier;
    const playerWounds = player.wounds - damage;

    if (playerWounds <= 0) {
      dispatch({ type: "game_over" });
      return;
    }

    dispatch({
      type: "player_wounded",
      payload: {
        wounds: playerWounds,
        message: [
          `${enemy.name} rolled a ${enemyRolled}`,
          `You took ${damage} damage`,
        ],
      },
    });
  } else {
    dispatch({
      type: "player_wounded",
      payload: {
        wounds: player.wounds,
        message: [`${enemy.name} rolled a ${enemyRolled} (miss)`],
      },
    });
  }
}
