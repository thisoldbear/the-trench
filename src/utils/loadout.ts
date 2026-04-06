import { weapons, type Weapon } from "@/datasheets/weapons";
import { rollDice } from "./rollDice";

export function loadout(): Weapon[] {
  const dice = rollDice(6);

  const [firstWeapon, ...rest] = weapons;

  return [firstWeapon, rest[dice]!];
}
