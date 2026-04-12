import type { Room } from "@/datasheets/rooms";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { useGame } from "@/context/GameContext";
import { rollDice } from "@/utils/rollDice";

export const RoomStep = ({ room }: { room: Room }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h1 className="unifrakturcook-bold">{room.name}</h1>
      <p>{room.description}</p>
      <Message />
      <div className="btn-group">
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() =>
            advanceStep({
              rooms: 1,
              messages: [
                {
                  id: crypto.randomUUID(),
                  text: `Lit the lamp`,
                },
              ],
            })
          }
        >
          Light the lamp
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
                    text: `Rolled D3: Dealt ${retreatDamage} damage`,
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
          Continue
        </button>
      </div>
    </div>
  );
};
