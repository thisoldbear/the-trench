import { useGame } from "@/context/GameContext";

export const StepCounter = () => {
  const { state, dispatch } = useGame();

  const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];

  if (1 % state.steps === 0) {
    return <span>{symbols[0]}</span>;
  }
  if (2 % state.steps === 0) {
    return <span>{symbols[1]}</span>;
  }
  if (3 % state.steps === 0) {
    return <span>{symbols[2]}</span>;
  }
  if (4 % state.steps === 0) {
    return <span>{symbols[3]}</span>;
  }
  if (5 % state.steps === 0) {
    return <span>{symbols[4]}</span>;
  }

  return <span>{symbols[5]}</span>;
};
