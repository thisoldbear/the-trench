import type { Equipment } from "./equipment";
import { weapons, bloodiedFists, type Weapon } from "./weapons";

export type Player = {
  totalWounds: number;
  wounds: number;
  weapons: Weapon[];
  equippedWeapon: Weapon["uuid"] | null;
  equipment: Equipment[];
  toughness: number;
  totalToughness: number;
  damageModifier: number;
  hitModifier: number;
  totalHitModifier: number;
};

export const player: Player = {
  totalWounds: 15,
  wounds: 15,
  weapons: [weapons[0], weapons[1], bloodiedFists],
  equippedWeapon: null,
  equipment: [],
  toughness: 3,
  totalToughness: 3,
  damageModifier: 0,
  hitModifier: 0,
  totalHitModifier: 0,
};
