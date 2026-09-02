import { describe, expect, it } from "vitest";
import {
  chartNivoTheme,
  chartSeriesColor,
  chartToken,
  hasChartData,
  toNivoPoints,
} from "./chartTheme";

describe("chartTheme tokens", () => {
  it("uses WMDS CSS variables, not a Nivo palette", () => {
    expect(chartSeriesColor).toBe("var(--color-accent)");
    expect(chartToken.fg).toBe("var(--color-fg)");
    expect(chartToken.muted).toBe("var(--color-muted)");
    expect(chartToken.surface).toBe("var(--color-surface)");

    const serialized = JSON.stringify(chartNivoTheme);
    expect(serialized).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(serialized).not.toMatch(/nivo|category10|paired|set1|tableau/);
    expect(serialized).toContain("var(--color-");
  });
});

describe("hasChartData", () => {
  it("is false for empty or missing series", () => {
    expect(hasChartData(undefined)).toBe(false);
    expect(hasChartData(null)).toBe(false);
    expect(hasChartData([])).toBe(false);
    expect(hasChartData([{ x: "2026-09-01", y: Number.NaN }])).toBe(false);
  });

  it("is true when at least one finite y exists", () => {
    expect(hasChartData([{ x: "2026-09-01", y: 4 }])).toBe(true);
  });
});

describe("toNivoPoints", () => {
  it("normalizes ISO dates and drops invalid points", () => {
    expect(
      toNivoPoints([
        { x: "2026-09-01", y: 4 },
        { x: "not-a-date", y: 8 },
        { x: "2026-09-02", y: Number.NaN },
      ]),
    ).toEqual([{ x: new Date("2026-09-01"), y: 4 }]);
  });
});
