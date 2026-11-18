import { useMemo } from "react";

const symbols = ["☨", "✛", "⛨", "✜", "✠", "✙"];

export const StepCounter = ({ stepId }: { stepId?: string | null } = {}) => {
  const symbol = useMemo(() => {
    if (!stepId) return symbols[0]!;
    let hash = 0;
    for (let i = 0; i < stepId.length; i++) {
      hash = (hash * 31 + stepId.charCodeAt(i)) >>> 0;
    }
    return symbols[hash % symbols.length]!;
  }, [stepId]);

  return <span>{symbol}</span>;
};
