import { weapons, type Weapon } from "./weapons";

export type Player = {
  totalWounds: number;
  wounds: number;
  weapons: Weapon[];
  equippedWeapon: Weapon | null;
  toughness: number;
};

export const player = {
  totalWounds: 15,
  wounds: 15,
  weapons: [weapons[0], weapons[1]],
  equippedWeapon: weapons[0],
  toughness: 3,
} satisfies Player;
