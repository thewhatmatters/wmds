import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const storiesSource = readFileSync(join(import.meta.dirname, "Chart.stories.tsx"), "utf8");
const storyStart = storiesSource.indexOf('name: "Pattern — revenue by line"');
const showCodeStart = storiesSource.indexOf(
  'import {\n  Card,\n  Chart,\n  Stat,',
  storyStart,
);

describe("Pattern — revenue by line Show code", () => {
  const showCode = storiesSource.slice(showCodeStart);

  it("ships a chart beside a stat column and an unwired state", () => {
    expect(storyStart).toBeGreaterThan(-1);
    expect(showCodeStart).toBeGreaterThan(storyStart);
    expect(showCode).toContain("export function RevenueByLine()");
    expect(showCode).toContain("Chart.Cartesian");
    expect(showCode).toContain('seriesKeys={["revenue"]}');
    expect(showCode).toContain('animate="none"');
    expect(showCode).toContain('label="Subscriptions"');
    expect(showCode).toContain("Revenue by line is not wired");
    expect(showCode).not.toContain("ExampleGridControls");
  });
});
