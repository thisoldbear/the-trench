export const rooms = [
  {
    _type: "room",
    name: "Trench",
    description: "A long, narrow trench stretching into the darkness.",
    damage: 0,
    attack: 0,
    strength: 0,
  },
  {
    _type: "room",
    name: "Chapel",
    description: "Rest a while.",
    damage: 0,
    attack: 0,
    strength: 0,
  },
] as const;

export type Room = (typeof rooms)[number];

// export type Room = Omit<
//   (typeof rooms)[number],
//   "name" | "description"
// > & {
//   name: string;
//   description: string;
// };
