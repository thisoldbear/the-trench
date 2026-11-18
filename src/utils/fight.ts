import type { Enemy } from "@/datasheets/enemies";
import { rollDice } from "./rollDice";
import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import type { Weapon } from "@/datasheets/weapons";
import type { Player } from "@/datasheets/player";
import { removeTemporaryModifiers, decrementDamageModifier } from "./modifiers";
import { createMessage } from "./messages";

export function hitOn(attackerStrength: number, defenderToughness: number) {
  let hitOn = 3;

  if (attackerStrength === defenderToughness) {
    hitOn = 4;
  } else if (attackerStrength < defenderToughness) {
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

export type FightOptions = {
  perks?: string[];
  lastStandUsed?: boolean;
};

export function fightLoop(
  player: Player,
  enemy: Enemy,
  dispatch: Dispatch<GameAction>,
  options?: FightOptions,
) {
  if (player.wounds <= 0 || enemy.wounds <= 0) return;

  const weapon = player.weapons.find(
    (weapon) => weapon.uuid === player.equippedWeapon,
  );

  if (!weapon) {
    return;
  }

  const playerRolled = rollDice(6) + player.hitModifier;
  const playerHit = playerRolled >= hitOn(weapon.strength, enemy.toughness);

  if (playerHit) {
    const meleeBonus =
      options?.perks?.includes("bayonet-vigor") && weapon._type === "melee"
        ? 2
        : 0;
    const surgeBonus =
      options?.perks?.includes("adrenaline-surge") &&
      enemy.wounds === enemy.totalWounds
        ? 2
        : 0;
    const damage =
      rollDice(weapon.damage) + weapon.damageModifier + meleeBonus + surgeBonus;
    const totalDamage = damage + player.damageModifier;
    const enemyWounds = enemy.wounds - totalDamage;

    if (enemyWounds <= 0) {
      dispatch({
        type: "enemy_defeated",
        payload: {
          wounds: 0,
          messages: [
            createMessage(
              `You rolled a ${playerRolled}. ${enemy.name} took ${totalDamage} damage ${player.damageModifier ? `(${damage} + ${player.damageModifier} modifier)` : ``}`,
            ),
            createMessage(`${enemy.name} was defeated`),
          ],
        },
      });

      removeTemporaryModifiers(player, dispatch);
      resolveWeaponAmmo(weapon, dispatch);

      return; // EXIT from fightLoop
    }

    dispatch({
      type: "enemy_wounded",
      payload: {
        wounds: enemyWounds,
        messages: [
          createMessage(
            `You rolled a ${playerRolled}. ${enemy.name} took ${totalDamage} damage ${player.damageModifier ? `(${damage} + ${player.damageModifier} modifier)` : ``}`,
          ),
        ],
      },
    });

    decrementDamageModifier(player.damageModifier, dispatch);
  } else {
    dispatch({
      type: "enemy_wounded",
      payload: {
        wounds: enemy.wounds,
        messages: [createMessage(`You rolled a ${playerRolled} (miss)`)],
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
      if (options?.perks?.includes("last-stand") && !options?.lastStandUsed) {
        dispatch({
          type: "last_stand_used",
          payload: {
            messages: [
              createMessage(`${enemy.name} rolled a ${enemyRolled}`),
              createMessage(`You took ${damage} damage`),
              createMessage("Last Stand! Defied death and survived at 1 HP."),
            ],
          },
        });
        return;
      }

      dispatch({
        type: "player_wounded",
        payload: {
          wounds: 0,
          messages: [
            createMessage(`${enemy.name} rolled a ${enemyRolled}`),
            createMessage(`You took ${damage} damage`),
          ],
        },
      });
      dispatch({ type: "game_over" });
      return;
    }

    dispatch({
      type: "player_wounded",
      payload: {
        wounds: playerWounds,
        messages: [
          createMessage(`${enemy.name} rolled a ${enemyRolled}`),
          createMessage(`You took ${damage} damage`),
        ],
      },
    });

    if (player.toughness > player.totalToughness) {
      dispatch({
        type: "player_toughness_remove",
        payload: {
          toughness: player.toughness - 1,
          messages: [createMessage(`Toughness decreased`)],
        },
      });
    }
  } else {
    dispatch({
      type: "player_wounded",
      payload: {
        wounds: player.wounds,
        messages: [createMessage(`${enemy.name} rolled a ${enemyRolled} (miss)`)],
      },
    });
  }
}
