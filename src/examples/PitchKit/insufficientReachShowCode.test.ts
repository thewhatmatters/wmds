import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { insufficientReachPageCopySource } from "./insightsCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
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
  "pitchKitAudienceCardClasses",
  "pitchKitAudienceWellClasses",
] as const;

describe("State — insufficient reach data Show code", () => {
  it("wires the State story to the freeze", () => {
    expect(storiesSource).toContain("insufficientReachPageCopySource");
    expect(storiesSource).toContain('name: "State — insufficient reach data"');
  });

  it("interpolates Reach-empty and Insights page tokens", () => {
    for (const key of insufficientStyleKeys) {
      expect(insufficientReachPageCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(insufficientReachPageCopySource).toContain(
      String(pitchKitStyles.pitchKitReachChartMinHeight),
    );
    expect(pitchKitStyles.pitchKitReachChartMinHeight).toBe(344);
    expect(pitchKitStyles.pitchKitReachEmptyWellClasses).toContain(
      pitchKitStyles.pitchKitCardWellClasses,
    );
    expect(pitchKitStyles.pitchKitReachEmptyWellClasses).toContain("items-center");
    expect(pitchKitStyles.pitchKitReachEmptyWellClasses).toContain("text-center");
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain(
      pitchKitStyles.pitchKitEmptyCopyClasses,
    );
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain("gap-2");
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).not.toContain("gap-3");
  });

  it("keeps the Reach band and empty body in the Insights shell", () => {
    expect(insufficientReachPageCopySource).toContain(
      "export function PitchKitInsightsInsufficientReachPage",
    );
    expect(insufficientReachPageCopySource).toContain("Reach over 30 days");
    expect(insufficientReachPageCopySource).toContain("Graph data");
    expect(insufficientReachPageCopySource).toContain(
      '<Badge variant="neutral" emphasis="muted">No data</Badge>',
    );
    expect(insufficientReachPageCopySource).toContain("No reach data yet");
    expect(insufficientReachPageCopySource).toContain(
      "Connect more Instagram activity to plot the last 30 days.",
    );
    expect(insufficientReachPageCopySource).not.toContain("invent a chart from a");
    expect(insufficientReachPageCopySource).toContain("Audience fit");
    expect(insufficientReachPageCopySource).toContain("Recent proof");
    expect(insufficientReachPageCopySource).toContain("PitchKit primary navigation");
  });

  it("does not invent a chart, loading, or Storybook chrome", () => {
    const insightsSlice = insufficientReachPageCopySource.slice(
      insufficientReachPageCopySource.indexOf(
        "export function PitchKitInsightsInsufficientReachPage",
      ),
    );
    expect(insightsSlice).not.toContain("Chart.Cartesian");
    expect(insightsSlice).not.toContain("Chart.Loading");
    expect(insightsSlice).not.toContain("Chart.Legend");
    expect(insightsSlice).not.toContain("<Skeleton");
    expect(insufficientReachPageCopySource).not.toContain("ExampleGridControls");
    expect(insufficientReachPageCopySource).not.toContain("GridOverlay");
    expect(insufficientReachPageCopySource).not.toContain("Insights are unavailable");
  });
});
