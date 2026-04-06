import { weapons, type Weapon } from "./weapons";

export type Player = {
  totalWounds: number;
  wounds: number;
  weapons: Weapon[];
  equippedWeapon: Weapon["id"] | null;
  toughness: number;
};

export const player = {
  totalWounds: 15,
  wounds: 15,
  weapons: [weapons[0], weapons[1]],
  equippedWeapon: weapons[0].id,
  toughness: 3,
} satisfies Player;
