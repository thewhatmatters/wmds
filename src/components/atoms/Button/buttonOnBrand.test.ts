import { describe, expect, it } from "vitest";
import { getStatusPaint } from "./buttonStatusMotion";
import { buttonRoleClasses } from "./buttonStyles";

describe("Button role inverse-outline", () => {
  it("paints the hairline and label with on-brand, not a new color", () => {
    const classes = buttonRoleClasses["inverse-outline"];
    expect(classes).toContain("border-on-brand");
    expect(classes).toContain("text-on-brand");
    expect(classes).toContain("bg-transparent");
    expect(classes).toContain("hover:bg-on-brand-hover");
    expect(classes).toContain("hover:text-brand");
    expect(classes).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(getStatusPaint("idle", "inverse-outline")).toEqual({
      backgroundColor: "transparent",
      color: "var(--color-on-brand)",
    });
  });
});
