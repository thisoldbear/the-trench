import { useEffect } from "react";
import { GameProvider, LAMP_TARGET, useGame } from "./context/GameContext";
import type { Enemy } from "./datasheets/enemies";
import type { Room } from "./datasheets/rooms";
import type { Trap } from "./datasheets/traps";
import type { Chest } from "./datasheets/chests";
import "./index.css";
import { rollDice } from "./utils/rollDice";
import { RoomStep } from "./steps/RoomStep";
import { EnemyStep } from "./steps/EnemyStep";
import { TrapStep } from "./steps/TrapStep";
import { ChestStep } from "./steps/ChestStep";
import { Stats } from "./components/Stats";
import { Inventory } from "./components/Inventory";
import { useAdvanceStep } from "./hooks/useAdvanceStep";

const ActiveStep = () => {
  const { state, dispatch } = useGame();
  const { activeStep } = state;
  const advanceStep = useAdvanceStep();

  useEffect(() => {
    if (activeStep?._type === "room" && activeStep.name === "Chapel") {
      dispatch({
        type: "player_restored",
        payload: {
          wounds:
            state.player.wounds === state.player.totalWounds
              ? state.player.totalWounds + 2
              : state.player.totalWounds,
          messages: [
            {
              id: crypto.randomUUID(),
              text:
                state.player.wounds === state.player.totalWounds
                  ? `You prayed. Blessed with +2 health.`
                  : `You prayed. Health restored.`,
            },
          ],
        },
      });
    } else if (activeStep?._type === "trap") {
      const trapDamage = rollDice(3);

      if (state.player.wounds - trapDamage <= 0) {
        dispatch({ type: "game_over" });
      } else {
        dispatch({
          type: "player_wounded",
          payload: {
            wounds: state.player.wounds - trapDamage,
            messages: [
              {
                id: crypto.randomUUID(),
                text: `${activeStep.name} dealt ${trapDamage} wounds.`,
              },
            ],
          },
        });
      }
    }
  }, [activeStep]);

  if (state.rooms >= LAMP_TARGET) {
    return (
      <div className="game-end">
        <Stats />
        <h1 className="game-end__title unifrakturcook-bold">
          The Night Passes
        </h1>
        <p>Another long night has passed in The Trench.</p>
        <p>Rest, while you can... darkness is already descending.</p>

        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() =>
            dispatch({
              type: "restart",
            })
          }
        >
          Rise, once more
        </button>
      </div>
    );
  }

  if (state.gameOver) {
    return (
      <div className="game-over">
        <Stats />
        <h1 className="game-over__title unifrakturcook-bold">You Died</h1>
        <p>
          A valiant effort. Let us pray other brave individuals will continue to
          keep the lamps lit each night.
        </p>

        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() =>
            dispatch({
              type: "restart",
            })
          }
        >
          Try again
        </button>
      </div>
    );
  }

  if (activeStep?._type === "room") {
    return (
      <>
        <Stats />
        <RoomStep key={state.activeStepUuid} room={activeStep as Room} />
        <Inventory />
      </>
    );
  }

  if (activeStep?._type === "enemy") {
    return (
      <>
        <Stats />
        <EnemyStep key={state.activeStepUuid} enemy={activeStep as Enemy} />
        <Inventory />
      </>
    );
  }

  if (activeStep?._type === "trap") {
    return (
      <>
        <Stats />
        <TrapStep key={state.activeStepUuid} trap={activeStep as Trap} />
        <Inventory />
      </>
    );
  }

  if (activeStep?._type === "chest") {
    return (
      <>
        <Stats />
        <ChestStep key={state.activeStepUuid} chest={activeStep as Chest} />
        <Inventory />
      </>
    );
  }

  return (
    <>
      <Stats />
      <div className="start germania-one-regular">
        <h2 className="unifrakturcook-bold">Darkness Falls</h2>
        <p>
          After the horrors of the day, darkness falls once more on The Trench.
        </p>
        <p>To ward off the terror, prayers are made and lamps are lit.</p>
        <p>And every night... they come.</p>
        <p>
          Light <u>{LAMP_TARGET}</u> lamps to see out the night.
        </p>
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() => {
            advanceStep();
          }}
        >
          Enter The Trench
        </button>
      </div>
      <Inventory />
    </>
  );
};

export function App() {
  return (
    <GameProvider>
      <div className="app">
        <h1 className="app__title unifrakturcook-bold">The Trench</h1>
        <div className="app__container">
          <ActiveStep />
        </div>
        <div className="footer">
          <p>
            Inspired by{" "}
            <a href="https://darkfort.caffeine.computer">Dark Fort</a>
          </p>
          <p>Version: Beta</p>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
