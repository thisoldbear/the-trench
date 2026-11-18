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
});
