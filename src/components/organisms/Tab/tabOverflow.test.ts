import { describe, expect, it } from "vitest";
import { resolveTabOverflow } from "./tabOverflow";

const items = [
  { value: "profile", width: 70 },
  { value: "notifications", width: 110 },
  { value: "security", width: 80 },
  { value: "general", width: 75 },
  { value: "members", width: 85 },
];

describe("resolveTabOverflow", () => {
  it("keeps every tab when the track fits", () => {
    expect(resolveTabOverflow(items, "profile", 500, 64)).toEqual({
      visibleValues: items.map((item) => item.value),
      overflowValues: [],
    });
  });

  it("reserves space for More when tabs overflow", () => {
    expect(resolveTabOverflow(items, "profile", 330, 64)).toEqual({
      visibleValues: ["profile", "notifications", "security"],
      overflowValues: ["general", "members"],
    });
  });

  it("promotes an active overflow tab into the last visible slot", () => {
    expect(resolveTabOverflow(items, "members", 330, 64)).toEqual({
      visibleValues: ["profile", "notifications", "members"],
      overflowValues: ["security", "general"],
    });
  });
});
