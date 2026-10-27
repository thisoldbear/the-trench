import type { Enemy } from "@/datasheets/enemies";
import { useGame } from "@/context/GameContext";
import { fightLoop, hitOn } from "@/utils/fight";
import { rollDice } from "@/utils/rollDice";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { StepCounter } from "../components/StepCounter";
import { removeTemporaryModifiers } from "@/utils/modifiers";
import { createMessage } from "@/utils/messages";

export const EnemyStep = ({ enemy }: { enemy: Enemy }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();
  const equippedWeapon = state.player.weapons.find(
    (w) => w.uuid === state.player.equippedWeapon,
  );

  return (
    <div>
      <h2 className="unifrakturcook-bold step-title">
        {enemy.name} <StepCounter stepId={enemy.id} />
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
                if (state.rooms > 0) {
                  const newRoomCount = state.rooms - 1;

                  removeTemporaryModifiers(state.player, dispatch);

                  // Move on
                  advanceStep({
                    rooms: newRoomCount,
                    messages: [
                      createMessage("Fled from combat. A lamp went out."),
                    ],
                  });
                } else {
                  const fleeDamage = rollDice(3);

                  if (state.player.wounds - fleeDamage > 0) {
                    dispatch({
                      type: "player_wounded",
                      payload: {
                        wounds: state.player.wounds - fleeDamage,
                      },
                    });

                    removeTemporaryModifiers(state.player, dispatch);

                    // Move on
                    advanceStep({
                      rooms: 0,
                      messages: [
                        createMessage(
                          `Rolled D3: Fleeing dealt ${fleeDamage} damage`,
                        ),
                      ],
                    });
                  } else {
                    dispatch({
                      type: "player_wounded",
                      payload: { wounds: 0 },
                    });

                    dispatch({ type: "game_over" });
                  }
                }
              }}
            >
              Flee
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
