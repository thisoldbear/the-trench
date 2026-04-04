import { GameProvider, useGame } from "./context/GameContext";
import { enemies } from "./datasheets/enemies";
import { rooms } from "./datasheets/rooms";
import { traps } from "./datasheets/traps";
import "./index.css";

import { rollDice } from "./utils/rollDice";

function resolveDice(diceResult: number) {
  const secondDice = rollDice(20);

  if (diceResult <= 15) {
    console.log(rooms[0]);
    return;
  }

  if (diceResult <= 17) {
    console.log("Booty");
    return;
  }

  if (diceResult <= 18) {
    if (secondDice <= 14) {
      console.log(enemies[0]);
      return;
    }

    if (secondDice <= 15) {
      console.log(enemies[1]);
      return;
    }

    if (secondDice <= 16) {
      console.log(enemies[2]);
      return;
    }

    if (secondDice <= 17) {
      console.log(enemies[3]);
      return;
    }

    if (secondDice <= 18) {
      console.log(enemies[4]);
      return;
    }

    console.log(enemies[5]);
    return;
  }

  if (diceResult <= 19) {
    console.log(traps[0]);
    return;
  }

  console.log(traps[3]);

  return;
}

const DiceResult = () => {
  const { state } = useGame();

  return <>{state.diceResult}</>;
};

const RollDice = () => {
  const { dispatch } = useGame();

  return (
    <button
      onClick={() => {
        const diceResult = rollDice(20);

        resolveDice(diceResult);

        dispatch({
          type: "resolve_dice",
          payload: diceResult,
        });
      }}
    >
      Roll
    </button>
  );
};

export function App() {
  return (
    <GameProvider>
      <div className="app">
        <DiceResult />
        <RollDice />
      </div>
    </GameProvider>
  );
}

export default App;
