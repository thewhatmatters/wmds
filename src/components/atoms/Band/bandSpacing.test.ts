import { describe, expect, it } from "vitest";
import { bandSpacingClasses } from "./bandStyles";

/** Spacing rule S8: section padding from tokens; `lg` shrinks on phones, `md` holds 48px. */
describe("Band spacing (S8)", () => {
  it("lg is 64px on phones (8 × the 8px baseline) and 96px from md", () => {
    expect(bandSpacingClasses.lg).toBe("py-[calc(var(--grid-baseline)*8)] md:py-[calc(var(--leading-base)*4)]");
  });

  it("md is 48px at every width, and none is none", () => {
    expect(bandSpacingClasses.md).toBe("py-[calc(var(--leading-base)*2)]");
    expect(bandSpacingClasses.none).toBe("");
  });
});
