import type { Room } from "@/datasheets/rooms";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { useGame } from "@/context/GameContext";
import { rollDice } from "@/utils/rollDice";
import { removeTemporaryModifiers } from "@/utils/modifiers";
import { createMessage } from "@/utils/messages";

export const RoomStep = ({ room }: { room: Room }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h2 className="unifrakturcook-bold">{room.name}</h2>
      <p>{room.description}</p>
      <Message />
      <div className="btn-group">
        {room.name === "Dark Trench" && (
          <button
            className="btn btn--cta unifrakturcook-bold"
            onClick={() =>
              advanceStep({
                rooms: state.rooms + 1,
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
        )}
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

              advanceStep({
                messages: [createMessage(`Rolled D3: Dealt ${retreatDamage} damage`)],
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
          Continue
        </button>
      </div>
    </div>
  );
};
