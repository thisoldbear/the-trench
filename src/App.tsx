import { useEffect, useState } from "react";
import pkg from "../package.json";
import { GameProvider, LAMP_TARGET, useGame } from "./context/GameContext";
import { createMessage } from "./utils/messages";
import { perks, getPerkById } from "./datasheets/perks";
import type { Enemy } from "./datasheets/enemies";
import type { Room } from "./datasheets/rooms";
import type { Trap } from "./datasheets/traps";
import type { Chest } from "./datasheets/chests";
import type { Pause } from "./datasheets/pause";
import "./index.css";
import { RoomStep } from "./steps/RoomStep";
import { EnemyStep } from "./steps/EnemyStep";
import { TrapStep } from "./steps/TrapStep";
import { ChestStep } from "./steps/ChestStep";
import { PauseStep } from "./steps/PauseStep";
import { Stats } from "./components/Stats";
import { Inventory } from "./components/Inventory";
import { Changelog } from "./components/Changelog";
import { PrintVersion } from "./components/PrintVersion";
import { useAdvanceStep } from "./hooks/useAdvanceStep";
import { Message } from "./components/Message";
import { AdvanceArrow } from "./components/AdvanceArrow";
import { Analytics } from "@vercel/analytics/react";

const ActiveStep = () => {
  const { state, dispatch } = useGame();
  const { activeStep } = state;
  const advanceStep = useAdvanceStep();

  if (state.rooms >= LAMP_TARGET) {
    if ((state.night ?? 1) >= 5) {
      return (
        <div className="game-end">
          <Stats />
          <h1 className="game-end__title unifrakturcook-bold">
            Dawn Breaks: The War Is Over
          </h1>
          <p>
            Against impossible odds, you have kept the lamps burning and survived all 5 harrowing nights in The Trench.
          </p>
          <p>
            The morning light pierces through the ruined fog and shattered earth. The sirens fall silent. You have reached <strong>The End</strong>.
          </p>
          <div className="chest__list" style={{ margin: "20px 0", textAlign: "left" }}>
            <div className="inventory__cell-title" style={{ fontSize: "18px", marginBottom: "12px" }}>
              Campaign Summary
            </div>
            <p>Nights Survived: 5 / 5</p>
            <p>Horrors Slain: {state.enemiesKilled || 0}</p>
            <p>
              Active Perks:{" "}
              {state.perks && state.perks.length > 0
                ? state.perks.map((p) => getPerkById(p)?.name).filter(Boolean).join(", ")
                : "None"}
            </p>
          </div>
          <p style={{ opacity: 0.6, fontSize: "12px" }}>Seed: {state.seed}</p>
          <Message />
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

    const currentNight = state.night ?? 1;
    const isFirstNight = currentNight === 1;
    const availablePerks = perks.filter((p) => !state.perks?.includes(p.id));
    const needsPerkSelection =
      (state.perks?.length ?? 0) < currentNight && availablePerks.length > 0;

    return (
      <div className="game-end">
        <Stats />
        <h1 className="game-end__title unifrakturcook-bold">
          {isFirstNight ? "The Night Passes" : `Night ${currentNight} Passes`}
        </h1>
        <p>
          {isFirstNight
            ? "Another long night has passed in The Trench."
            : `Against terrifying odds, you survived Night ${currentNight} in The Trench.`}
        </p>
        <p>Rest, while you can... dawn is fleeting and darkness will return.</p>

        {needsPerkSelection ? (
          <div style={{ margin: "20px 0", textAlign: "left" }}>
            <h2 className="unifrakturcook-bold step-title">
              Dawn {currentNight} Perk
            </h2>
            <p>
              Select 1 perk to strengthen your soldier for Night {currentNight + 1}:
            </p>
            <ul className="chest__list">
              {availablePerks.map((perk) => (
                <li key={perk.id} className="chest-item">
                  <div>
                    <div className="inventory__cell-title">
                      [{perk.code}] {perk.name}
                    </div>
                    <p>{perk.description}</p>
                    <p
                      style={{
                        fontSize: "13px",
                        opacity: 0.6,
                        fontStyle: "italic",
                        marginTop: "4px",
                      }}
                    >
                      &ldquo;{perk.flavor}&rdquo;
                    </p>
                  </div>
                  <div>
                    <button
                      className="btn btn--cta unifrakturcook-bold"
                      onClick={() => {
                        dispatch({
                          type: "perk_select",
                          payload: {
                            perkId: perk.id,
                            messages: [
                              createMessage(
                                `Acquired Dawn Perk: [${perk.code}] ${perk.name} - ${perk.description}`,
                              ),
                            ],
                          },
                        });
                      }}
                    >
                      Claim
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ margin: "20px 0", textAlign: "left" }}>
            <p style={{ color: "#78a878", marginBottom: "12px" }}>
              ✓ Dawn Perk selected for Night {currentNight + 1}. Ready to advance into the dark.
            </p>
            {state.perks && state.perks.length > 0 && (
              <ul className="chest__list">
                {state.perks.map((pId) => {
                  const perk = getPerkById(pId);
                  if (!perk) return null;
                  return (
                    <li key={perk.id} className="chest-item">
                      <div>
                        <div className="inventory__cell-title">
                          [{perk.code}] {perk.name}
                        </div>
                        <p>{perk.description}</p>
                      </div>
                      <div>
                        <button className="btn btn--cta unifrakturcook-bold" disabled>
                          Claimed
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <p style={{ opacity: 0.6, fontSize: "12px" }}>Seed: {state.seed}</p>
        <Message />
        <div className="btn-group">
          <button
            className="btn btn--cta unifrakturcook-bold"
            disabled={needsPerkSelection}
            onClick={() => {
              advanceStep({
                fightOn: true,
                messages: [
                  createMessage(
                    `You steel your nerves to fight on for Night ${currentNight + 1}${
                      isFirstNight ? " (+1 Toughness, Max HP increased to 20)" : ""
                    }.`,
                  ),
                ],
              });
            }}
          >
            Fight on for Night {currentNight + 1} <AdvanceArrow />
          </button>
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
        <p style={{ opacity: 0.6, fontSize: "12px" }}>Seed: {state.seed}</p>
        <Message />
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

  if (activeStep?._type === "pause") {
    return (
      <>
        <Stats />
        <PauseStep key={state.activeStepUuid} pause={activeStep as Pause} />
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
          Enter The Trench <AdvanceArrow />
        </button>
      </div>
      <Inventory />
    </>
  );
};

const FooterSeed = () => {
  const { state } = useGame();
  return (
    <p>
      Seed:{" "}
      <a
        href={`?seed=${encodeURIComponent(state.seed)}`}
        title="Share or replay this seed"
        style={{ textDecoration: "underline dotted" }}
      >
        {state.seed}
      </a>
    </p>
  );
};

export function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, "", to);
      setPathname(to);
    }
  };

  return (
    <GameProvider>
      <div className="app">
        <h1 className="app__title unifrakturcook-bold">The Trench</h1>
        <div className="app__container">
          {pathname === "/changelog" ? (
            <Changelog onBack={() => navigate("/")} />
          ) : pathname === "/print" ? (
            <PrintVersion onBack={() => navigate("/")} />
          ) : (
            <ActiveStep />
          )}
        </div>
        <div className="footer">
          <p>Created by Daniel Williams</p>
          <p>Inspired by</p>
          <p>
            <a href="https://darkfort.caffeine.computer">Dark Fort</a>
            {` `}✜{` `}
            <a href="https://www.trenchcrusade.com/">Trench Crusade</a>
          </p>
          <FooterSeed />
          <p>
            <a
              href="/changelog"
              onClick={(e) => {
                e.preventDefault();
                navigate("/changelog");
              }}
            >
              {pkg.version}
            </a>
            {` `}✜{` `}
            <a
              href="https://github.com/thisoldbear/the-trench"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
          <p>
            <a
              href="/print"
              onClick={(e) => {
                e.preventDefault();
                navigate("/print");
              }}
            >
              Print Version
            </a>
          </p>
        </div>
      </div>
      <Analytics />
    </GameProvider>
  );
}

export default App;
