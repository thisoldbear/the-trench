import { LAMP_TARGET, useGame } from "@/context/GameContext";
import { getPerkById } from "@/datasheets/perks";
import { memo, useMemo, useState } from "react";

export const Stats = memo(() => {
  const { state } = useGame();
  const [activePerkId, setActivePerkId] = useState<string | null>(null);

  // Temporary preview of perks if none acquired yet, allowing immediate UI inspection
  const displayedPerks =
    state.perks && state.perks.length > 0
      ? state.perks
      : ["ironclad", "sharpshooter", "bayonet-vigor"];

  const activePerk = useMemo(
    () => (activePerkId ? getPerkById(activePerkId) : null),
    [activePerkId],
  );

  const woundsGradient = useMemo(() => {
    const percent = (100 * state.player.wounds) / state.player.totalWounds;
    return `linear-gradient(90deg,#2d2d2d 0%, #2d2d2d ${percent}%, transparent ${percent}%)`;
  }, [state.player.wounds, state.player.totalWounds]);

  const nightsGradient = useMemo(() => {
    const percent = (100 * (state.night || 1)) / 5;
    return `linear-gradient(90deg,#2d2d2d 0%, #2d2d2d ${percent}%, transparent ${percent}%)`;
  }, [state.night]);

  const lampsGradient = useMemo(() => {
    const percent = (100 * state.rooms) / LAMP_TARGET;
    return `linear-gradient(90deg,#2d2d2d 0%, #2d2d2d ${percent}%, transparent ${percent}%)`;
  }, [state.rooms]);

  return (
    <div className="stats">
      <div
        className="stats__cell stats__cell--1"
        style={{
          background: woundsGradient,
        }}
      >
        <p>
          HP:{" "}
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
      <div
        className="stats__cell stats__cell--2"
        style={{
          background: nightsGradient,
        }}
      >
        <p>Night: {state.night || 1} / 5</p>
      </div>
      <div className="stats__cell stats__cell--3">
        <p>
          Toughness:{" "}
          <span
            style={{
              color:
                state.player.toughness > state.player.totalToughness
                  ? "#78a878"
                  : "inherit",
            }}
          >
            {state.player.toughness}
          </span>
        </p>
      </div>

      <div
        className="stats__cell stats__cell--4"
        style={{
          background: lampsGradient,
        }}
      >
        <p>Lamps lit: {state.rooms || 0} / {LAMP_TARGET}</p>
      </div>

      <div className="stats__cell stats__cell--5">
        <p>
          Damage Mod:
          {state.player.damageModifier === 0 ? (
            " -"
          ) : (
            <span
              style={{
                color: "#78a878",
              }}
            >
              {` `}+{state.player.damageModifier}
            </span>
          )}
        </p>
      </div>

      <div className="stats__cell stats__cell--6">
        <p>
          Hit Mod:
          {state.player.hitModifier === 0 ? (
            " -"
          ) : (
            <span
              style={{
                color: "#78a878",
              }}
            >
              {` `}+{state.player.hitModifier}
            </span>
          )}
        </p>
      </div>

      {displayedPerks && displayedPerks.length > 0 && (
        <div
          className="stats__perks"
          style={{
            gridColumn: "1 / 3",
            padding: "8px 10px",
            border: "1px dashed #3d3c3c",
            fontSize: "13px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "16px", color: "#ffffff", marginRight: "6px" }}>
              Perks:
            </span>
            {displayedPerks.map((pId) => {
              const perk = getPerkById(pId);
              const isActive = activePerkId === pId;
              return (
                <button
                  key={pId}
                  type="button"
                  title={perk?.description}
                  onClick={() =>
                    setActivePerkId((current) => (current === pId ? null : pId))
                  }
                  style={{
                    fontFamily: "inherit",
                    fontSize: "16px",
                    color: "inherit",
                    background: isActive ? "#333333" : "transparent",
                    border: isActive
                      ? "1px solid #ffffff"
                      : "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "2px 8px",
                    cursor: "pointer",
                    lineHeight: 1.3,
                  }}
                >
                  [{perk?.code ?? pId}] {perk?.name ?? pId}
                </button>
              );
            })}
          </div>

          {activePerk && (
            <div
              style={{
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px dashed #3d3c3c",
                fontSize: "13px",
                lineHeight: 1.4,
              }}
            >
              <strong style={{ color: "#ffffff" }}>
                [{activePerk.code}] {activePerk.name}:
              </strong>{" "}
              <span>{activePerk.description}</span>{" "}
              <em
                style={{
                  opacity: 0.6,
                  display: "block",
                  marginTop: "2px",
                  fontSize: "12px",
                }}
              >
                &ldquo;{activePerk.flavor}&rdquo;
              </em>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
