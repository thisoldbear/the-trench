export type ChangelogEntry = {
  version: string;
  changes: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "5.0.8",
    changes: [
      "Updated perk text and expanded detail cards in Stats HUD to 16px font size.",
    ],
  },
  {
    version: "5.0.7",
    changes: [
      "Updated perk badge buttons in Stats HUD to 16px font size.",
    ],
  },
  {
    version: "5.0.6",
    changes: [
      "Updated 'Perks:' label in Stats HUD to 16px and white (#ffffff) matching the stats table typography.",
      "Added temporary HUD preview of starter perks for visual inspection and interactive testing.",
    ],
  },
  {
    version: "5.0.5",
    changes: [
      "Set perks font size in Stats HUD to 13px matching the stats cells.",
      "Made perks in Stats HUD clickable buttons that expand an inline detail card showing what each acquired perk does.",
    ],
  },
  {
    version: "5.0.4",
    changes: [
      "Reordered Dawn navigation buttons: placed 'Start again' on the left and 'Fight on for Night X' forward button on the right.",
    ],
  },
  {
    version: "5.0.3",
    changes: [
      "Removed duplicate seed text from victory, dawn, and game over screens in favor of the interactive shareable seed link in the footer.",
    ],
  },
  {
    version: "5.0.2",
    changes: [
      "Redesigned the Dawn Perk selection to match Chest item styling: dashed border container, Special Elite typewriter typography, and Gothic Claim buttons.",
      "Styled Campaign Summary and Perks HUD badges with consistent typewriter fonts and monochrome borders.",
    ],
  },
  {
    version: "5.0.1",
    changes: [
      "Replaced Enemies counter with Lamps lit in the HUD (Cell 4) with progress bar, giving Night: X / 5 its own dedicated top-right slot (Cell 2).",
      "Fixed Sharpshooter perk bug where permanent hit modifier was cleared when temporary cigarette buffs wore off.",
      "Fixed empty weapons being deleted from inventory, allowing Munitions Crate to reload the Pistol at dawn.",
      "Extended Last Stand perk protection to cover lethal damage from traps, booby-trapped chests, and fleeing.",
      "Aligned Night 5 Chapel healing with physical print rules (restores 1d3 health).",
      "Made StepCounter cross symbol deterministic from stepId so decorative UI does not consume seedable game dice rolls.",
    ],
  },
  {
    version: "5.0.0",
    changes: [
      "Major Release: Expanded The Trench into a 5-Night campaign culminating at Night 5 ('The End').",
      "Added Tier 3 Night 4–5 monster table: Ironclad Abomination, Dreadstalker Hound, Flamethrower Fiend, Trench Archon, and The Trench Sovereign.",
      "Introduced Roguelike Survival Perks earned at each Dawn: Ironclad, Sharpshooter, Combat Medic, Bayonet Vigor, Munitions Crate, Trench Armor, Adrenaline Surge, and Last Stand.",
      "Added environmental night conditions and escalating trench perils across Nights 1 to 5.",
      "Updated physical tabletop manual and scorecard with 5-Night tracker, 3-tier monster tables, and Dawn perks ledger.",
    ],
  },
  {
    version: "4.4.1",
    changes: [
      "Added 'Fight on for another night' continuation option after lighting 13 lamps: players can now advance into subsequent nights with a persistent Nights counter (resetting to 0/13 lamps per night).",
      "Granted +1 base Toughness (increasing from 3 to 4) and raised maximum health to 20 (fully restored) upon entering Night 2.",
      "Added a second table of deadlier enemies for Night 2+ encounters: Gas Ghoul, War Hound, Corrupted Stormtrooper, Possessed Officer, and Golgotha Behemoth.",
      "Increased Night 2+ difficulty: trench hazards deal +1 damage, and sprung chest traps deal 1d3+1 damage.",
      "Added cool high-tier equipment items in chests: First Aid Kit (restores 6 health) and Adrenaline Shot (+2 to hit and +2 damage).",
      "Displayed 'Nights: {number}' in the stats HUD alongside the clean 13-lamp tracker for every night.",
      "Updated tabletop physical print manual and scorecard with Night 2 monsters (Table III B), Nights tracker, and 20-wound health ledger.",
    ],
  },
  {
    version: "4.4.0",
    changes: [
      "Streamlined dice across the entire game engine to strictly d20 and d6 (with d3 as d6 halved).",
      "Removed Flare Gun so all secondary starting weapons and corpse weapon drops map 1-to-1 to a clean 1d6 roll (1: Knife, 2: Sword, 3: Rifle, 4: Shotgun, 5: Grenade, 6: Barbed Wire Bat).",
      "Updated physical tabletop rules and charts to require only 1x d20 and 1x d6.",
    ],
  },
  {
    version: "4.3.1",
    changes: [
      "Removed emoji icon from the print button and updated buttons on the print page to have black text and black border with no hover background.",
      "Corrected the physical print edition goal to 13 lamps (matching LAMP_TARGET) across the rules and scorecard tracker.",
      "Removed the enemies vanquished and respite tracking section from the print scorecard so players can pause at will.",
      "Aligned equipment and starting loadout on the print page with game logic (starting with 1 Bandage and removing the artificial 2-item bag limit).",
      "Audited tabletop print rules against game engine: corrected corpse loot table (rolls 15–16 award Cigarettes, fallen weapons roll 1d8), added combat Flee action, and documented exact modifier/ammo consumption mechanics.",
    ],
  },
  {
    version: "4.3.0",
    changes: [
      "Added physical print edition page (/print) explaining how to play the game on tabletop with full rules, encounter/loot/hazard charts, monster tables, and a printable scorecard/character sheet.",
      "Added 'Print Version' link to the footer with print-friendly formatting (dark text on light background) and one-click print button.",
    ],
  },
  {
    version: "4.2.1",
    changes: [
      "Replaced Unicode arrow glyph with an inline vector SVG to guarantee consistent vertical alignment across Android Chrome, iOS, and desktop browsers.",
    ],
  },
  {
    version: "4.2.0",
    changes: [
      "Moved dice rolling and procedural generation to a deterministic, seedable Mulberry32 PRNG.",
      "Added support for run seeds via URL parameter (?seed=...) and displayed the active run seed in the footer and end screens for replayability and sharing.",
    ],
  },
  {
    version: "4.1.2",
    changes: [
      "Added custom slim dark scrollbars that blend with the theme on desktop browsers.",
    ],
  },
  {
    version: "4.1.1",
    changes: [
      "Ensure action buttons and advance arrows are always vertically centered across devices.",
    ],
  },
  {
    version: "4.1.0",
    changes: [
      "Added 'A moment of respite' pause step after lighting each lamp and after every 3 enemy encounters with 10 thematic sentences to slow down encounters.",
      "Added right arrow indicator to all buttons that advance steps.",
    ],
  },
  {
    version: "4.0.2",
    changes: [
      "Capture dice roll and damage results in message log on lethal attacks in combat (enemy defeated and player killed).",
      "Include dice roll results when advancing steps so it is clear what was rolled to reach each encounter (e.g., 'You rolled 13 then 2. Encountered: Zombie Soldier').",
    ],
  },
  {
    version: "4.0.1",
    changes: [
      "Removed 'Version: ' label from footer and added link to the GitHub repository.",
    ],
  },
  {
    version: "4.0.0",
    changes: [
      "Migrated project to Vite using the React TypeScript template.",
      "Migrated unit test suite from bun:test to Vitest.",
      "Removed Bun runtime and bundler dependencies.",
    ],
  },
  {
    version: "0.3.10",
    changes: [
      "Bounded message log history to 50 entries and limited UI rendering to 20 to prevent unbounded memory growth.",
    ],
  },
  {
    version: "0.3.9",
    changes: [
      "Removed unused reducer actions (equipped_weapon_remove, weapon_remove, game_end).",
    ],
  },
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
    changes: ["Removed unused API template boilerplate and SVG assets."],
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
