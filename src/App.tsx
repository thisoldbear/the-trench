import { GameProvider, useGame } from "./context/GameContext";
import { player } from "./datasheets/player";
import "./index.css";
import { fightLoop, hitOn } from "./utils/fight";

import { rollOnDecisionTable } from "./utils/resolveDice";

const Stats = () => {
  const { state } = useGame();

  return (
    <div>
      <p>
        {state.player.wounds} / {state.player.totalWounds}
      </p>
      <p>Lamps lit: {state.rooms || 0}</p>
    </div>
  );
};

const Inventory = () => {
  const { state, dispatch } = useGame();

  return (
    <div>
      <ul>
        {state.player.weapons.map((weapon) => {
          return (
            <li key={weapon.name}>
              <button
                onClick={() => {
                  dispatch({
                    type: "equipped_weapon_add",
                    payload: {
                      weapon,
                    },
                  });
                }}
              >
                {weapon.name === state.player.equippedWeapon?.name ? "👉🏻 " : ""}
                {weapon.name}
                {` `}
                S:{weapon.strength}
                {` `}
                D:D{weapon.damage}
                {` `}
                {weapon.damageModifier ? `+ ${weapon.damageModifier}` : ""}
                {weapon.limited && `(Single Use)`}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Message = () => {
  const { state } = useGame();

  if (state.message.length > 0) {
    return (
      <ul className="messages">
        {[...state.message].reverse().map((message) => (
          <li key={message}>
            <p>{message}</p>
          </li>
        ))}
      </ul>
    );
  }
};

const ActiveStep = () => {
  const { state, dispatch } = useGame();
  const { activeStep } = state;

  if (state.gameOver) {
    return <h1>Game Over</h1>;
  }

  if (activeStep?._type === "room") {
    return (
      <div>
        <h1>{activeStep.name}</h1>
        <p>{activeStep.description}</p>
        <Message />
        <button
          onClick={() => {
            dispatch({
              type: "active_step",
              payload: {
                activeStep: rollOnDecisionTable(),
                rooms: 1,
              },
            });
          }}
        >
          Light the lamp
        </button>
      </div>
    );
  }
  if (activeStep?._type === "enemy") {
    return (
      <div>
        <h1>{activeStep.name}</h1>
        <p>
          {activeStep.wounds} / {activeStep.totalWounds}
        </p>

        <p>
          Player:{" "}
          {hitOn(state.player.weapons[0]?.strength, activeStep.toughness)}+ to
          hit
        </p>

        <p>
          {activeStep.name}:{" "}
          {hitOn(activeStep.strength, state.player.toughness)}+ to hit
        </p>

        <Message />

        {activeStep.wounds > 0 ? (
          <>
            <button
              onClick={() => {
                fightLoop(state.player, activeStep, dispatch);
              }}
              disabled={!state.player.equippedWeapon}
            >
              Fight
            </button>

            <button
              onClick={() => {
                dispatch({
                  type: "active_step",
                  payload: {
                    activeStep: rollOnDecisionTable(),
                  },
                });
              }}
            >
              Retreat
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                dispatch({
                  type: "active_step",
                  payload: {
                    activeStep: rollOnDecisionTable(),
                  },
                });
              }}
            >
              Continue
            </button>
          </>
        )}
      </div>
    );
  }
  if (activeStep?._type === "trap") {
    return (
      <div>
        <h1>Trap</h1>
        <button
          onClick={() => {
            dispatch({
              type: "active_step",
              payload: {
                activeStep: rollOnDecisionTable(),
              },
            });
          }}
        >
          Continue
        </button>
        <Message />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          dispatch({
            type: "active_step",
            payload: {
              activeStep: rollOnDecisionTable(),
            },
          });
        }}
      >
        Enter The Trench
      </button>
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
