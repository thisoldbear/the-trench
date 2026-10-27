export const traps = [
  {
    _type: "trap",
    name: "Barbed Wire",
    description: "A barbed wire fence hinders the way forward.",
    damage: 2,
  },
  {
    _type: "trap",
    name: "Collapsed Wall",
    description: "A trench support gives way.",
    damage: 2,
  },
  {
    _type: "trap",
    name: "Gas Cloud",
    description: "Hold your breath.",
    damage: 3,
  },
  {
    _type: "trap",
    name: "Unexploded Bomb",
    description: "Tread... carefully.",
    damage: 6,
  },
] as const;

export type Trap = (typeof traps)[number];
