import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { creatorInsightsLoadingPageCopySource } from "./insightsCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const showCodeSource = creatorInsightsLoadingPageCopySource;
const insightsSlice = showCodeSource.slice(
  showCodeSource.indexOf("export function PitchKitInsightsLoadingPage"),
);

const loadingStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitTopbarEndClasses",
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
  "pitchKitHeaderSectionClasses",
  "pitchKitHeaderSkeletonCopyClasses",
  "pitchKitHeaderSkeletonStackClasses",
  "pitchKitMetricsStackClasses",
  "pitchKitStatsBandClasses",
  "pitchKitStatClasses",
  "pitchKitDashboardGridClasses",
  "pitchKitReachCardClasses",
  "pitchKitCardWellClasses",
  "pitchKitSkeletonLegendRowClasses",
  "pitchKitAudienceCardClasses",
  "pitchKitAudienceWellClasses",
  "pitchKitAudienceSkeletonSectionClasses",
  "pitchKitAudienceSkeletonBarsClasses",
  "pitchKitPostsSectionClasses",
  "pitchKitPostsHeaderClasses",
  "pitchKitPostsPanelClasses",
  "pitchKitPostCardClasses",
  "pitchKitPostHeaderStartClasses",
  "pitchKitPostImageClasses",
  "pitchKitPostMetricsClasses",
  "pitchKitPostMetricClasses",
] as const;

describe("Pattern — creator Insights (loading) Show code", () => {
  it("wires the Pattern story to the freeze", () => {
    expect(storiesSource).toContain("creatorInsightsLoadingPageCopySource");
    expect(storiesSource).toContain('name: "Pattern — creator Insights (loading)"');
  });

  it("interpolates every loading-canvas pitchKitStyles token", () => {
    for (const key of loadingStyleKeys) {
      expect(showCodeSource, key).toContain(String(pitchKitStyles[key]));
    }
    expect(showCodeSource).toContain(
      String(pitchKitStyles.pitchKitReachChartMinHeight),
    );
  });

  it("freezes Stat loading, Skeleton wells, and proof placeholders", () => {
    expect(insightsSlice).toContain("export function PitchKitInsightsLoadingPage");
    expect(insightsSlice).toContain('label="Followers" value="" loading');
    expect(insightsSlice).toContain('label="Engagement rate" value="" loading');
    expect(insightsSlice).toContain('label="Typical reach" value="" loading');
    expect(insightsSlice).toContain('label="Saves" value="" loading');
    expect(insightsSlice).toContain('aria-label="Loading reach over 30 days"');
    expect(insightsSlice).toContain('aria-label="Loading audience fit"');
    expect(insightsSlice).toContain('aria-label="Loading recent proof"');
    expect(insightsSlice).toContain("length: proofSkeletonCount");
    expect(insightsSlice).toContain("<Skeleton");
    expect(insightsSlice).toContain("PitchKit primary navigation");
  });

  it("omits resolved marks, retrieving UI, zeros, and Storybook chrome", () => {
    expect(insightsSlice).not.toContain("Chart.Cartesian");
    expect(insightsSlice).not.toContain("Chart.Loading");
    expect(insightsSlice).not.toContain("Chart.Legend");
    expect(insightsSlice).not.toContain("Chart.RankedBars");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(insightsSlice).not.toContain("84.2K");
    expect(insightsSlice).not.toContain('value="—"');
    expect(insightsSlice).not.toContain("Insights are unavailable");
    expect(insightsSlice).not.toContain("No reach data yet");
    expect(insightsSlice).not.toContain("No audience data yet");
  });
});
