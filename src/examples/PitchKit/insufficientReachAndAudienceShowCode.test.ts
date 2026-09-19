import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const storyStart = storiesSource.indexOf(
  'name: "State — insufficient reach and audience data"',
);
const storyEnd = storiesSource.indexOf("export const CreatorInsightsLoading");
const copySourceStart = storiesSource.indexOf(
  "export function PitchKitInsightsInsufficientReachAndAudiencePage",
  storyStart,
);
const showCodeSource = storiesSource.slice(copySourceStart, storyEnd);

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
  "pitchKitAudienceCardClasses",
  "pitchKitAudienceEmptyWellClasses",
  "pitchKitAudienceEmptyCopyClasses",
] as const;

const noDataBadge =
  '<Badge variant="neutral" emphasis="muted">No data</Badge>';

describe("State — insufficient reach and audience data Show code", () => {
  it("extracts the State Show code snippet", () => {
    expect(storyStart).toBeGreaterThan(-1);
    expect(copySourceStart).toBeGreaterThan(storyStart);
    expect(storyEnd).toBeGreaterThan(copySourceStart);
  });

  it("interpolates both empty well tokens", () => {
    for (const key of insufficientStyleKeys) {
      expect(showCodeSource, key).toContain(`\${${key}}`);
      expect(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]).length,
        key,
      ).toBeGreaterThan(0);
    }
    expect(showCodeSource).toContain("${pitchKitReachChartMinHeight}");
    expect(pitchKitStyles.pitchKitReachChartMinHeight).toBe(344);
    expect(pitchKitStyles.pitchKitAudienceEmptyWellClasses).toBe(
      pitchKitStyles.pitchKitReachEmptyWellClasses,
    );
    expect(pitchKitStyles.pitchKitAudienceEmptyCopyClasses).toBe(
      pitchKitStyles.pitchKitReachEmptyCopyClasses,
    );
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain("gap-3");
  });

  it("keeps both empty Badge stacks in the Insights shell", () => {
    expect(showCodeSource).toContain(
      "export function PitchKitInsightsInsufficientReachAndAudiencePage",
    );
    expect(showCodeSource).toContain("Reach over 30 days");
    expect(showCodeSource).toContain("Graph data");
    expect(showCodeSource).toContain("No reach data yet");
    expect(showCodeSource).toContain(
      "Connect more Instagram activity to plot the last 30 days.",
    );
    expect(showCodeSource).toContain("Audience fit");
    expect(showCodeSource).toContain("No audience data yet");
    expect(showCodeSource).toContain(
      "Connect Instagram Insights demographics when available.",
    );
    expect(showCodeSource).toContain(noDataBadge);
    expect(showCodeSource.split(noDataBadge)).toHaveLength(3);
    expect(showCodeSource).toContain("Recent proof");
    expect(showCodeSource).toContain("PitchKit primary navigation");
  });

  it("does not invent a chart, bars, loading, or Storybook chrome", () => {
    expect(showCodeSource).not.toContain("Chart.Cartesian");
    expect(showCodeSource).not.toContain("Chart.RankedBars");
    expect(showCodeSource).not.toContain("AudienceSection");
    expect(showCodeSource).not.toContain("Chart.Loading");
    expect(showCodeSource).not.toContain("Chart.Legend");
    expect(showCodeSource).not.toContain("<Skeleton");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(showCodeSource).not.toContain("Insights are unavailable");
  });
});
