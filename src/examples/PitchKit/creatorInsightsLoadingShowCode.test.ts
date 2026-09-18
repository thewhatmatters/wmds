import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const storyStart = storiesSource.indexOf(
  'name: "Pattern — creator Insights (loading)"',
);
const storyEnd = storiesSource.indexOf(
  'name: "Pattern — shareable PitchKit"',
);
const copySourceStart = storiesSource.indexOf(
  "export function PitchKitInsightsLoadingPage",
  storyStart,
);
const showCodeSource = storiesSource.slice(copySourceStart, storyEnd);

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
  it("extracts the Pattern Show code snippet", () => {
    expect(storyStart).toBeGreaterThan(-1);
    expect(copySourceStart).toBeGreaterThan(storyStart);
    expect(storyEnd).toBeGreaterThan(copySourceStart);
  });

  it("interpolates every loading-canvas pitchKitStyles token", () => {
    for (const key of loadingStyleKeys) {
      expect(showCodeSource, key).toContain(`\${${key}}`);
      expect(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]).length,
        key,
      ).toBeGreaterThan(0);
    }
    expect(showCodeSource).toContain("${pitchKitReachChartMinHeight}");
  });

  it("freezes Stat loading, Skeleton wells, and proof placeholders", () => {
    expect(showCodeSource).toContain("export function PitchKitInsightsLoadingPage");
    expect(showCodeSource).toContain('label="Followers" value="" loading');
    expect(showCodeSource).toContain('label="Engagement rate" value="" loading');
    expect(showCodeSource).toContain('label="Typical reach" value="" loading');
    expect(showCodeSource).toContain('label="Saves" value="" loading');
    expect(showCodeSource).toContain('aria-label="Loading reach over 30 days"');
    expect(showCodeSource).toContain('aria-label="Loading audience fit"');
    expect(showCodeSource).toContain('aria-label="Loading recent proof"');
    expect(showCodeSource).toContain("length: proofSkeletonCount");
    expect(showCodeSource).toContain("<Skeleton");
    expect(showCodeSource).toContain("PitchKit primary navigation");
  });

  it("omits resolved marks, retrieving UI, zeros, and Storybook chrome", () => {
    expect(showCodeSource).not.toContain("Chart.Cartesian");
    expect(showCodeSource).not.toContain("Chart.Loading");
    expect(showCodeSource).not.toContain("Chart.Legend");
    expect(showCodeSource).not.toContain("Chart.RankedBars");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(showCodeSource).not.toContain("84.2K");
    expect(showCodeSource).not.toContain('value="—"');
    expect(showCodeSource).not.toContain("Insights are unavailable");
    expect(showCodeSource).not.toContain("No reach data yet");
    expect(showCodeSource).not.toContain("No audience data yet");
  });
});
