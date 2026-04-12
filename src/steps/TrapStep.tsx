import type { Trap } from "@/datasheets/traps";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { useGame } from "@/context/GameContext";
import { rollDice } from "@/utils/rollDice";

export const TrapStep = ({ trap }: { trap: Trap }) => {
  const { state, dispatch } = useGame();

  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h1>{trap.name}</h1>
      <p>{trap.description}</p>
      <button
        className="btn btn--cta unifrakturcook-bold"
        onClick={() => advanceStep()}
      >
        Continue
      </button>
      <Message />
    </div>
  );
};
