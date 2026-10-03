import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  GRID_ON_CLASS,
  gridGuidesDocumentSpread,
  gridGuidesSpreadLimit,
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

type GridOverlayKeyEvent = Parameters<typeof gridOverlayKeyShouldToggle>[0];

/** A key event with no modifiers held, unless the test sets one. */
function keyEvent(init: Partial<GridOverlayKeyEvent> & { key: string }): GridOverlayKeyEvent {
  return { metaKey: false, ctrlKey: false, altKey: false, target: null, ...init };
}

/** Stand-in for a DOM node — the helpers only read `tagName` and `isContentEditable`. */
function target(fields: { tagName?: string; isContentEditable?: boolean }): EventTarget {
  return fields as unknown as EventTarget;
}

describe("gridOverlayKeyShouldToggle", () => {
  it("toggles on g / G without modifiers", () => {
    expect(gridOverlayKeyShouldToggle(keyEvent({ key: "g" }))).toBe(true);
    expect(gridOverlayKeyShouldToggle(keyEvent({ key: "G" }))).toBe(true);
  });

  it("ignores modified keys and non-g keys", () => {
    expect(gridOverlayKeyShouldToggle(keyEvent({ key: "g", metaKey: true }))).toBe(false);
    expect(gridOverlayKeyShouldToggle(keyEvent({ key: "g", ctrlKey: true }))).toBe(false);
    expect(gridOverlayKeyShouldToggle(keyEvent({ key: "x" }))).toBe(false);
  });

  it("does not steal keystrokes from fields", () => {
    expect(
      gridOverlayKeyShouldToggle(keyEvent({ key: "g", target: target({ tagName: "INPUT" }) })),
    ).toBe(false);
    expect(isEditableGridOverlayTarget(target({ tagName: "TEXTAREA" }))).toBe(true);
    expect(isEditableGridOverlayTarget(target({ isContentEditable: true }))).toBe(true);
  });

  it("exports the document class the overlay CSS reads", () => {
    expect(GRID_ON_CLASS).toBe("grid-on");
  });
});

describe("gridGuidesDocumentSpread", () => {
  it("covers the document above and below the host without passing the scrollport", () => {
    expect(gridGuidesDocumentSpread(900, 400, 1400)).toEqual({ before: 900, after: 100 });
    expect(gridGuidesDocumentSpread(0, 800, 800)).toEqual({ before: 0, after: 0 });
  });

  it("floors partial pixels so the guides cannot grow the scrollport", () => {
    expect(gridGuidesDocumentSpread(900.8, 400.4, 1301.1)).toEqual({ before: 900, after: 0 });
  });

  it("stops page guides at a footer that sits below the host", () => {
    expect(gridGuidesSpreadLimit(800, 1200, 2400, 1800)).toBe(1800);
    expect(gridGuidesDocumentSpread(800, 400, gridGuidesSpreadLimit(800, 1200, 2400, 1800))).toEqual({
      before: 800,
      after: 600,
    });
    expect(gridGuidesSpreadLimit(800, 1200, 2400, null)).toBe(2400);
    expect(gridGuidesSpreadLimit(800, 1200, 2400, 400)).toBe(2400);
    expect(gridGuidesSpreadLimit(800, 948, 1848, 948)).toBe(948);
  });

  it("keeps column guides on the page tracks via CSS variables", () => {
    expect(gridCss).toMatch(/--grid-guides-before:\s*0px/);
    expect(gridCss).toMatch(/--grid-guides-after:\s*0px/);
    expect(gridCss).toContain("top: calc(0px - var(--grid-guides-before))");
    expect(gridCss).toContain("bottom: calc(0px - var(--grid-guides-after))");
    expect(gridCss).toMatch(/\.grid-guides-baseline[\s\S]*top:\s*var\(--grid-pad\)/);
  });
});
