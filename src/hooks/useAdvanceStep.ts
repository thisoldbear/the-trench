import { useGame } from "@/context/GameContext";
import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { rollOnDecisionTable } from "@/utils/resolveDice";
import { createMessage } from "@/utils/messages";
import { rollDice } from "@/utils/rollDice";

export function useAdvanceStep() {
  const { state, dispatch } = useGame();
  return (opts?: {
    rooms?: number;
    messages?: { id: string; text: string }[];
  }) => {
    const activeStep = rollOnDecisionTable()!;

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

    dispatch({
      type: "active_step",
      payload: {
        activeStep,
        ...opts,
        messages: [
          ...(opts?.messages || []),
          createMessage(`${prefix(activeStep)} ${activeStep.name}`),
        ],
      },
    });

    if (activeStep._type === "room" && activeStep.name === "Chapel") {
      dispatch({
        type: "player_restored",
        payload: {
          wounds: state.player.totalWounds,
          messages: [createMessage("You prayed. Health restored.")],
        },
      });
    } else if (activeStep._type === "trap") {
      const trapDamage = rollDice(3);

      if (state.player.wounds - trapDamage <= 0) {
        dispatch({
          type: "player_wounded",
          payload: {
            wounds: 0,
            messages: [
              createMessage(`${activeStep.name} dealt ${trapDamage} wounds.`),
            ],
          },
        });
        dispatch({ type: "game_over" });
      } else {
        dispatch({
          type: "player_wounded",
          payload: {
            wounds: state.player.wounds - trapDamage,
            messages: [
              createMessage(`${activeStep.name} dealt ${trapDamage} wounds.`),
            ],
          },
        });
      }
    }
  };
}
