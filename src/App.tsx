import { useEffect, useRef } from "react";
import { GameProvider, useGame } from "./context/GameContext";
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
  const lastStepRef = useRef(activeStep);

  useEffect(() => {
    if (activeStep === lastStepRef.current) return;
    lastStepRef.current = activeStep;

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
                text: `Trap dealt ${trapDamage} wounds.`,
              },
            ],
          },
        });
      }
    }
  }, [activeStep]);

  if (state.gameOver) {
    return <h1>Game Over</h1>;
  }

  if (activeStep?._type === "room") {
    return <RoomStep room={activeStep as Room} />;
  }

  if (activeStep?._type === "enemy") {
    return <EnemyStep enemy={activeStep as Enemy} />;
  }

  if (activeStep?._type === "trap") {
    return <TrapStep trap={activeStep as Trap} />;
  }

  if (activeStep?._type === "chest") {
    return <ChestStep chest={activeStep as Chest} />;
  }

  return (
    <div>
      <button onClick={() => advanceStep()}>Enter The Trench</button>
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <div className="app">
        <Stats />
        <ActiveStep />
        <Inventory />
      </div>
    </GameProvider>
  );
}

export default App;
