import { describe, expect, test } from "vitest";
import { createPauseStep, pauseSentences } from "./pause";

describe("pause datasheet", () => {
  test("contains exactly 10 thematic sentences", () => {
    expect(pauseSentences).toHaveLength(10);
    // Every sentence should be non-empty and unique
    const unique = new Set(pauseSentences);
    expect(unique.size).toBe(10);
  });

  test("createPauseStep creates a pause step with correct properties", () => {
    const pause = createPauseStep(0);
    expect(pause).toEqual({
      _type: "pause",
      name: "A moment of respite",
      description: pauseSentences[0],
    });
  });

  test("createPauseStep selects among the 10 sentences", () => {
    for (let i = 0; i < 10; i++) {
      const step = createPauseStep(i);
      expect(step._type).toBe("pause");
      expect(step.name).toBe("A moment of respite");
      expect(step.description).toBe(pauseSentences[i]);
    }
  });
});
