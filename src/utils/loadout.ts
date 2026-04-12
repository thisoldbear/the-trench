import { weapons, type Weapon } from "@/datasheets/weapons";
import { rollDice } from "./rollDice";
import { equipment, type Equipment } from "@/datasheets/equipment";

export function weaponsLoadout(): Weapon[] {
  const dice = rollDice(6);

  const [firstWeapon, ...rest] = weapons;
  const secondWeapon = rest.length > 0 ? rest[(dice - 1) % rest.length]! : null;

  return [
    {
      ...firstWeapon,
      uuid: crypto.randomUUID(),
    },
    ...(secondWeapon !== null
      ? [
          {
            ...secondWeapon,
            uuid: crypto.randomUUID(),
          },
        ]
      : []),
  ];
}

export function equipmentLoadout(): Equipment[] {
  return [
    {
      ...equipment[0],
      uuid: crypto.randomUUID(),
    },
  ];
}
