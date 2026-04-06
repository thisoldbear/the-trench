import type { Enemy } from "@/datasheets/enemies";
import { player, type Player } from "@/datasheets/player";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { weapons, type Weapon } from "@/datasheets/weapons";
import { loadout } from "@/utils/loadout";
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

export type GameState = {
  player: Player;
  rooms: any;
  activeStep: null | Room | Enemy | Trap;
  messages: {
    id: string;
    text: string;
  }[];
  gameOver: boolean;
};

export type GameAction =
  | {
      type: "active_step";
      payload: {
        activeStep: GameState["activeStep"];
        messages?: GameState["messages"];
        rooms?: number;
      };
    }
  | {
      type: "player_wounded";
      payload: {
        wounds: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "enemy_wounded";
      payload: {
        wounds: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "enemy_defeated";
      payload: {
        wounds: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "equipped_weapon_add";
      payload: {
        weapon: Weapon;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "equipped_weapon_remove";
      payload: {
        weapon: Weapon;
        messages?: GameState["messages"];
      };
    }
  | { type: "game_over" };

const initialState: GameState = {
  player: {
    ...player,
    weapons: loadout(),
  },
  rooms: null,
  activeStep: null,
  gameOver: false,
  messages: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "active_step":
      return {
        ...state,
        activeStep: action.payload.activeStep,
        messages: action.payload.messages ? [...action.payload.messages] : [],
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
        messages: [...state.messages, ...(action.payload.messages || [])],
      };

    case "enemy_wounded": {
      if (state.activeStep?._type === "enemy") {
        return {
          ...state,
          activeStep: {
            ...state.activeStep,
            wounds: action.payload.wounds,
          },
          messages: [...state.messages, ...(action.payload.messages || [])],
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
          messages: [...state.messages, ...(action.payload.messages || [])],
        };
      }
      return state;
    }

    case "equipped_weapon_add": {
      return {
        ...state,
        player: {
          ...state.player,
          equippedWeapon: action.payload.weapon,
        },
      };
    }

    case "equipped_weapon_remove": {
      return {
        ...state,
        player: {
          ...state.player,
          weapons: [...state.player.weapons].filter(
            (weapon) => weapon.name !== action.payload.weapon.name,
          ),
          equippedWeapon: null,
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };
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
