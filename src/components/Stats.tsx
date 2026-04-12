import { useGame } from "@/context/GameContext";

export const Stats = () => {
  const { state } = useGame();

  return (
    <div className="stats">
      <div className="stats__cell stats__cell--1">
        <p>
          Health:{" "}
          <span
            style={{
              color:
                state.player.wounds < 5
                  ? "#b9818e"
                  : state.player.wounds > state.player.totalWounds
                    ? "#81b981"
                    : "inherit",
            }}
          >
            {state.player.wounds}
          </span>{" "}
          / {state.player.totalWounds}
        </p>
      </div>
      <div className="stats__cell stats__cell--2">
        <p>
          Toughness:{" "}
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
      </div>
      <div className="stats__cell stats__cell--3">
        <p>Lamps lit: {state.rooms || 0}</p>
      </div>
      <div className="stats__cell stats__cell--4">
        <p>
          Damage Mod:
          {state.player.damageModifier === 0
            ? " -"
            : `+ ${state.player.damageModifier}`}
        </p>
      </div>
    </div>
  );
};
