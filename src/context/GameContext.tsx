import type { Chest } from "@/datasheets/chests";
import type { Enemy } from "@/datasheets/enemies";
import type { Equipment } from "@/datasheets/equipment";
import { player, type Player } from "@/datasheets/player";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import type { Pause } from "@/datasheets/pause";
import { weapons, type Weapon } from "@/datasheets/weapons";
import { equipmentLoadout, weaponsLoadout } from "@/utils/loadout";
import { generateRandomSeed, setSeed } from "@/utils/rollDice";
import { createMessage } from "@/utils/messages";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

export const LAMP_TARGET = 13;

export type GameState = {
  player: Player;
  rooms: number;
  activeStep: null | Room | Enemy | Trap | Chest | Pause;
  activeStepUuid: string | null;
  messages: {
    id: string;
    text: string;
  }[];
  gameOver: boolean;
  enemiesKilled: number;
  enemiesDefeatedCount: number;
  hasPaused: boolean;
  steps: number;
  seed: number | string;
  night: number;
  perks: string[];
  lastStandUsedThisNight: boolean;
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
      type: "player_hit_modifier_add";
      payload: {
        hitModifier: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "player_hit_modifier_remove";
      payload: {
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
        weaponId: Weapon["uuid"];
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
      type: "restart";
      payload?: {
        seed?: number | string;
      };
    }
  | { type: "game_over" }
  | {
      type: "rooms_increment";
      payload: {
        rooms: number;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "fight_on_another_night";
      payload?: {
        activeStep?: GameState["activeStep"];
        messages?: GameState["messages"];
        perkId?: string;
      };
    }
  | {
      type: "perk_select";
      payload: {
        perkId: string;
        messages?: GameState["messages"];
      };
    }
  | {
      type: "last_stand_used";
      payload?: {
        messages?: GameState["messages"];
      };
    };

export const MAX_MESSAGES = 50;

export function appendMessages(
  existing: GameState["messages"],
  incoming?: GameState["messages"],
): GameState["messages"] {
  if (!incoming || incoming.length === 0) return existing;
  const combined = [...existing, ...incoming];
  return combined.length > MAX_MESSAGES ? combined.slice(-MAX_MESSAGES) : combined;
}

export const generateInitialState = (seed?: number | string) => {
  const activeSeed = seed !== undefined ? seed : generateRandomSeed();
  setSeed(activeSeed);

  const initialWeapons = weaponsLoadout();
  const initialEquipment = equipmentLoadout();

  const initialState: GameState = {
    player: {
      ...player,
      weapons: initialWeapons,
      equipment: initialEquipment,
      equippedWeapon: initialWeapons[0]?.uuid ?? null,
    },
    rooms: 0,
    activeStep: null,
    activeStepUuid: null,
    gameOver: false,
    messages: [],
    enemiesKilled: 0,
    enemiesDefeatedCount: 0,
    hasPaused: false,
    steps: 0,
    seed: activeSeed,
    night: 1,
    perks: [],
    lastStandUsedThisNight: false,
  };

  return initialState;
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "active_step": {
      const isEnemy = action.payload.activeStep?._type === "enemy";
      const isPause = action.payload.activeStep?._type === "pause";
      const resetEnemyCount = isEnemy && state.hasPaused;

      return {
        ...state,
        activeStep: action.payload.activeStep,
        activeStepUuid: crypto.randomUUID(),
        messages: appendMessages(state.messages, action.payload.messages),
        rooms: action.payload.rooms ?? state.rooms,
        steps: state.steps + 1,
        hasPaused: isPause ? true : resetEnemyCount ? false : state.hasPaused,
        enemiesDefeatedCount: resetEnemyCount ? 0 : state.enemiesDefeatedCount,
      };
    }

    case "player_wounded":
      return {
        ...state,
        player: {
          ...state.player,
          wounds: action.payload.wounds,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_toughness_add":
      return {
        ...state,
        player: {
          ...state.player,
          toughness: action.payload.toughness,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_toughness_remove":
      return {
        ...state,
        player: {
          ...state.player,
          toughness: action.payload.toughness,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_hit_modifier_add":
      return {
        ...state,
        player: {
          ...state.player,
          hitModifier: action.payload.hitModifier,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_hit_modifier_remove":
      return {
        ...state,
        player: {
          ...state.player,
          hitModifier: 0,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_damage_add":
      return {
        ...state,
        player: {
          ...state.player,
          damageModifier: action.payload.damageModifier,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_damage_remove":
      return {
        ...state,
        player: {
          ...state.player,
          damageModifier: action.payload.damageModifier,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "player_restored":
      return {
        ...state,
        player: {
          ...state.player,
          wounds: action.payload.wounds,
        },
        messages: appendMessages(state.messages, action.payload.messages),
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
          messages: appendMessages(state.messages, action.payload.messages),
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
          messages: appendMessages(state.messages, action.payload.messages),
          enemiesKilled: state.enemiesKilled + 1,
          enemiesDefeatedCount: state.enemiesDefeatedCount + 1,
        };
      }
      return state;
    }

    case "equipped_weapon_add": {
      return {
        ...state,
        player: {
          ...state.player,
          ...(action.payload.weaponId
            ? {
                equippedWeapon: action.payload.weaponId,
              }
            : {}),
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };
    }

    case "equipped_weapon_remove_ammo": {
      const updatedWeapons = [...state.player.weapons]
        .reduce((acc: Weapon[], curr: Weapon) => {
          if (curr.uuid === state.player.equippedWeapon && curr.ammo > 0) {
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
        }, [])
        .filter((weapon) => weapon.ammo > 0);

      const validEquippedWeapon = updatedWeapons.find(w => w.uuid === state.player.equippedWeapon)?.uuid
        ?? updatedWeapons[0]?.uuid
        ?? null;

      return {
        ...state,
        player: {
          ...state.player,
          weapons: updatedWeapons,
          equippedWeapon: validEquippedWeapon,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };
    }

    case "equipment_add": {
      return {
        ...state,
        player: {
          ...state.player,
          equipment: [
            ...state.player.equipment,
            {
              ...action.payload.equipment,
              uuid: crypto.randomUUID(),
            },
          ],
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };
    }

    case "equipment_remove": {
      return {
        ...state,
        player: {
          ...state.player,
          equipment: action.payload.equipment,
        },
        messages: appendMessages(state.messages, action.payload.messages),
      };
    }

    case "weapon_add": {
      return {
        ...state,
        player: {
          ...state.player,
          weapons: [
            ...state.player.weapons,
            { ...action.payload.weapon, uuid: crypto.randomUUID() },
          ],
        },
        messages: appendMessages(state.messages, action.payload.messages),
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

    case "rooms_increment":
      return {
        ...state,
        rooms: action.payload.rooms,
        messages: appendMessages(state.messages, action.payload.messages),
      };

    case "fight_on_another_night": {
      const nextNight = state.night + 1;
      const isFirstNightClear = state.night === 1;
      const newToughness = isFirstNightClear
        ? state.player.totalToughness + 1
        : state.player.totalToughness;
      const newTotalWounds = isFirstNightClear ? 20 : state.player.totalWounds;
      const newWounds = isFirstNightClear ? 20 : state.player.totalWounds;
      const isEnemy = action.payload?.activeStep?._type === "enemy";
      const isPause = action.payload?.activeStep?._type === "pause";
      const resetEnemyCount = isEnemy && state.hasPaused;

      // Munitions Crate reload perk
      const hasMunitions = state.perks.includes("munitions-crate");
      const updatedWeapons = hasMunitions
        ? state.player.weapons.map((w) =>
            w.id === "pistol" ? { ...w, ammo: Math.max(w.ammo, 15) } : w,
          )
        : state.player.weapons;

      return {
        ...state,
        night: nextNight,
        rooms: 0,
        lastStandUsedThisNight: false,
        player: {
          ...state.player,
          weapons: updatedWeapons,
          totalToughness: newToughness,
          toughness: isFirstNightClear
            ? Math.max(state.player.toughness + 1, newToughness)
            : state.player.toughness,
          totalWounds: newTotalWounds,
          wounds: newWounds,
        },
        ...(action.payload?.activeStep
          ? {
              activeStep: action.payload.activeStep,
              activeStepUuid: crypto.randomUUID(),
              steps: state.steps + 1,
              hasPaused: isPause ? true : resetEnemyCount ? false : state.hasPaused,
              enemiesDefeatedCount: resetEnemyCount ? 0 : state.enemiesDefeatedCount,
            }
          : {}),
        messages: appendMessages(
          state.messages,
          action.payload?.messages ?? [
            createMessage(
              `You steel your nerves to fight on for Night ${nextNight}${isFirstNightClear ? " (+1 Toughness, Max HP increased to 20)" : ""}.`,
            ),
          ],
        ),
      };
    }

    case "perk_select": {
      const perkId = action.payload.perkId;
      if (state.perks.includes(perkId)) return state;

      const updatedPlayer = { ...state.player };
      if (perkId === "ironclad") {
        updatedPlayer.totalToughness += 1;
        updatedPlayer.toughness += 1;
      } else if (perkId === "sharpshooter") {
        updatedPlayer.hitModifier += 1;
      } else if (perkId === "munitions-crate") {
        updatedPlayer.weapons = updatedPlayer.weapons.map((w) =>
          w.id === "pistol" ? { ...w, ammo: w.ammo + 15 } : w,
        );
      }

      return {
        ...state,
        perks: [...state.perks, perkId],
        player: updatedPlayer,
        messages: appendMessages(state.messages, action.payload.messages),
      };
    }

    case "last_stand_used": {
      return {
        ...state,
        lastStandUsedThisNight: true,
        player: {
          ...state.player,
          wounds: 1,
        },
        messages: appendMessages(state.messages, action.payload?.messages),
      };
    }

    case "restart":
      return {
        ...generateInitialState(action.payload?.seed),
      };
    default:
      return state;
  }
}

function getInitialSeedFromUrl(): string | undefined {
  if (typeof window !== "undefined" && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get("seed");
    if (seedParam) return seedParam;
  }
  return undefined;
}

const GameContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameAction>;
} | null>(null);

export function GameProvider({
  children,
  initialSeed,
}: {
  children: ReactNode;
  initialSeed?: number | string;
}) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => generateInitialState(initialSeed ?? getInitialSeedFromUrl()),
  );
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <GameContext.Provider value={value}>
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
