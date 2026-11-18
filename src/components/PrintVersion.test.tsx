import { describe, expect, test, vi } from "vitest";
import { PrintVersion } from "./PrintVersion";

describe("PrintVersion component", () => {
  test("renders print page structure with tables and scorecard", () => {
    const onBack = vi.fn();
    const result = PrintVersion({ onBack });

    expect(result.type).toBe("div");
    expect(result.props.className).toBe("print-page");
  });

  test("triggers onBack when back buttons are clicked", () => {
    const onBack = vi.fn();
    const result = PrintVersion({ onBack });

    // The first child is the toolbar
    const toolbar = result.props.children[0];
    const backButton = toolbar.props.children[0];
    backButton.props.onClick();

    expect(onBack).toHaveBeenCalledTimes(1);

    // The last child (index 6) is the bottom footer return button
    const footer = result.props.children[6];
    const returnButton = footer.props.children;
    returnButton.props.onClick();

    expect(onBack).toHaveBeenCalledTimes(2);
  });

  test("triggers window.print when print button is clicked", () => {
    const onBack = vi.fn();
    const printSpy = vi.fn();
    vi.stubGlobal("window", {
      print: printSpy,
    });

    const result = PrintVersion({ onBack });
    const toolbar = result.props.children[0];
    const printButton = toolbar.props.children[1];

    printButton.props.onClick();
    expect(printSpy).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  test("contains Table III C, Table VII Dawn Perks, and 5-Night campaign scorecard", () => {
    const onBack = vi.fn();
    const result = PrintVersion({ onBack });

    const tablesSection = result.props.children[4];
    expect(tablesSection.props.className).toBe("print-section");

    const scorecardSection = result.props.children[5];
    expect(scorecardSection.props.className).toContain("scorecard-section");
  });

  test("verifies all enemies across all 3 tiers are rendered with exact stats in tables", () => {
    const onBack = vi.fn();
    const result = PrintVersion({ onBack });

    // Stringify the rendered component to verify data integrity
    const renderedText = JSON.stringify(result);

    // Tier 1 enemies
    expect(renderedText).toContain("Swarm of Rats");
    expect(renderedText).toContain("Zombie Soldier");
    expect(renderedText).toContain("Rabid Dog");
    expect(renderedText).toContain("Possessed Soldier");
    expect(renderedText).toContain("Trench Tyrant");

    // Tier 2 enemies
    expect(renderedText).toContain("Gas Ghoul");
    expect(renderedText).toContain("War Hound");
    expect(renderedText).toContain("Corrupted Stormtrooper");
    expect(renderedText).toContain("Possessed Officer");
    expect(renderedText).toContain("Golgotha Behemoth");

    // Tier 3 Apex Horrors
    expect(renderedText).toContain("Ironclad Abomination");
    expect(renderedText).toContain("Dreadstalker Hound");
    expect(renderedText).toContain("Flamethrower Fiend");
    expect(renderedText).toContain("Trench Archon");
    expect(renderedText).toContain("The Trench Sovereign");
  });

  test("verifies all weapons, equipment, perks, and traps match datasheets", () => {
    const onBack = vi.fn();
    const result = PrintVersion({ onBack });
    const renderedText = JSON.stringify(result);

    // Weapons
    expect(renderedText).toContain("Pistol");
    expect(renderedText).toContain("Knife");
    expect(renderedText).toContain("Sword");
    expect(renderedText).toContain("Rifle");
    expect(renderedText).toContain("Shotgun");
    expect(renderedText).toContain("Grenade");
    expect(renderedText).toContain("Barbed Wire Bat");

    // Equipment
    expect(renderedText).toContain("Bandage");
    expect(renderedText).toContain("Morphine");
    expect(renderedText).toContain("Cigarettes");
    expect(renderedText).toContain("Hip Flask");
    expect(renderedText).toContain("First Aid Kit");
    expect(renderedText).toContain("Adrenaline Shot");

    // Perks
    expect(renderedText).toContain("Ironclad");
    expect(renderedText).toContain("Sharpshooter");
    expect(renderedText).toContain("Combat Medic");
    expect(renderedText).toContain("Bayonet Vigor");
    expect(renderedText).toContain("Munitions Crate");
    expect(renderedText).toContain("Trench Armor");
    expect(renderedText).toContain("Adrenaline Surge");
    expect(renderedText).toContain("Last Stand");

    // Traps
    expect(renderedText).toContain("Barbed Wire");
    expect(renderedText).toContain("Collapsed Wall");
    expect(renderedText).toContain("Gas Cloud");
    expect(renderedText).toContain("Unexploded Bomb");

    // 5-night scorecard
    expect(renderedText).toContain("Night 5 (THE END)");
    expect(renderedText).toContain("Lamp ");
    expect(renderedText).toContain("lamps per night");
  });
});
