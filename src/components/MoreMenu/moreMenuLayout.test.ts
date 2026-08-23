import { describe, expect, it } from "vitest";
import { resolveMenuPosition, type MenuBounds } from "./moreMenuLayout";

function bounds(
  top: number,
  left: number,
  width: number,
  height: number,
): MenuBounds {
  return { top, left, width, height, right: left + width, bottom: top + height };
}

describe("resolveMenuPosition", () => {
  const viewport = { width: 800, height: 600 };
  const trigger = bounds(100, 400, 32, 32);
  const menu = bounds(0, 0, 160, 120);

  it("places below and end-aligned by default", () => {
    expect(
      resolveMenuPosition(trigger, menu, viewport, "below", "end"),
    ).toEqual({
      top: 136,
      left: 272,
      placement: "below",
      alignment: "end",
    });
  });

  it("flips to above when there is not enough space below", () => {
    const lowTrigger = bounds(520, 400, 32, 32);
    const result = resolveMenuPosition(lowTrigger, menu, viewport, "below", "end");
    expect(result.placement).toBe("above");
    expect(result.top).toBe(396);
  });

  it("flips alignment to start when end-aligned menu would overflow the viewport", () => {
    const edgeTrigger = bounds(100, 120, 32, 32);
    const result = resolveMenuPosition(edgeTrigger, menu, viewport, "below", "end");
    expect(result.alignment).toBe("start");
    expect(result.left).toBe(120);
  });

  it("clamps menu position inside viewport padding", () => {
    const cornerTrigger = bounds(10, 10, 32, 32);
    const result = resolveMenuPosition(cornerTrigger, menu, viewport, "below", "start");
    expect(result.left).toBeGreaterThanOrEqual(8);
    expect(result.top).toBeGreaterThanOrEqual(8);
  });
});
