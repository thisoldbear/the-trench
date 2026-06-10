import { rollDice } from "@/utils/rollDice";
import { useMemo } from "react";

const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];
let previousSymbol: string | null = null;

export const StepCounter = ({ stepId }: { stepId: string }) => {
  const symbol = useMemo(() => {
    let newIndex = rollDice(6) - 1; // rollDice returns 1-6, we need 0-5
    let newSymbol = symbols[newIndex]!;

    // Keep rolling until we get a different symbol
    while (newSymbol === previousSymbol && symbols.length > 1) {
      newIndex = rollDice(6) - 1;
      newSymbol = symbols[newIndex]!;
    }

    previousSymbol = newSymbol;
    return newSymbol;
  }, [stepId]);

  return <span>{symbol}</span>;
};
