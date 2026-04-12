import { useGame } from "@/context/GameContext";
import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { rollOnDecisionTable } from "@/utils/resolveDice";

export function useAdvanceStep() {
  const { dispatch } = useGame();
  return (opts?: {
    rooms?: number;
    messages?: { id: string; text: string }[];
  }) => {
    const activeStep = rollOnDecisionTable()!;

    const prefix = (activeStep: Room | Enemy | Trap | Chest) => {
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
    };

    dispatch({
      type: "active_step",
      payload: {
        // TODO: Fix !
        activeStep,
        messages: [
          ...(opts?.messages || []),
          {
            id: crypto.randomUUID(),
            text: `${prefix(activeStep)} ${activeStep.name}`,
          },
        ],
        ...opts,
      },
    });
  };
}
