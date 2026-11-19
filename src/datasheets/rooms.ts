export const rooms = [
  {
    _type: "room",
    name: "Dark Trench",
    description:
      "A long, narrow trench stretching into the darkness. Light the lamp to ward off the horrors for another night and light the way to safety. (The trench twists onward: you cannot encounter two lamps in a row).",
  },
  {
    _type: "room",
    name: "Chapel",
    description: "Rest a while and pray.",
  },
] as const;

export type Room = (typeof rooms)[number];
