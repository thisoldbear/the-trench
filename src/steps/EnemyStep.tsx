import type { Enemy } from "@/datasheets/enemies";
import { useGame } from "@/context/GameContext";
import { fightLoop, hitOn } from "@/utils/fight";
import { rollDice } from "@/utils/rollDice";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";

export const EnemyStep = ({ enemy }: { enemy: Enemy }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();
  const equippedWeapon = state.player.weapons.find(
    (w) => w.id === state.player.equippedWeapon,
  );

  return (
    <div>
      <h1>{enemy.name}</h1>
      <p>
        {enemy.wounds} / {enemy.totalWounds}
      </p>

      {equippedWeapon && (
        <p>Player: {hitOn(equippedWeapon.strength, enemy.toughness)}+ to hit</p>
      )}

      <p>
        {enemy.name}: {hitOn(enemy.strength, state.player.toughness)}+ to hit
      </p>

      <Message />

      {enemy.wounds > 0 ? (
        <div className="button-group">
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

                advanceStep({
                  messages: [
                    {
                      id: crypto.randomUUID(),
                      text: `Rolled D3: Retreat dealt ${retreatDamage} damage`,
                    },
                  ],
                });

                if (state.player.damageModifier > 0) {
                  dispatch({
                    type: "player_damage_remove",
                    payload: {
                      damageModifier: 0,
                      messages: [
                        {
                          id: crypto.randomUUID(),
                          text: `Damage modifier removed`,
                        },
                      ],
                    },
                  });
                }
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
        </div>
      ) : (
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() => advanceStep()}
        >
          Continue
        </button>
      )}
    </div>
  );
};
