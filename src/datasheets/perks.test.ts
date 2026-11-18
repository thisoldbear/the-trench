import { describe, expect, test } from "vitest";
import { perks, getPerkById } from "./perks";

describe("perks datasheet", () => {
  test("has 8 distinct perks with unique ids and codes", () => {
    expect(perks).toHaveLength(8);
    const ids = new Set(perks.map((p) => p.id));
    const codes = new Set(perks.map((p) => p.code));
    expect(ids.size).toBe(8);
    expect(codes.size).toBe(8);
  });

  test("getPerkById finds perk by id", () => {
    expect(getPerkById("ironclad")).toBeDefined();
    expect(getPerkById("ironclad")?.code).toBe("TGH");
    expect(getPerkById("nonexistent")).toBeUndefined();
  });
});
