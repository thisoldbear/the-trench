import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import type { Equipment } from "@/datasheets/equipment";
import { player } from "@/datasheets/player";

export function applyEquipmentEffect(
  equipment: Equipment,
  playerState: {
    wounds: number;
    toughness: number;
    damageModifier: number;
    hitModifier: number;
  },
  dispatch: Dispatch<GameAction>,
) {
  if (
    equipment.id === "morphine" &&
    playerState.toughness <= player.totalToughness + 3
  ) {
    dispatch({
      type: "player_toughness_add",
      payload: {
        toughness: playerState.toughness + 3,
        messages: [
          {
            id: crypto.randomUUID(),
            text: `Toughness increased for a short while`,
          },
        ],
      },
    });
  }

  if (equipment.id === "bandage") {
    dispatch({
      type: "player_restored",
      payload: {
        wounds: playerState.wounds + 3,
        messages: [
          {
            id: crypto.randomUUID(),
            text: `Bandage restored 3 health.`,
          },
        ],
      },
    });
  }

  if (equipment.id === "cigarettes") {
    dispatch({
      type: "player_hit_modifier_add",
      payload: {
        hitModifier: playerState.hitModifier + 1,
        messages: [
          {
            id: crypto.randomUUID(),
            text: `Cigarettes added ${playerState.hitModifier + 1} to hit results for a short while`,
          },
        ],
      },
    });
  }

  if (equipment.id === "hip-flask") {
    if (playerState.toughness <= player.totalToughness + 1) {
      dispatch({
        type: "player_toughness_add",
        payload: {
          toughness: playerState.toughness + 1,
          messages: [
            {
              id: crypto.randomUUID(),
              text: `Toughness increased for a short while`,
            },
          ],
        },
      });
    }

    dispatch({
      type: "player_damage_add",
      payload: {
        damageModifier: playerState.damageModifier + 2,
        messages: [
          {
            id: crypto.randomUUID(),
            text: `Damage results increased by 2 for a short while`,
          },
        ],
      },
    });
  }
}
