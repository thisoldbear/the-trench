import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

type GameState = {
  diceResult: number | null;
};

type GameAction = { type: "resolve_dice"; payload: number };

const initialState: GameState = {
  diceResult: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "resolve_dice":
      return { ...state, diceResult: action.payload };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
