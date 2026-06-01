import type { Enemy } from "@/datasheets/enemies";
import { useGame } from "@/context/GameContext";
import { fightLoop, hitOn } from "@/utils/fight";
import { rollDice } from "@/utils/rollDice";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { StepCounter } from "../components/StepCounter";
import { removeTemporaryModifiers } from "@/utils/modifiers";

export const EnemyStep = ({ enemy }: { enemy: Enemy }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();
  const equippedWeapon = state.player.weapons.find(
    (w) => w.uuid === state.player.equippedWeapon,
  );

  return (
    <div>
      <h2 className="unifrakturcook-bold step-title">
        {enemy.name} <StepCounter />
      </h2>
      <p>
        HP:{" "}
        <span
          style={{
            color: enemy.wounds < enemy.totalWounds / 2 ? "#b9818e" : "inherit",
          }}
        >
          {enemy.wounds}
        </span>{" "}
        / {enemy.totalWounds}
      </p>

      {equippedWeapon && (
        <p>
          You need {hitOn(equippedWeapon.strength, enemy.toughness)}+ on a D6 to
          hit.
        </p>
      )}

      <Message />

      <div className="btn-group">
        {enemy.wounds > 0 ? (
          <>
            <button
              className="btn btn--cta unifrakturcook-bold"
              onClick={() => fightLoop(state.player, enemy, dispatch)}
              disabled={!equippedWeapon || equippedWeapon.ammo === 0}
            >
              Fight
            </button>

            <button
              className="btn btn--cta unifrakturcook-bold"
              onClick={() => {
                const retreatDamage = rollDice(3);

                if (state.player.wounds - retreatDamage > 0) {
                  dispatch({
                    type: "player_wounded",
                    payload: {
                      wounds: state.player.wounds - retreatDamage,
                    },
                  });

                  removeTemporaryModifiers(state.player, dispatch);

                  // Move on
                  advanceStep({
                    messages: [
                      {
                        id: crypto.randomUUID(),
                        text: `Rolled D3: Retreat dealt ${retreatDamage} damage`,
                      },
                    ],
                  });
                } else {
                  dispatch({
                    type: "player_wounded",
                    payload: { wounds: 0 },
                  });

                  dispatch({ type: "game_over" });
                }
              }}
            >
              Retreat
            </button>
          </>
        ) : (
          <button
            className="btn btn--cta unifrakturcook-bold"
            onClick={() => advanceStep()}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};
