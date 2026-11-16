import { describe, expect, test } from "vitest";
import { AdvanceArrow } from "./AdvanceArrow";

describe("AdvanceArrow component", () => {
  test("creates an SVG element with btn-arrow class and accessible attributes", () => {
    const arrow = AdvanceArrow();
    expect(arrow.type).toBe("svg");
    expect(arrow.props.className).toBe("btn-arrow");
    expect(arrow.props["aria-hidden"]).toBe("true");
    expect(arrow.props.viewBox).toBe("0 0 24 24");
  });
});
