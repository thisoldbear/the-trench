import { describe, expect, test, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Inventory } from "./Inventory";
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

describe("Inventory component", () => {
  test("renders weapon loadout with inventory__cell-title class", () => {
    vi.mocked(useGame).mockReturnValue({
      state: generateInitialState(),
      dispatch: vi.fn(),
    });

    const html = renderToString(React.createElement(Inventory));
    expect(html).toContain("inventory");
    expect(html).toContain("inventory__title");
    expect(html).toContain("inventory__cell-title");
    expect(html).toContain("Pistol");
  });
});
