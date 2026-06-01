import { rollDice } from "@/utils/rollDice";
import { useMemo } from "react";

export const StepCounter = ({ stepId }: { stepId: string }) => {
  const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];
  const symbol = useMemo(() => symbols[rollDice(5)], [stepId]);

  return <span>{symbol}</span>;
};
