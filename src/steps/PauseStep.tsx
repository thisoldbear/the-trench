import type { Pause } from "@/datasheets/pause";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { StepCounter } from "../components/StepCounter";
import { AdvanceArrow } from "../components/AdvanceArrow";

export const PauseStep = ({ pause }: { pause: Pause }) => {
  const advanceStep = useAdvanceStep();

  return (
    <div className="pause-step">
      <h2 className="unifrakturcook-bold step-title">
        {pause.name} <StepCounter stepId={pause.name} />
      </h2>
      <p>{pause.description}</p>
      <Message />
      <div className="btn-group">
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() => advanceStep()}
        >
          Continue <AdvanceArrow />
        </button>
      </div>
    </div>
  );
};
