export type PerkId =
  | "ironclad"
  | "sharpshooter"
  | "combat-medic"
  | "bayonet-vigor"
  | "munitions-crate"
  | "trench-armor"
  | "adrenaline-surge"
  | "last-stand";

export type Perk = {
  id: PerkId;
  code: string;
  name: string;
  description: string;
  flavor: string;
};

export const perks: readonly Perk[] = [
  {
    id: "ironclad",
    code: "TGH",
    name: "Ironclad",
    description: "+1 Base Toughness permanently.",
    flavor: "Rivet thick steel plates directly into your greatcoat.",
  },
  {
    id: "sharpshooter",
    code: "HIT",
    name: "Sharpshooter",
    description: "+1 to all attack hit rolls permanently.",
    flavor: "Steady nerves and a cold eye through the drifting sulfur mist.",
  },
  {
    id: "combat-medic",
    code: "MED",
    name: "Combat Medic",
    description: "Bandages and medical supplies restore +3 extra health.",
    flavor: "Rapid field surgery practiced under relentless artillery fire.",
  },
  {
    id: "bayonet-vigor",
    code: "VIG",
    name: "Bayonet Vigor",
    description: "+2 Damage with all melee attacks permanently.",
    flavor: "Vicious close-quarters ferocity honed in muddy crater brawls.",
  },
  {
    id: "munitions-crate",
    code: "AMM",
    name: "Munitions Crate",
    description: "+15 Pistol Ammo immediately and full reload at dawn.",
    flavor: "A stash of dry brass found sealed inside a sunken bunker.",
  },
  {
    id: "trench-armor",
    code: "ARM",
    name: "Trench Armor",
    description: "-1 Damage from all traps and trench hazards (minimum 1).",
    flavor: "Reinforced boots and heavy leather resist shrapnel and wire.",
  },
  {
    id: "adrenaline-surge",
    code: "SUR",
    name: "Adrenaline Surge",
    description: "+2 Damage bonus on your first hit in every combat.",
    flavor: "When the horrors strike, your heart thunders with primal fury.",
  },
  {
    id: "last-stand",
    code: "LST",
    name: "Last Stand",
    description: "Once per night, lethal damage leaves you at 1 HP instead.",
    flavor: "Refusal to die in the forgotten mud. Not tonight.",
  },
] as const;

export function getPerkById(id: string): Perk | undefined {
  return perks.find((p) => p.id === id);
}
