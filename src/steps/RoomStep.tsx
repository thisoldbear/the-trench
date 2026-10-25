import type { Room } from "@/datasheets/rooms";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { useGame, LAMP_TARGET } from "@/context/GameContext";
import { rollDice } from "@/utils/rollDice";
import { removeTemporaryModifiers } from "@/utils/modifiers";
import { createMessage } from "@/utils/messages";
import { StepCounter } from "../components/StepCounter";

export const RoomStep = ({ room }: { room: Room }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h2 className="unifrakturcook-bold step-title">
        {room.name} <StepCounter stepId={room.id} />
      </h2>
      <p>{room.description}</p>
      <Message />
      <div className="btn-group">
        {room.name === "Dark Trench" ? (
          <>
            <button
              className="btn btn--cta unifrakturcook-bold"
              onClick={() => {
                const newRoomCount = state.rooms + 1;

                // If lighting this lamp wins the game, don't advance to next step
                if (newRoomCount >= LAMP_TARGET) {
                  dispatch({
                    type: "rooms_increment",
                    payload: {
                      rooms: newRoomCount,
                      messages: [createMessage("Lit the lamp")],
                    },
                  });
                } else {
                  advanceStep({
                    rooms: newRoomCount,
                    messages: [createMessage("Lit the lamp")],
                  });
                }
              }}
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

                  removeTemporaryModifiers(state.player, dispatch);

                  advanceStep({
                    messages: [
                      createMessage(`Rolled D3: Dealt ${retreatDamage} damage`),
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
              Continue
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
