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
  test("renders weapon loadout with inventory__cell-title class and Bloodied Fists", () => {
    vi.mocked(useGame).mockReturnValue({
      state: generateInitialState(),
      dispatch: vi.fn(),
    });

    const html = renderToString(React.createElement(Inventory));
    expect(html).toContain("inventory");
    expect(html).toContain("inventory__title");
    expect(html).toContain("inventory__cell-title");
    expect(html).toContain("Pistol");
    expect(html).toContain("Bloodied Fists");
  });

  test("displays 'Requires: Shotgun' and disables button when Shotgun Ammo is in inventory without Shotgun", () => {
    const initialState = generateInitialState();
    const stateWithShotgunAmmo = {
      ...initialState,
      player: {
        ...initialState.player,
        weapons: initialState.player.weapons.filter((w) => w.id !== "shotgun"),
        equipment: [
          {
            _type: "equipment" as const,
            id: "shotgun-ammo",
            name: "Shotgun Ammo",
            description: "Replenishes up to 5 shells for the Shotgun (max 11). Uses [x1].",
            requiresWeapon: "shotgun",
            uuid: "test-ammo-uuid",
          },
        ],
      },
    };

    vi.mocked(useGame).mockReturnValue({
      state: stateWithShotgunAmmo,
      dispatch: vi.fn(),
    });

    const html = renderToString(React.createElement(Inventory));
    expect(html).toContain("Shotgun Ammo");
    expect(html).toContain("Requires: Shotgun");
    expect(html).toContain("disabled");
  });
});
