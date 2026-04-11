export const rooms = [
  {
    _type: "room",
    name: "Trench",
    description: "A long, narrow trench stretching into the darkness.",
  },
  {
    _type: "room",
    name: "Chapel",
    description: "Rest a while.",
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
