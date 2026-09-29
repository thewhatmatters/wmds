import { describe, expect, it } from "vitest";
import { intakeConfettiColors } from "./intakeConfirmationStyles";

describe("intake confetti colors", () => {
  it("includes brand navy through the existing token", () => {
    expect(intakeConfettiColors).toContain("var(--color-brand)");
    expect(intakeConfettiColors.every((color) => color.startsWith("var(--color-"))).toBe(true);
  });
});
