import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { insufficientAudiencePageCopySource } from "./insightsCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const showCodeSource = insufficientAudiencePageCopySource;
const insightsSlice = showCodeSource.slice(
  showCodeSource.indexOf(
    "export function PitchKitInsightsInsufficientAudiencePage",
  ),
);

const insufficientStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitTopbarEndClasses",
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
  "pitchKitHeaderSectionClasses",
  "pitchKitHeaderCopyClasses",
  "pitchKitSupportingClasses",
  "pitchKitFormulaClasses",
  "pitchKitMetricsStackClasses",
  "pitchKitStatsBandClasses",
  "pitchKitStatClasses",
  "pitchKitDashboardGridClasses",
  "pitchKitReachCardClasses",
  "pitchKitCardWellClasses",
  "pitchKitAudienceCardClasses",
  "pitchKitAudienceEmptyWellClasses",
  "pitchKitAudienceEmptyCopyClasses",
  "pitchKitEmptyTitleClasses",
  "pitchKitEmptyBodyClasses",
] as const;

describe("State — insufficient audience data Show code", () => {
  it("wires the State story to the freeze", () => {
    expect(storiesSource).toContain("insufficientAudiencePageCopySource");
    expect(storiesSource).toContain('name: "State — insufficient audience data"');
  });

  it("interpolates Audience-empty and Insights page tokens", () => {
    for (const key of insufficientStyleKeys) {
      expect(showCodeSource, key).toContain(String(pitchKitStyles[key]));
    }
    expect(showCodeSource).toContain(
      String(pitchKitStyles.pitchKitReachChartMinHeight),
    );
    expect(pitchKitStyles.pitchKitReachChartMinHeight).toBe(344);
    expect(pitchKitStyles.pitchKitAudienceEmptyWellClasses).toBe(
      pitchKitStyles.pitchKitReachEmptyWellClasses,
    );
    expect(pitchKitStyles.pitchKitAudienceEmptyCopyClasses).toBe(
      pitchKitStyles.pitchKitReachEmptyCopyClasses,
    );
    expect(pitchKitStyles.pitchKitAudienceEmptyCopyClasses).toContain("gap-2");
    expect(pitchKitStyles.pitchKitAudienceEmptyCopyClasses).not.toContain("gap-3");
  });

  it("keeps the Audience band and empty body in the Insights shell", () => {
    expect(insightsSlice).toContain(
      "export function PitchKitInsightsInsufficientAudiencePage",
    );
    expect(insightsSlice).toContain("Audience fit");
    expect(insightsSlice).toContain("Ranked Instagram percentages");
    expect(insightsSlice).toContain(
      '<Badge variant="neutral" emphasis="muted">No data</Badge>',
    );
    expect(insightsSlice).toContain("No audience data yet");
    expect(insightsSlice).toContain(
      "Connect Instagram Insights demographics when available.",
    );
    expect(insightsSlice).toContain("Reach over 30 days");
    expect(insightsSlice).toContain("Graph data");
    expect(insightsSlice).toContain("Chart.Cartesian");
    expect(insightsSlice).toContain("Recent proof");
    expect(insightsSlice).toContain("PitchKit primary navigation");
  });

  it("does not invent bars, loading, or Storybook chrome", () => {
    expect(insightsSlice).not.toContain("Chart.RankedBars");
    expect(insightsSlice).not.toContain("AudienceSection");
    expect(insightsSlice).not.toContain("Chart.Loading");
    expect(insightsSlice).not.toContain("<Skeleton");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(insightsSlice).not.toContain("Insights are unavailable");
    expect(insightsSlice).not.toContain("No reach data yet");
    expect(insightsSlice).not.toContain("United States");
    expect(insightsSlice).not.toContain("value: 42");
  });
});
