import { describe, expect, test, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Stats } from "./Stats";
import { useGame, generateInitialState } from "@/context/GameContext";

vi.mock("@/context/GameContext", async () => {
  const actual = await vi.importActual<typeof import("@/context/GameContext")>(
    "@/context/GameContext",
  );
  return {
    ...actual,
    useGame: vi.fn(),
  };
});

describe("Stats component", () => {
  test("renders stats cells with wounds, night, toughness, and lamps lit", () => {
    vi.mocked(useGame).mockReturnValue({
      state: {
        ...generateInitialState(),
        rooms: 5,
        night: 2,
        player: {
          ...generateInitialState().player,
          wounds: 12,
          totalWounds: 20,
          toughness: 4,
          totalToughness: 4,
        },
      },
      dispatch: vi.fn(),
    });

    const html = renderToString(React.createElement(Stats));
    const text = html.replace(/<!--.*?-->/g, "");
    expect(text).toContain("Night: 2 / 5");
    expect(text).toContain("Lamps lit: 5 / 13");
    expect(text).toContain("HP:");
  });

  test("renders clickable perk badges with BEM classes and Perks label", () => {
    vi.mocked(useGame).mockReturnValue({
      state: {
        ...generateInitialState(),
        perks: ["ironclad", "sharpshooter"],
      },
      dispatch: vi.fn(),
    });

    const html = renderToString(React.createElement(Stats));
    const text = html.replace(/<!--.*?-->/g, "");
    expect(text).toContain("stats__perks");
    expect(text).toContain("[TGH] Ironclad");
    expect(text).toContain("[HIT] Sharpshooter");
    expect(html).toContain("stats__perks-label");
    expect(html).toContain("stats__perk-badge");
  });
});
