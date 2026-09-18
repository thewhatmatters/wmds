import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const storyStart = storiesSource.indexOf(
  'name: "State — insufficient audience data"',
);
const storyEnd = storiesSource.indexOf(
  "export const InsufficientReachAndAudienceData",
);
const copySourceStart = storiesSource.indexOf(
  "export function PitchKitInsightsInsufficientAudiencePage",
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
  "pitchKitCardWellClasses",
  "pitchKitAudienceCardClasses",
  "pitchKitAudienceEmptyWellClasses",
  "pitchKitAudienceEmptyCopyClasses",
  "pitchKitEmptyTitleClasses",
  "pitchKitEmptyBodyClasses",
] as const;

describe("State — insufficient audience data Show code", () => {
  it("extracts the State Show code snippet", () => {
    expect(storyStart).toBeGreaterThan(-1);
    expect(copySourceStart).toBeGreaterThan(storyStart);
    expect(storyEnd).toBeGreaterThan(copySourceStart);
  });

  it("interpolates Audience-empty and Insights page tokens", () => {
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
    expect(pitchKitStyles.pitchKitAudienceEmptyWellClasses).toContain(
      "items-center",
    );
    expect(pitchKitStyles.pitchKitAudienceEmptyWellClasses).toContain(
      "text-center",
    );
    expect(pitchKitStyles.pitchKitAudienceEmptyCopyClasses).toContain(
      "items-center",
    );
    expect(pitchKitStyles.pitchKitAudienceEmptyCopyClasses).toContain(
      "text-center",
    );
  });

  it("keeps the Audience band and empty body in the Insights shell", () => {
    expect(showCodeSource).toContain(
      "export function PitchKitInsightsInsufficientAudiencePage",
    );
    expect(showCodeSource).toContain("Audience fit");
    expect(showCodeSource).toContain("Ranked Instagram percentages");
    expect(showCodeSource).toContain("No audience data yet");
    expect(showCodeSource).toContain(
      "Connect Instagram Insights demographics when available.",
    );
    expect(showCodeSource).toContain("Reach over 30 days");
    expect(showCodeSource).toContain("Graph data");
    expect(showCodeSource).toContain("Chart.Cartesian");
    expect(showCodeSource).toContain("Recent proof");
    expect(showCodeSource).toContain("PitchKit primary navigation");
  });

  it("does not invent bars, loading, or Storybook chrome", () => {
    expect(showCodeSource).not.toContain("Chart.RankedBars");
    expect(showCodeSource).not.toContain("AudienceSection");
    expect(showCodeSource).not.toContain("Chart.Loading");
    expect(showCodeSource).not.toContain("<Skeleton");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(showCodeSource).not.toContain("Insights are unavailable");
    expect(showCodeSource).not.toContain("No reach data yet");
    expect(showCodeSource).not.toContain("United States");
    expect(showCodeSource).not.toContain("value: 42");
  });
});
