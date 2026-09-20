import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { creatorInsightsPageCopySource } from "./insightsCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitExample.tsx"),
  "utf8",
);

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
  it("wires the Pattern story to the Insights freeze", () => {
    expect(storiesSource).toContain("creatorInsightsPageCopySource");
    expect(storiesSource).toContain("Pattern — creator Insights");
  });

  it("interpolates every resolved-canvas pitchKitStyles token", () => {
    expect(resolvedCanvasStyleKeys.length).toBeGreaterThan(20);
    for (const key of resolvedCanvasStyleKeys) {
      expect(creatorInsightsPageCopySource, key).toContain(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]),
      );
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
    expect(creatorInsightsPageCopySource).toContain("{rankedPosts.length} shown");
    expect(creatorInsightsPageCopySource).toContain('label="Followers"');
    expect(creatorInsightsPageCopySource).toContain('trend={{ value: "+2.4%"');
    expect(creatorInsightsPageCopySource).toContain("Verified Instagram performance");
    expect(creatorInsightsPageCopySource).toContain("Ranked Instagram percentages");
    expect(creatorInsightsPageCopySource).toContain("Graph data");
    expect(creatorInsightsPageCopySource).toContain("AudienceSection");
    expect(creatorInsightsPageCopySource).toContain("Card.Footer");
    expect(creatorInsightsPageCopySource).toContain("<Toaster position=\"bottom-right\" />");
    expect(creatorInsightsPageCopySource).toContain("My account");
    expect(creatorInsightsPageCopySource).toContain("Privacy");
    expect(creatorInsightsPageCopySource).toContain("Support");
  });

  it("keeps Insights proof read-only and omits Share kit from PageHeader", () => {
    expect(creatorInsightsPageCopySource).toContain(
      '<PageHeader variant="page" title="Insights" />',
    );
    expect(creatorInsightsPageCopySource).not.toContain("Manage ranked post");
    expect(creatorInsightsPageCopySource).not.toContain("Swap post");
    expect(exampleSource).not.toContain("Share kit");
    expect(exampleSource).not.toContain("Manage ranked post");
    expect(exampleSource).not.toContain("Swap post");
  });

  it("omits Storybook-only inspector chrome from Show code", () => {
    expect(creatorInsightsPageCopySource).not.toContain("ExampleGridControls");
    expect(creatorInsightsPageCopySource).not.toContain("GridOverlay");
  });

  it("wires the pitchkit branch to the owner kit, not a placeholder", () => {
    expect(creatorInsightsPageCopySource).toContain("<OwnerPitchKit");
    expect(creatorInsightsPageCopySource).toContain("Your Pitchkit");
    expect(creatorInsightsPageCopySource).not.toContain("<ShareablePitchKit");
    expect(creatorInsightsPageCopySource).not.toContain("Coming soon");
    expect(creatorInsightsPageCopySource).not.toContain("pitchKitPlaceholder");
  });
});
