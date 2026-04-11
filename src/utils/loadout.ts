import { weapons, type Weapon } from "@/datasheets/weapons";
import { rollDice } from "./rollDice";
import { equipment, type Equipment } from "@/datasheets/equipment";

export function weaponsLoadout(): Weapon[] {
  const dice = rollDice(6);

  const [firstWeapon, ...rest] = weapons;

  return [firstWeapon, rest[dice]!];
}

export function equipmentLoadout(): Equipment[] {
  return [equipment[0]];
}
