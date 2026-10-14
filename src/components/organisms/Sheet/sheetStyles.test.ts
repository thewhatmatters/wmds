import { describe, expect, it } from "vitest";
import {
  sheetEndBackdropClasses,
  sheetOverlayRootClasses,
  sheetPanelBaseClasses,
  sheetPanelPlacementClasses,
  sheetPanelSizeClasses,
  sheetSafeAreaBottomClasses,
} from "./sheetStyles";

describe("Sheet panel shell", () => {
  it("keeps 16px top pad on overlay chrome", () => {
    expect(sheetPanelBaseClasses).toContain("pt-4");
    expect(sheetPanelBaseClasses).not.toContain("pt-[2px]");
  });
});

describe("end side sheet", () => {
  it("is full-screen below md", () => {
    expect(sheetOverlayRootClasses.end).not.toContain("pl-4");
    expect(sheetPanelPlacementClasses.end).toContain("rounded-none");
    expect(sheetPanelPlacementClasses.end).toContain("md:rounded-l-2xl");
    for (const size of ["sm", "md", "lg"] as const) {
      expect(sheetPanelSizeClasses.end[size]).toMatch(/^w-full md:max-w-/);
    }
  });

  it("keeps the strip on start and bottom", () => {
    expect(sheetOverlayRootClasses.start).toContain("pr-4");
    expect(sheetOverlayRootClasses.bottom).toContain("pt-4");
  });

  it("clears the home indicator and uses a token scrim", () => {
    expect(sheetSafeAreaBottomClasses).toContain("safe-area-inset-bottom");
    expect(sheetEndBackdropClasses).toContain("bg-overlay/50");
  });
});
