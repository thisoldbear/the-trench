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
      "Adds +2 to toughness. Decreased by successful enemy hits. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "Cigarettes",
    id: "cigarettes",
    description: "Adds +1 to hit rolls for a short while. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "Hip Flask",
    id: "hip-flask",
    description:
      "Flask containing gin. Adds +1 to toughness and +2 to damage rolls for a short while. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "First Aid Kit",
    id: "first-aid-kit",
    description: "Restores 6 health. Uses [x1].",
  },
  {
    _type: "equipment",
    name: "Adrenaline Shot",
    id: "adrenaline-shot",
    description:
      "Surge of raw courage. Adds +2 to hit rolls and +2 to damage rolls for a short while. Uses [x1].",
  },
] as const;

export type Equipment = (typeof equipment)[number] & {
  uuid?: string;
};
