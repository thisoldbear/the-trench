import { rollDice } from "@/utils/rollDice";
import { useMemo } from "react";

export const StepCounter = () => {
  const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];
  const symbol = useMemo(() => symbols[rollDice(5)], []);

  return <span>{symbol}</span>;
};
