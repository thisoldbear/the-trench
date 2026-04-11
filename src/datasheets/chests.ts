export const chests = [
  {
    _type: "chest",
    name: "Disgarded Field Medic Bag",
    id: "medic-bag",
    description: "Vital medicine may lie inside...",
  },
  {
    _type: "chest",
    name: "Corpse",
    id: "corpse",
    description: "A fallen soldier may have been carrying something useful...",
  },
] as const;

export type Chest = (typeof chests)[number];
