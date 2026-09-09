import { describe, expect, it } from "vitest";
import {
  allocateChartUnits,
  normalizeHeatmapValue,
  resolveDistributionDomain,
} from "./chartExploration";

describe("chart exploration helpers", () => {
  it("allocates exact unit counts and leaves unused cells empty", () => {
    const units = allocateChartUnits(
      [
        { key: "women", value: 68 },
        { key: "men", value: 30 },
      ],
      100,
    );

    expect(units).toHaveLength(100);
    expect(units.filter((key) => key === "women")).toHaveLength(68);
    expect(units.filter((key) => key === "men")).toHaveLength(30);
    expect(units.filter((key) => key == null)).toHaveLength(2);
  });

  it("normalizes over-allocated parts to the available unit total", () => {
    const units = allocateChartUnits(
      [
        { key: "a", value: 80 },
        { key: "b", value: 80 },
      ],
      100,
    );

    expect(units.filter((key) => key === "a")).toHaveLength(50);
    expect(units.filter((key) => key === "b")).toHaveLength(50);
  });

  it("pads identical distribution values into a visible domain", () => {
    expect(resolveDistributionDomain([42, 42])).toEqual([37.8, 46.2]);
  });

  it("clamps heatmap values to a unit intensity", () => {
    expect(normalizeHeatmapValue(-2, 10)).toBe(0);
    expect(normalizeHeatmapValue(5, 10)).toBe(0.5);
    expect(normalizeHeatmapValue(20, 10)).toBe(1);
  });
});
