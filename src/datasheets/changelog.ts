export type ChangelogEntry = {
  version: string;
  changes: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "0.3.8",
    changes: [
      "Enabled all trap variants (Collapsed Wall, Gas Cloud, Unexploded Bomb) and scaled trap damage by trap datasheet values.",
    ],
  },
  {
    version: "0.3.7",
    changes: [
      "Moved step entry side effects from React useEffect to step advance handler to prevent duplicate execution in StrictMode.",
    ],
  },
  {
    version: "0.3.6",
    changes: [
      "Removed unused API template boilerplate and SVG assets.",
    ],
  },
  {
    version: "0.3.5",
    changes: [
      "Fixed missing list keys in ChestStep and resolved typos in chest and trap descriptions.",
    ],
  },
  {
    version: "0.3.4",
    changes: [
      "Display damage messages on lethal trap and flee damage before game over.",
    ],
  },
  {
    version: "0.3.3",
    changes: [
      "Clear temporary combat modifiers when lighting lamps as documented.",
    ],
  },
  {
    version: "0.3.2",
    changes: [
      "Fixed TypeScript compilation errors in GameContext, player types, and step components.",
    ],
  },
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
