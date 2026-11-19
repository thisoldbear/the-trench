import { describe, expect, test, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ChestStep } from "./ChestStep";
import { useGame, generateInitialState } from "@/context/GameContext";
import { chests } from "@/datasheets/chests";
import * as chestUtils from "@/utils/chest";

vi.mock("@/context/GameContext", async () => {
  const actual = await vi.importActual<typeof import("@/context/GameContext")>(
    "@/context/GameContext",
  );
  return {
    ...actual,
    useGame: vi.fn(),
  };
});

describe("ChestStep component", () => {
  test("renders 'Requires: Shotgun' note on Shotgun Ammo when player lacks Shotgun, but allows taking it", () => {
    const initialState = generateInitialState();
    const stateWithoutShotgun = {
      ...initialState,
      player: {
        ...initialState.player,
        weapons: initialState.player.weapons.filter((w) => w.id !== "shotgun"),
      },
    };

    vi.mocked(useGame).mockReturnValue({
      state: stateWithoutShotgun,
      dispatch: vi.fn(),
    });

    // Mock rollOnChestTable to return Shotgun Ammo
    vi.spyOn(chestUtils, "rollOnChestTable").mockReturnValue([
      {
        _type: "equipment" as const,
        id: "shotgun-ammo",
        name: "Shotgun Ammo",
        description: "Replenishes up to 5 shells for the Shotgun (max 11). Uses [x1].",
        requiresWeapon: "shotgun",
      },
    ]);

    const html = renderToString(React.createElement(ChestStep, { chest: chests[1] }));
    expect(html).toContain("Corpse");
    expect(html).toContain("Search");
  });
});
