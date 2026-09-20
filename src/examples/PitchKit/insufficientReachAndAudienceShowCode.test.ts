import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { insufficientReachAndAudiencePageCopySource } from "./insightsCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const showCodeSource = insufficientReachAndAudiencePageCopySource;
const insightsSlice = showCodeSource.slice(
  showCodeSource.indexOf(
    "export function PitchKitInsightsInsufficientReachAndAudiencePage",
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
  "pitchKitReachEmptyWellClasses",
  "pitchKitReachEmptyCopyClasses",
  "pitchKitEmptyTitleClasses",
  "pitchKitEmptyBodyClasses",
] as const;

const noDataBadge =
  '<Badge variant="neutral" emphasis="muted">No data</Badge>';

describe("State — insufficient reach and audience data Show code", () => {
  it("wires the State story to the freeze", () => {
    expect(storiesSource).toContain("insufficientReachAndAudiencePageCopySource");
    expect(storiesSource).toContain(
      'name: "State — insufficient reach and audience data"',
    );
  });

  it("interpolates both empty well tokens", () => {
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
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain("gap-2");
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).not.toContain("gap-3");
  });

  it("keeps both empty Badge stacks in the Insights shell", () => {
    expect(insightsSlice).toContain(
      "export function PitchKitInsightsInsufficientReachAndAudiencePage",
    );
    expect(insightsSlice).toContain("Reach over 30 days");
    expect(insightsSlice).toContain("Graph data");
    expect(insightsSlice).toContain("No reach data yet");
    expect(insightsSlice).toContain(
      "Connect more Instagram activity to plot the last 30 days.",
    );
    expect(insightsSlice).toContain("Audience fit");
    expect(insightsSlice).toContain("No audience data yet");
    expect(insightsSlice).toContain(
      "Connect Instagram Insights demographics when available.",
    );
    expect(insightsSlice).toContain(noDataBadge);
    expect(insightsSlice.split(noDataBadge)).toHaveLength(3);
    expect(insightsSlice).toContain("Recent proof");
    expect(insightsSlice).toContain("PitchKit primary navigation");
  });

  it("does not invent a chart, bars, loading, or Storybook chrome", () => {
    expect(insightsSlice).not.toContain("Chart.Cartesian");
    expect(insightsSlice).not.toContain("Chart.RankedBars");
    expect(insightsSlice).not.toContain("AudienceSection");
    expect(insightsSlice).not.toContain("Chart.Loading");
    expect(insightsSlice).not.toContain("Chart.Legend");
    expect(insightsSlice).not.toContain("<Skeleton");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(insightsSlice).not.toContain("Insights are unavailable");
  });
});
