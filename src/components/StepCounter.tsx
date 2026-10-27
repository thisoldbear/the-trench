import { rollDice } from "@/utils/rollDice";
import { useMemo, useRef } from "react";

const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];

export const StepCounter = ({ stepId }: { stepId?: string | null } = {}) => {
  const prevRef = useRef<string | null>(null);
  const symbol = useMemo(() => {
    let newIndex = rollDice(symbols.length) - 1;
    let newSymbol = symbols[newIndex]!;

    while (newSymbol === prevRef.current && symbols.length > 1) {
      newIndex = rollDice(symbols.length) - 1;
      newSymbol = symbols[newIndex]!;
    }

    prevRef.current = newSymbol;
    return newSymbol;
  }, [stepId]);

  return <span>{symbol}</span>;
};
