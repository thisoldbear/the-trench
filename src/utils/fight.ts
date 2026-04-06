import type { Enemy } from "@/datasheets/enemies";
import { rollDice } from "./rollDice";
import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import type { Weapon } from "@/datasheets/weapons";
import type { Player } from "@/datasheets/player";

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

export function resolveWeaponAmmo(
  weapon: Weapon,
  dispatch: Dispatch<GameAction>,
) {
  if (weapon.limited) {
    dispatch({
      type: "equipped_weapon_remove_ammo",
      payload: {},
    });
  }
}

export function fightLoop(
  player: Player,
  enemy: Enemy,
  dispatch: Dispatch<GameAction>,
) {
  if (player.wounds <= 0 || enemy.wounds <= 0) return;

  const weapon = player.weapons.find(
    (weapon) => weapon.id === player.equippedWeapon,
  );

  if (!weapon) {
    return;
  }

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
          messages: [
            {
              id: crypto.randomUUID(),
              text: `You rolled a ${playerRolled}. ${enemy.name} took ${damage} damage`,
            },
            { id: crypto.randomUUID(), text: `${enemy.name} defeated` },
          ],
        },
      });

      resolveWeaponAmmo(weapon, dispatch);

      return; // EXIT from fightLoop
    }

    dispatch({
      type: "enemy_wounded",
      payload: {
        wounds: enemyWounds,
        messages: [
          { id: crypto.randomUUID(), text: `You rolled a ${playerRolled}` },
          {
            id: crypto.randomUUID(),
            text: `${enemy.name} took ${damage} damage`,
          },
        ],
      },
    });
  } else {
    dispatch({
      type: "enemy_wounded",
      payload: {
        wounds: enemy.wounds,
        messages: [
          {
            id: crypto.randomUUID(),
            text: `You rolled a ${playerRolled} (miss)`,
          },
        ],
      },
    });
  }

  resolveWeaponAmmo(weapon, dispatch);

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
        messages: [
          {
            id: crypto.randomUUID(),
            text: `${enemy.name} rolled a ${enemyRolled}`,
          },
          { id: crypto.randomUUID(), text: `You took ${damage} damage` },
        ],
      },
    });
  } else {
    dispatch({
      type: "player_wounded",
      payload: {
        wounds: player.wounds,
        messages: [
          {
            id: crypto.randomUUID(),
            text: `${enemy.name} rolled a ${enemyRolled} (miss)`,
          },
        ],
      },
    });
  }
}
