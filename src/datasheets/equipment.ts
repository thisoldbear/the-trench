export const equipment = [
  {
    _type: "equipment",
    name: "Bandage",
    id: "bandage",
    description: "Restores 3 health. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "Morphine",
    id: "morphine",
    description:
      "Adds +2 to toughness. Decreased by succesful enemy hits. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "Cigarettes",
    id: "cigarettes",
    description: "Adds +1 to roll results for a short while. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "Hip Flask",
    id: "hip-flask",
    description:
      "Flask containing gin. Adds +1 to toughness and +2 to damage rolls for a short while. Uses [x1].",
  },
] as const;

export type Equipment = (typeof equipment)[number];
