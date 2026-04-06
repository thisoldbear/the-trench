export const traps = [
  {
    _type: "trap",
    name: "Barbed Wire",
    description: "A barbed wire fence blocks the way forward.",
    damage: 2,
    attack: 2,
    strength: 3,
  },
  {
    _type: "trap",
    name: "Collapsed Wall",
    description: "A trench supprt gives way",
    damage: 2,
    attack: 2,
    strength: 3,
  },
  {
    _type: "trap",
    name: "Gas Cloud",
    description: "Hold your breath",
    damage: 3,
    attack: 1,
    strength: 3,
  },
  {
    _type: "trap",
    name: "Unexploded Bomb",
    description: "Tread... carefully",
    damage: 6,
    attack: 2,
    strength: 3,
  },
] as const;

export type Trap = (typeof traps)[number];
