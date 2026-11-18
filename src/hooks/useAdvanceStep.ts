import { useGame } from "@/context/GameContext";
import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { createPauseStep } from "@/datasheets/pause";
import { resolveDecisionTable } from "@/utils/resolveDice";
import { createMessage } from "@/utils/messages";
import { rollDice } from "@/utils/rollDice";

export function useAdvanceStep() {
  const { state, dispatch } = useGame();
  return (opts?: {
    rooms?: number;
    messages?: { id: string; text: string }[];
    lampLit?: boolean;
    fightOn?: boolean;
    night?: number;
  }) => {
    const isFightOn = Boolean(
      opts?.fightOn || (opts?.night !== undefined && opts.night > state.night),
    );
    const nextNight = opts?.night ?? state.night + 1;
    const currentNight = isFightOn ? nextNight : (opts?.night ?? state.night);
    const isNightTwoOrMore = currentNight >= 2;
    const playerTotalWounds =
      isFightOn && state.night === 1 ? 20 : state.player.totalWounds;
    let playerCurrentWounds = isFightOn ? playerTotalWounds : state.player.wounds;

    const isCurrentPause = state.activeStep?._type === "pause";
    const lampLit = Boolean(
      opts?.lampLit || (opts?.rooms !== undefined && opts.rooms > state.rooms),
    );
    const shouldPause =
      !isFightOn &&
      !isCurrentPause &&
      (lampLit || (state.enemiesDefeatedCount >= 3 && !state.hasPaused));

    if (shouldPause) {
      const pauseStep = createPauseStep();
      dispatch({
        type: "active_step",
        payload: {
          activeStep: pauseStep,
          ...opts,
          messages: opts?.messages || [],
        },
      });
      return;
    }

    const { step: activeStep, rolls } = resolveDecisionTable({
      rooms: isFightOn ? 0 : (opts?.rooms ?? state.rooms),
      night: currentNight,
    });

    const prefix = (activeStep: Room | Enemy | Trap | Chest): string => {
      if (activeStep._type === "enemy") {
        return "Encountered: ";
      }
      if (activeStep._type === "room") {
        return "Entered: ";
      }
      if (activeStep._type === "chest") {
        return "Found: ";
      }
      if (activeStep._type === "trap") {
        return "Trap: ";
      }
      return "";
    };

    const rollText = rolls.join(" then ");
    const stepMessage = createMessage(
      `You rolled ${rollText}. ${prefix(activeStep)}${activeStep.name}`,
    );

    const stepMessages = [...(opts?.messages || []), stepMessage];

    if (isFightOn) {
      dispatch({
        type: "fight_on_another_night",
        payload: {
          activeStep,
          messages: stepMessages,
        },
      });
    } else {
      dispatch({
        type: "active_step",
        payload: {
          activeStep,
          ...opts,
          messages: stepMessages,
        },
      });
    }

    if (activeStep._type === "room" && activeStep.name === "Chapel") {
      const isNight5 = currentNight >= 5;
      const restoredWounds = isNight5
        ? Math.min(playerCurrentWounds + 10, playerTotalWounds)
        : playerTotalWounds;
      const chapelMessage = isNight5
        ? "You prayed amid the eclipse. Health restored by 10 (diminished sanctuary)."
        : "You prayed. Health restored.";

      dispatch({
        type: "player_restored",
        payload: {
          wounds: restoredWounds,
          messages: [createMessage(chapelMessage)],
        },
      });
    } else if (activeStep._type === "trap") {
      const trapBonus = currentNight >= 4 ? 2 : currentNight >= 2 ? 1 : 0;
      const hasTrenchArmor = state.perks?.includes("trench-armor");
      const baseDamage = rollDice(activeStep.damage);
      const romanNumerals = ["", "I", "II", "III", "IV", "V"];
      const nightRoman = romanNumerals[currentNight] || `${currentNight}`;

      const trapDamage = Math.max(
        1,
        baseDamage + trapBonus - (hasTrenchArmor ? 1 : 0),
      );

      let damageMessage = `${activeStep.name} dealt ${trapDamage} wounds.`;
      if (trapBonus > 0 && hasTrenchArmor) {
        damageMessage = `${activeStep.name} dealt ${trapDamage} wounds (${baseDamage} + ${trapBonus} Night ${nightRoman} hazard - 1 Trench Armor). (Trench Armor reduced damage by 1)`;
      } else if (trapBonus > 0) {
        damageMessage = `${activeStep.name} dealt ${trapDamage} wounds (${baseDamage} + ${trapBonus} Night ${nightRoman} hazard).`;
      } else if (hasTrenchArmor) {
        damageMessage = `${activeStep.name} dealt ${trapDamage} wounds (${baseDamage} - 1 Trench Armor). (Trench Armor reduced damage by 1)`;
      }

      if (playerCurrentWounds - trapDamage <= 0) {
        dispatch({
          type: "player_wounded",
          payload: {
            wounds: 0,
            messages: [createMessage(damageMessage)],
          },
        });
        dispatch({ type: "game_over" });
      } else {
        dispatch({
          type: "player_wounded",
          payload: {
            wounds: playerCurrentWounds - trapDamage,
            messages: [createMessage(damageMessage)],
          },
        });
      }
    }
  };
}
