import type { Enemy } from "@/datasheets/enemies";
import { player } from "@/datasheets/player";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

export type GameState = {
  player: any;
  rooms: any;
  activeStep: null | Room | Enemy | Trap;
  message: string[];
  gameOver: boolean;
};

export type GameAction =
  | {
      type: "active_step";
      payload: {
        activeStep: GameState["activeStep"];
        message?: string[];
        rooms?: number;
      };
    }
  | {
      type: "player_wounded";
      payload: {
        wounds: number;
        message?: string[];
      };
    }
  | {
      type: "enemy_wounded";
      payload: {
        wounds: number;
        message?: string[];
      };
    }
  | {
      type: "enemy_defeated";
      payload: {
        wounds: number;
        message?: string[];
      };
    }
  | { type: "game_over" };

const initialState: GameState = {
  player: player,
  rooms: null,
  activeStep: null,
  gameOver: false,
  message: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "active_step":
      return {
        ...state,
        activeStep: action.payload.activeStep,
        message: action.payload.message ? [...action.payload.message] : [],
        rooms: action.payload.rooms
          ? state.rooms + action.payload.rooms
          : state.rooms,
      };

    case "player_wounded":
      return {
        ...state,
        player: {
          ...state.player,
          wounds: action.payload.wounds,
        },
        message: action.payload.message
          ? [...state.message, ...action.payload.message]
          : state.message,
      };

    case "enemy_wounded": {
      if (state.activeStep?._type === "enemy") {
        return {
          ...state,
          activeStep: {
            ...state.activeStep,
            wounds: action.payload.wounds,
          },
          message: action.payload.message
            ? [...state.message, ...action.payload.message]
            : state.message,
        };
      }

      return state;
    }

    case "enemy_defeated": {
      if (state.activeStep?._type === "enemy") {
        return {
          ...state,
          activeStep: {
            ...state.activeStep,
            wounds: action.payload.wounds,
          },
          message: action.payload.message
            ? [...state.message, ...action.payload.message]
            : state.message,
        };
      }
      return state;
    }

    case "game_over":
      return {
        ...state,
        gameOver: true,
        player: {
          ...state.player,
          wounds: 0,
        },
      };
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
