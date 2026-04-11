import type { Equipment } from "./equipment";
import { weapons, type Weapon } from "./weapons";

export type Player = {
  totalWounds: number;
  wounds: number;
  weapons: Weapon[];
  equippedWeapon: Weapon["id"] | null;
  equipment: Equipment[];
  totalEquipment: number;
  toughness: number;
  totalToughness: number;
  damageModifier: number;
};

export const player = {
  totalWounds: 15,
  wounds: 15,
  weapons: [weapons[0], weapons[1]],
  equippedWeapon: weapons[0].id,
  equipment: [],
  totalEquipment: 2,
  toughness: 3,
  totalToughness: 3,
  damageModifier: 0,
} satisfies Player;
