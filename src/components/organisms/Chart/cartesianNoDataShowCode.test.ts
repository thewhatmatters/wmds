import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const storiesSource = readFileSync(join(import.meta.dirname, "Chart.stories.tsx"), "utf8");

const storyStart = storiesSource.indexOf('name: "Pattern — Cartesian no-data gaps"');
const storyEnd = storiesSource.indexOf('name: "Reference — Cartesian gap modes"');
const copySourceStart = storiesSource.indexOf(
  'import { Chart, chartSeriesConfigFromTone } from "@whatmatters/wmds";',
  storyStart,
);
const showCodeSource = storiesSource.slice(copySourceStart, storyEnd);

describe("Pattern — Cartesian no-data gaps Show code", () => {
  it("extracts the Pattern Show code snippet", () => {
    expect(storyStart).toBeGreaterThan(-1);
    expect(copySourceStart).toBeGreaterThan(storyStart);
    expect(storyEnd).toBeGreaterThan(copySourceStart);
  });

  it("freezes the drop-in Cartesian gap contract", () => {
    expect(showCodeSource).toContain('from "@whatmatters/wmds"');
    expect(showCodeSource).toContain("chartSeriesConfigFromTone");
    expect(showCodeSource).toContain("Chart.Cartesian");
    expect(showCodeSource).toContain("const reach = index < 10 ? null");
    expect(showCodeSource).toContain('noData={{ label: "No data" }}');
    expect(showCodeSource).toContain('seriesKeys={["reach"]}');
  });

  it("does not invent a full-card empty or loading chrome", () => {
    expect(showCodeSource).not.toContain("Not enough reach history yet");
    expect(showCodeSource).not.toContain("Chart.Loading");
    expect(showCodeSource).not.toContain("<Skeleton");
    expect(showCodeSource).not.toContain("ExampleGridControls");
  });
});
