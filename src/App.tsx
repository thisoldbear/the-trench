import { useEffect, useRef } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import type { Enemy } from "./datasheets/enemies";
import type { Room } from "./datasheets/rooms";
import type { Trap } from "./datasheets/traps";
import "./index.css";
import { fightLoop, hitOn } from "./utils/fight";
import { rollOnDecisionTable } from "./utils/resolveDice";
import { rollDice } from "./utils/rollDice";

const Stats = () => {
  const { state } = useGame();

  return (
    <div>
      <p>
        <span
          style={{
            color:
              state.player.wounds > state.player.totalWounds
                ? "green"
                : "inherit",
          }}
        >
          {state.player.wounds}
        </span>{" "}
        / {state.player.totalWounds}
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
        {state.player.weapons.map((weapon) => (
          <li key={weapon.name}>
            <button
              disabled={weapon.ammo <= 0}
              onClick={() => {
                dispatch({
                  type: "equipped_weapon_add",
                  payload: { weaponId: weapon.id },
                });
              }}
            >
              {weapon.id === state.player.equippedWeapon ? "👉🏻 " : ""}
              {weapon.name}
              {` `}
              S:{weapon.strength}
              {` `}
              D:D{weapon.damage}
              {` `}
              {weapon.damageModifier ? `+ ${weapon.damageModifier}` : ""}
              {` `}
              {weapon.limited && weapon.ammo === 1 && `[x1]`}
              {weapon.limited && weapon.ammo > 1 && `[x${weapon.ammo}]`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Message = () => {
  const { state } = useGame();

  if (state.messages.length > 0) {
    return (
      <ul className="messages">
        {[...state.messages].reverse().map((message) => (
          <li key={message.id}>
            <p>{message.text}</p>
          </li>
        ))}
      </ul>
    );
  }
};

function useAdvanceStep() {
  const { dispatch } = useGame();
  return (opts?: {
    rooms?: number;
    messages?: { id: string; text: string }[];
  }) => {
    dispatch({
      type: "active_step",
      payload: {
        // TODO: Fix !
        activeStep: rollOnDecisionTable()!,
        ...opts,
      },
    });
  };
}

const RoomStep = ({ room }: { room: Room }) => {
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <Message />
      <button onClick={() => advanceStep({ rooms: 1 })}>Light the lamp</button>
    </div>
  );
};

const EnemyStep = ({ enemy }: { enemy: Enemy }) => {
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

      <p>Player: {hitOn(equippedWeapon?.strength, enemy.toughness)}+ to hit</p>

      <p>
        {enemy.name}: {hitOn(enemy.strength, state.player.toughness)}+ to hit
      </p>

      <Message />

      {enemy.wounds > 0 ? (
        <>
          <button
            onClick={() => fightLoop(state.player, enemy, dispatch)}
            disabled={!equippedWeapon || equippedWeapon.ammo === 0}
          >
            Fight
          </button>

          <button
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
        <button onClick={() => advanceStep()}>Continue</button>
      )}
    </div>
  );
};

const TrapStep = ({ trap }: { trap: Trap }) => {
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h1>{trap.name}</h1>
      <p>{trap.description}</p>
      <button onClick={() => advanceStep()}>Continue</button>
      <Message />
    </div>
  );
};

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
    return <>CHest</>;
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
