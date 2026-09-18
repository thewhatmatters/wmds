import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitExample.tsx"),
  "utf8",
);

const copySourceStart = storiesSource.indexOf(
  'import { useState } from "react";',
);
const copySourceEnd = storiesSource.indexOf("export const GraphDataUnavailable");
const showCodeSource = storiesSource.slice(copySourceStart, copySourceEnd);

const exampleStyleKeys = [
  ...exampleSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

/** Empty / loading tokens belong on those State/Pattern freezes, not this resolved canvas. */
const nonResolvedStyleKeys = new Set([
  "pitchKitAudienceEmptyCopyClasses",
  "pitchKitAudienceEmptyWellClasses",
  "pitchKitAudienceSkeletonBarsClasses",
  "pitchKitAudienceSkeletonSectionClasses",
  "pitchKitEmptyBodyClasses",
  "pitchKitEmptyCardClasses",
  "pitchKitEmptyCopyClasses",
  "pitchKitEmptyTitleClasses",
  "pitchKitHeaderSkeletonCopyClasses",
  "pitchKitHeaderSkeletonStackClasses",
  "pitchKitReachEmptyCopyClasses",
  "pitchKitReachEmptyWellClasses",
  "pitchKitSkeletonLegendRowClasses",
]);

const resolvedCanvasStyleKeys = exampleStyleKeys.filter(
  (key) => !nonResolvedStyleKeys.has(key),
);

describe("Pattern — creator Insights Show code", () => {
  it("extracts the Pattern Show code snippet", () => {
    expect(copySourceStart).toBeGreaterThan(-1);
    expect(copySourceEnd).toBeGreaterThan(copySourceStart);
  });

  it("interpolates every resolved-canvas pitchKitStyles token", () => {
    expect(resolvedCanvasStyleKeys.length).toBeGreaterThan(20);
    for (const key of resolvedCanvasStyleKeys) {
      expect(showCodeSource, key).toContain(`\${${key}}`);
      expect(
        pitchKitStyles[key as keyof typeof pitchKitStyles].length,
        key,
      ).toBeGreaterThan(0);
    }
  });

  it("keeps canvas spacing, type, and well tokens on those styles", () => {
    expect(pitchKitStyles.pitchKitContentBandClasses).toContain("pt-6 sm:pt-8");
    expect(pitchKitStyles.pitchKitContentClasses).toContain("gap-y-6 sm:gap-y-8");
    expect(pitchKitStyles.pitchKitSupportingClasses).toContain("type-body");
    expect(pitchKitStyles.pitchKitFormulaClasses).toContain("type-supporting");
    expect(pitchKitStyles.pitchKitStatClasses).not.toContain("w-full");
    expect(pitchKitStyles.pitchKitCardWellClasses).toContain(
      "rounded-[var(--radius-card-body)]",
    );
    expect(pitchKitStyles.pitchKitAudienceWellClasses).toContain("sm:grid-cols-2");
  });

  it("mirrors canvas chrome that the previous freeze omitted", () => {
    expect(showCodeSource).toContain("{visiblePosts.length} shown");
    expect(showCodeSource).toContain('label="Followers"');
    expect(showCodeSource).toContain('trend={{ value: "+2.4%"');
    expect(showCodeSource).toContain("Verified Instagram performance");
    expect(showCodeSource).toContain("Ranked Instagram percentages");
    expect(showCodeSource).toContain("Graph data");
    expect(showCodeSource).toContain("AudienceSection");
    expect(showCodeSource).toContain("Card.Footer");
    expect(showCodeSource).toContain("<Toaster position=\"bottom-right\" />");
  });

  it("omits Storybook-only inspector chrome from Show code", () => {
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
  });

  it("wires the pitchkit branch to the shareable kit, not a placeholder", () => {
    expect(showCodeSource).toContain("<ShareablePitchKit");
    expect(showCodeSource).toContain("${shareablePitchKitCopySource}");
    expect(showCodeSource).not.toContain("Coming soon");
    expect(showCodeSource).not.toContain("pitchKitPlaceholder");
  });
});
