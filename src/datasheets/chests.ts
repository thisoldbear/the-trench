export const chests = [
  {
    _type: "chest",
    name: "Disgarded Field Medic Bag",
    id: "medic-bag",
    description: "Vital medicine may lie inside...",
    damage: 0,
    attack: 0,
    strength: 0,
  },
  {
    _type: "chest",
    name: "Corpse",
    id: "corpse",
    description: "A fallen soldier may have been carrying something useful...",
    damage: 0,
    attack: 0,
    strength: 0,
  },
] as const;

export type Chest = (typeof chests)[number];
