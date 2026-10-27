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

  if (player.hitModifier > 0) {
    dispatch({
      type: "player_hit_modifier_remove",
      payload: {
        messages: [createMessage("Cigarettes +1 to hit rolls wore off")],
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
