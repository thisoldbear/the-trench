import type { Equipment } from "./equipment";
import { weapons, type Weapon } from "./weapons";

export type Player = {
  totalWounds: number;
  wounds: number;
  weapons: Weapon[];
  equippedWeapon: Weapon["uuid"] | null;
  equipment: Equipment[];
  totalEquipment: number;
  toughness: number;
  totalToughness: number;
  damageModifier: number;
  hitModifier: number;
};

export const player = {
  totalWounds: 15,
  wounds: 15,
  weapons: [weapons[0], weapons[1]],
  equippedWeapon: null,
  equipment: [],
  totalEquipment: 2,
  toughness: 3,
  totalToughness: 3,
  damageModifier: 0,
  hitModifier: 0,
} satisfies Player;
