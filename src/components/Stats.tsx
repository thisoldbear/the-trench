import { useGame } from "@/context/GameContext";

export const Stats = () => {
  const { state } = useGame();

  return (
    <div>
      <p>
        <span
          style={{
            color:
              state.player.wounds > state.player.totalWounds
                ? "green"
                : "inherit",
          }}
        >
          {state.player.wounds}
        </span>{" "}
        / {state.player.totalWounds}
      </p>
      <p>
        T:{" "}
        <span
          style={{
            color:
              state.player.toughness > state.player.totalToughness
                ? "green"
                : "inherit",
          }}
        >
          {state.player.toughness}
        </span>
      </p>
      {state.player.damageModifier > 0 && (
        <p>Damage Modifier: +{state.player.damageModifier}</p>
      )}
      <p>Lamps lit: {state.rooms || 0}</p>
    </div>
  );
};
