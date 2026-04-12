import { rollDice } from "@/utils/rollDice";

export const StepCounter = () => {
  const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];

  return <span>{symbols[rollDice(5)]}</span>;
};
