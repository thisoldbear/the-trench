import type { Trap } from "@/datasheets/traps";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";

export const TrapStep = ({ trap }: { trap: Trap }) => {
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h1>{trap.name}</h1>
      <p>{trap.description}</p>
      <button onClick={() => advanceStep()}>Continue</button>
      <Message />
    </div>
  );
};
