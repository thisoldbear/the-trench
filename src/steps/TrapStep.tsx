import type { Trap } from "@/datasheets/traps";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { StepCounter } from "../components/StepCounter";

export const TrapStep = ({ trap }: { trap: Trap }) => {
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h2 className="unifrakturcook-bold step-title">
        {trap.name} <StepCounter stepId={trap.name} />
      </h2>
      <p>{trap.description}</p>
      <Message />
      <div className="btn-group">
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() => advanceStep()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
