import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const storyStart = storiesSource.indexOf(
  'name: "State — insufficient reach data"',
);
const storyEnd = storiesSource.indexOf("export const InsufficientAudienceData");
const copySourceStart = storiesSource.indexOf(
  "export function PitchKitInsightsInsufficientReachPage",
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
  "pitchKitAudienceWellClasses",
] as const;

describe("State — insufficient reach data Show code", () => {
  it("extracts the State Show code snippet", () => {
    expect(storyStart).toBeGreaterThan(-1);
    expect(copySourceStart).toBeGreaterThan(storyStart);
    expect(storyEnd).toBeGreaterThan(copySourceStart);
  });

  it("interpolates Reach-empty and Insights page tokens", () => {
    for (const key of insufficientStyleKeys) {
      expect(showCodeSource, key).toContain(`\${${key}}`);
      expect(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]).length,
        key,
      ).toBeGreaterThan(0);
    }
    expect(showCodeSource).toContain("${pitchKitReachChartMinHeight}");
    expect(pitchKitStyles.pitchKitReachChartMinHeight).toBe(344);
    expect(pitchKitStyles.pitchKitReachEmptyWellClasses).toContain(
      pitchKitStyles.pitchKitCardWellClasses,
    );
    expect(pitchKitStyles.pitchKitReachEmptyWellClasses).toContain(
      "items-center",
    );
    expect(pitchKitStyles.pitchKitReachEmptyWellClasses).toContain(
      "text-center",
    );
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain(
      pitchKitStyles.pitchKitEmptyCopyClasses,
    );
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain(
      "items-center",
    );
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain(
      "text-center",
    );
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).toContain("gap-2");
    expect(pitchKitStyles.pitchKitReachEmptyCopyClasses).not.toContain("gap-3");
  });

  it("keeps the Reach band and empty body in the Insights shell", () => {
    expect(showCodeSource).toContain("export function PitchKitInsightsInsufficientReachPage");
    expect(showCodeSource).toContain("Reach over 30 days");
    expect(showCodeSource).toContain("Graph data");
    expect(showCodeSource).toContain(
      '<Badge variant="neutral" emphasis="muted">No data</Badge>',
    );
    expect(showCodeSource).toContain("No reach data yet");
    expect(showCodeSource).toContain(
      "Connect more Instagram activity to plot the last 30 days.",
    );
    expect(showCodeSource).not.toContain("invent a chart from a");
    expect(showCodeSource).toContain("Audience fit");
    expect(showCodeSource).toContain("Recent proof");
    expect(showCodeSource).toContain("PitchKit primary navigation");
  });

  it("does not invent a chart, loading, or Storybook chrome", () => {
    expect(showCodeSource).not.toContain("Chart.Cartesian");
    expect(showCodeSource).not.toContain("Chart.Loading");
    expect(showCodeSource).not.toContain("Chart.Legend");
    expect(showCodeSource).not.toContain("<Skeleton");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(showCodeSource).not.toContain("Insights are unavailable");
  });
});
