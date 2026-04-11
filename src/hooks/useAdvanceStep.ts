import { useGame } from "@/context/GameContext";
import { rollOnDecisionTable } from "@/utils/resolveDice";

export function useAdvanceStep() {
  const { dispatch } = useGame();
  return (opts?: {
    rooms?: number;
    messages?: { id: string; text: string }[];
  }) => {
    dispatch({
      type: "active_step",
      payload: {
        // TODO: Fix !
        activeStep: rollOnDecisionTable()!,
        ...opts,
      },
    });
  };
}
