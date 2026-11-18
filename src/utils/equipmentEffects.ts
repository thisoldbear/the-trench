import type { Dispatch } from "react";
import type { GameAction } from "@/context/GameContext";
import type { Equipment } from "@/datasheets/equipment";
import { player } from "@/datasheets/player";
import { createMessage } from "./messages";

export type PlayerEquipmentState = {
  wounds: number;
  totalWounds?: number;
  toughness: number;
  totalToughness?: number;
  damageModifier: number;
  hitModifier: number;
  healBonus?: number;
};

export function applyEquipmentEffect(
  equipment: Equipment,
  playerState: PlayerEquipmentState,
  dispatch: Dispatch<GameAction>,
) {
  const maxWounds = playerState.totalWounds ?? player.totalWounds;
  const baseToughness = playerState.totalToughness ?? player.totalToughness;
  const healBonus = playerState.healBonus ?? 0;

  if (
    equipment.id === "morphine" &&
    playerState.toughness <= baseToughness + 2
  ) {
    dispatch({
      type: "player_toughness_add",
      payload: {
        toughness: playerState.toughness + 2,
        messages: [createMessage("Toughness increased for a short while")],
      },
    });
  }

  if (equipment.id === "bandage") {
    const healAmount = 3 + healBonus;
    dispatch({
      type: "player_restored",
      payload: {
        wounds: Math.min(playerState.wounds + healAmount, maxWounds),
        messages: [
          createMessage(
            healBonus > 0
              ? `Bandage restored ${healAmount} health (${healBonus} Combat Medic bonus).`
              : "Bandage restored 3 health.",
          ),
        ],
      },
    });
  }

  if (equipment.id === "first-aid-kit") {
    const healAmount = 6 + healBonus;
    dispatch({
      type: "player_restored",
      payload: {
        wounds: Math.min(playerState.wounds + healAmount, maxWounds),
        messages: [
          createMessage(
            healBonus > 0
              ? `First Aid Kit restored ${healAmount} health (${healBonus} Combat Medic bonus).`
              : "First Aid Kit restored 6 health.",
          ),
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
          createMessage(
            "Cigarettes added +1 to hit rolls for a short while"
          ),
        ],
      },
    });
  }

  if (equipment.id === "adrenaline-shot") {
    dispatch({
      type: "player_hit_modifier_add",
      payload: {
        hitModifier: playerState.hitModifier + 2,
        messages: [
          createMessage("Adrenaline Shot added +2 to hit rolls for a short while"),
        ],
      },
    });
    dispatch({
      type: "player_damage_add",
      payload: {
        damageModifier: playerState.damageModifier + 2,
        messages: [
          createMessage("Adrenaline Shot added +2 to damage results for a short while"),
        ],
      },
    });
  }

  if (equipment.id === "hip-flask") {
    if (playerState.toughness <= baseToughness + 1) {
      dispatch({
        type: "player_toughness_add",
        payload: {
          toughness: playerState.toughness + 1,
          messages: [createMessage("Toughness increased for a short while")],
        },
      });
    }

    dispatch({
      type: "player_damage_add",
      payload: {
        damageModifier: playerState.damageModifier + 2,
        messages: [
          createMessage("Damage results increased by 2 for a short while"),
        ],
      },
    });
  }
}
