import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  GRID_ON_CLASS,
  gridOverlayKeyShouldToggle,
  isEditableGridOverlayTarget,
} from "./gridOverlayUtils";
import { gridColumnSteps } from "./viewports";

const gridCss = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../theme/grid.css"),
  "utf8",
);

describe("grid.css probe guards", () => {
  it("does not re-scale --spacing", () => {
    expect(gridCss).not.toMatch(/--spacing\s*:/);
  });

  it("derives the 8px baseline from even multiples of --spacing", () => {
    expect(gridCss).toMatch(/--grid-baseline:\s*calc\(\s*var\(--spacing\)\s*\*\s*2\s*\)/);
    expect(gridCss).toMatch(/--leading-base:\s*calc\(\s*var\(--grid-baseline\)\s*\*\s*3\s*\)/);
  });

  it("emits grid-page, band, and a subgrid fallback", () => {
    expect(gridCss).toMatch(/@utility grid-page/);
    expect(gridCss).toMatch(/@utility band/);
    expect(gridCss).toMatch(/@supports not \(grid-template-columns:\s*subgrid\)/);
  });

  it("steps columns at the same widths as gridScale (md / lg)", () => {
    const steps = gridColumnSteps.filter((step) => step.minWidthPx > 0);
    expect(steps.map((step) => [step.minWidthPx, step.cols])).toEqual([
      [768, 8],
      [1024, 12],
    ]);
    for (const step of steps) {
      expect(gridCss).toContain(`@media (min-width: ${step.minWidthPx}px)`);
      expect(gridCss).toContain(`--grid-cols: ${step.cols};`);
    }
  });
});

describe("gridOverlayKeyShouldToggle", () => {
  it("toggles on g / G without modifiers", () => {
    expect(gridOverlayKeyShouldToggle({ key: "g", target: null })).toBe(true);
    expect(gridOverlayKeyShouldToggle({ key: "G", target: null })).toBe(true);
  });

  it("ignores modified keys and non-g keys", () => {
    expect(gridOverlayKeyShouldToggle({ key: "g", metaKey: true, target: null })).toBe(false);
    expect(gridOverlayKeyShouldToggle({ key: "g", ctrlKey: true, target: null })).toBe(false);
    expect(gridOverlayKeyShouldToggle({ key: "x", target: null })).toBe(false);
  });

  it("does not steal keystrokes from fields", () => {
    expect(
      gridOverlayKeyShouldToggle({
        key: "g",
        target: { tagName: "INPUT" },
      }),
    ).toBe(false);
    expect(isEditableGridOverlayTarget({ tagName: "TEXTAREA" })).toBe(true);
    expect(isEditableGridOverlayTarget({ isContentEditable: true })).toBe(true);
  });

  it("exports the document class the overlay CSS reads", () => {
    expect(GRID_ON_CLASS).toBe("grid-on");
  });
});
