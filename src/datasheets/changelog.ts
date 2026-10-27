export type ChangelogEntry = {
  version: string;
  changes: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "0.3.1",
    changes: [
      "Fleeing with lit lamps extinguishes one without damage; fleeing with no lamps lit deals D3 damage.",
    ],
  },
  {
    version: "0.3.0",
    changes: [
      "Fleeing combat now extinguishes a lamp instead of dealing damage.",
    ],
  },
  {
    version: "0.2.4",
    changes: ["Capped Bandage health restoration at maximum health (15)."],
  },
  {
    version: "0.2.3",
    changes: [
      "Simplified Chapel steps to restore health to maximum (15), removing the +2 health blessing bug.",
    ],
  },
  {
    version: "0.2.2",
    changes: [
      "Removed outdated darkness continuation text from the Dark Trench description.",
    ],
  },
  {
    version: "0.2.1",
    changes: [
      "Fixed Morphine to grant +2 Toughness to match its item description.",
    ],
  },
  {
    version: "0.2.0",
    changes: [
      "Simplified Dark Trench steps so only the 'Light the lamp' action is shown.",
    ],
  },
  {
    version: "0.1.3",
    changes: [
      "Fixed leaving a Chapel dealing D3 retreat damage and restored the 'Continue' button label.",
    ],
  },
  {
    version: "0.1.1",
    changes: [
      "Fixed chest and corpse traps setting player health to the dice roll instead of subtracting damage.",
      "Added version number to the footer.",
    ],
  },
];
