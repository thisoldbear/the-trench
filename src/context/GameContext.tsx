import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Equipment } from "@/datasheets/equipment";
import { player, type Player } from "@/datasheets/player";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { weapons, type Weapon } from "@/datasheets/weapons";
import { equipmentLoadout, weaponsLoadout } from "@/utils/loadout";
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
  activeStep: null | Room | Enemy | Trap | Chest;
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
      type: "player_restored";
      payload: {
        wounds: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "player_toughness_add";
      payload: {
        toughness: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "player_toughness_remove";
      payload: {
        toughness: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "player_damage_add";
      payload: {
        damageModifier: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "player_damage_remove";
      payload: {
        damageModifier: number;
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
        weaponId: Weapon["id"];
        messages?: GameState["messages"];
      };
    }
  | {
      type: "equipped_weapon_remove_ammo";
      payload: {
        messages?: GameState["messages"];
      };
    }
  | {
      type: "equipped_weapon_remove";
      payload: {
        messages?: GameState["messages"];
      };
    }
  | {
      type: "equipment_add";
      payload: {
        equipment: Equipment;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "equipment_remove";
      payload: {
        equipment: Equipment[];
        messages?: GameState["messages"];
      };
    }
  | {
      type: "weapon_add";
      payload: {
        weapon: Weapon;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "weapon_remove";
      payload: {
        weapon: Weapon[];
        messages?: GameState["messages"];
      };
    }
  | { type: "game_over" };

const initialState: GameState = {
  player: {
    ...player,
    weapons: weaponsLoadout(),
    equipment: equipmentLoadout(),
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

    case "player_toughness_add":
      return {
        ...state,
        player: {
          ...state.player,
          toughness: action.payload.toughness,
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };

    case "player_toughness_remove":
      return {
        ...state,
        player: {
          ...state.player,
          toughness: action.payload.toughness,
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };

    case "player_damage_add":
      return {
        ...state,
        player: {
          ...state.player,
          damageModifier: action.payload.damageModifier,
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };

    case "player_damage_remove":
      return {
        ...state,
        player: {
          ...state.player,
          damageModifier: action.payload.damageModifier,
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };

    case "player_restored":
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
        const enemy = state.activeStep as Enemy;
        return {
          ...state,
          activeStep: {
            ...enemy,
            wounds: action.payload.wounds,
          },
          messages: [...state.messages, ...(action.payload.messages || [])],
        };
      }

      return state;
    }

    case "enemy_defeated": {
      if (state.activeStep?._type === "enemy") {
        const enemy = state.activeStep as Enemy;
        return {
          ...state,
          activeStep: {
            ...enemy,
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
          equippedWeapon: action.payload.weaponId,
        },
      };
    }

    case "equipped_weapon_remove": {
      return {
        ...state,
        player: {
          ...state.player,
          weapons: [...state.player.weapons].filter(
            (weapon) => weapon.id !== state.player.equippedWeapon,
          ),
          equippedWeapon: null,
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };
    }

    case "equipped_weapon_remove_ammo": {
      return {
        ...state,
        player: {
          ...state.player,
          weapons: [...state.player.weapons].reduce(
            (acc: Weapon[], curr: Weapon) => {
              if (curr.id === state.player.equippedWeapon && curr.ammo > 0) {
                return [
                  ...acc,
                  {
                    ...curr,
                    ammo: curr.ammo > 1 ? curr.ammo - 1 : 0,
                  },
                ];
              } else {
                return [...acc, curr];
              }
            },
            [],
          ),
        },
        messages: [...state.messages, ...(action.payload.messages || [])],
      };
    }

    case "equipment_add": {
      return {
        ...state,
        player: {
          ...state.player,
          equipment: [...state.player.equipment, action.payload.equipment],
        },
      };
    }

    case "equipment_remove": {
      return {
        ...state,
        player: {
          ...state.player,
          equipment: action.payload.equipment,
        },
      };
    }
    case "weapon_add": {
      return {
        ...state,
        player: {
          ...state.player,
          weapons: [...state.player.weapons, action.payload.weapon],
        },
      };
    }

    case "weapon_remove": {
      return {
        ...state,
        player: {
          ...state.player,
          weapons: action.payload.weapon,
        },
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
