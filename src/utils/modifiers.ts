import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import { createMessage } from "./messages";

/**
 * Removes all temporary modifiers (damage and hit bonuses) from the player.
 * Called when fleeing, lighting lamps, or after combat ends.
 */
export function removeTemporaryModifiers(
  player: {
    damageModifier: number;
    hitModifier: number;
    totalHitModifier?: number;
  },
  dispatch: Dispatch<GameAction>,
) {
  if (player.damageModifier > 0) {
    dispatch({
      type: "player_damage_remove",
      payload: {
        damageModifier: 0,
        messages: [createMessage("Damage modifier removed")],
      },
    });
  }

  const baseHit = player.totalHitModifier ?? 0;
  if (player.hitModifier > baseHit) {
    dispatch({
      type: "player_hit_modifier_remove",
      payload: {
        messages: [createMessage("Temporary hit modifier wore off")],
      },
    });
  }
}

/**
 * Decrements the damage modifier by 1 after each successful hit.
 * Used during combat to gradually reduce temporary damage bonuses.
 */
export function decrementDamageModifier(
  currentModifier: number,
  dispatch: Dispatch<GameAction>,
) {
  if (currentModifier > 0) {
    dispatch({
      type: "player_damage_remove",
      payload: {
        damageModifier: currentModifier - 1,
        messages: [createMessage(`Damage bonus dropped to ${currentModifier - 1}`)],
      },
    });
  }
}
