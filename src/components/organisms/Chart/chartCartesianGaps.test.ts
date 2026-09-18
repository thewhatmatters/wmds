import { describe, expect, it } from "vitest";
import { buildCartesianSeriesWithLeadingGap } from "../../../lib/chartSampleData";
import type { ChartCartesianPoint } from "./chartCartesianContext";
import {
  chartCartesianDefinedSegments,
  chartCartesianGapBands,
  chartCartesianGapRangePixels,
  chartCartesianGapRunBand,
  chartCartesianGapRuns,
  chartCartesianHasPlottableValues,
  isChartCartesianNumber,
  isChartCartesianPointGap,
  isChartCartesianSeriesDefined,
  resolveChartCartesianGapKeys,
  resolveChartCartesianNoData,
} from "./chartCartesianGaps";

function point(day: number, values: Record<string, number | null | undefined>): ChartCartesianPoint {
  return { date: new Date(2026, 5, day), ...values };
}

const series = [
  point(1, { reach: null }),
  point(2, { reach: undefined }),
  point(3, { reach: Number.NaN }),
  point(4, { reach: 4100 }),
  point(5, { reach: 4200 }),
  point(6, { reach: null }),
  point(7, { reach: 4300 }),
];

describe("isChartCartesianNumber", () => {
  it("accepts finite numbers including zero", () => {
    expect(isChartCartesianNumber(0)).toBe(true);
    expect(isChartCartesianNumber(12.5)).toBe(true);
  });

  it("rejects null, undefined, and non-finite numbers", () => {
    expect(isChartCartesianNumber(null)).toBe(false);
    expect(isChartCartesianNumber(undefined)).toBe(false);
    expect(isChartCartesianNumber(Number.NaN)).toBe(false);
    expect(isChartCartesianNumber(Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe("isChartCartesianSeriesDefined", () => {
  it("treats null, undefined, and NaN as gaps", () => {
    expect(isChartCartesianSeriesDefined(series[0]!, "reach")).toBe(false);
    expect(isChartCartesianSeriesDefined(series[1]!, "reach")).toBe(false);
    expect(isChartCartesianSeriesDefined(series[2]!, "reach")).toBe(false);
  });

  it("plots zero and finite values", () => {
    expect(isChartCartesianSeriesDefined({ date: series[0]!.date, reach: 0 }, "reach")).toBe(true);
    expect(isChartCartesianSeriesDefined(series[3]!, "reach")).toBe(true);
  });

  it("honors a yAccessor that returns a non-finite number", () => {
    expect(
      isChartCartesianSeriesDefined(series[3]!, "reach", () => Number.NaN),
    ).toBe(false);
  });
});

describe("gap runs and defined segments", () => {
  it("groups contiguous missing values for the plotted series", () => {
    expect(chartCartesianGapRuns(series, ["reach"])).toEqual([
      { startIndex: 0, endIndex: 2 },
      { startIndex: 5, endIndex: 5 },
    ]);
  });

  it("returns defined segments that LinePath / Area can stroke", () => {
    expect(chartCartesianDefinedSegments(series, "reach")).toEqual([
      { startIndex: 3, endIndex: 4 },
      { startIndex: 6, endIndex: 6 },
    ]);
  });

  it("does not hatch when another plotted series still has a value", () => {
    const multi: ChartCartesianPoint[] = [
      point(1, { reach: null, typical: 9000 }),
      point(2, { reach: null, typical: null }),
      point(3, { reach: 4100, typical: 9000 }),
    ];

    expect(chartCartesianGapRuns(multi, ["reach", "typical"])).toEqual([
      { startIndex: 1, endIndex: 1 },
    ]);
    expect(isChartCartesianPointGap(multi[0]!, ["reach"])).toBe(true);
    expect(isChartCartesianPointGap(multi[0]!, ["reach", "typical"])).toBe(false);
  });

  it("uses plotted keys by default and all config keys when asked", () => {
    expect(
      resolveChartCartesianGapKeys({
        seriesKeys: ["reach"],
        configKeys: ["typical", "reach"],
      }),
    ).toEqual(["reach"]);
    expect(
      resolveChartCartesianGapKeys({
        mode: "all",
        seriesKeys: ["reach"],
        configKeys: ["typical", "reach"],
      }),
    ).toEqual(["typical", "reach"]);
  });
});

describe("chartCartesianHasPlottableValues", () => {
  it("is true when any key has a finite value", () => {
    expect(chartCartesianHasPlottableValues(series, ["reach"])).toBe(true);
  });

  it("is false when the whole window is missing — use the Card empty Pattern", () => {
    const empty = [point(1, { reach: null }), point(2, { reach: null })];
    expect(chartCartesianHasPlottableValues(empty, ["reach"])).toBe(false);
  });
});

describe("gap pixel bands", () => {
  const dates = series.map((item) => item.date);
  const xScale = (date: Date) => {
    const index = dates.findIndex((item) => item.getTime() === date.getTime());
    return index * 10;
  };

  it("extends a leading run from the plot origin to the first defined midpoint", () => {
    const band = chartCartesianGapRunBand(
      { startIndex: 0, endIndex: 2 },
      series,
      (item) => item.date,
      xScale,
      60,
    );

    expect(band.x).toBe(0);
    expect(band.width).toBe(25);
    expect(band.start).toEqual(series[0]!.date);
    expect(band.end).toEqual(series[2]!.date);
  });

  it("spans an interior run between neighboring defined midpoints", () => {
    const band = chartCartesianGapRunBand(
      { startIndex: 5, endIndex: 5 },
      series,
      (item) => item.date,
      xScale,
      60,
    );

    expect(band.x).toBe(45);
    expect(band.width).toBe(10);
  });

  it("maps explicit ranges through the scale", () => {
    expect(
      chartCartesianGapRangePixels(
        { start: series[0]!.date, end: series[3]!.date },
        xScale,
        60,
      ),
    ).toEqual({ x: 0, width: 30 });
  });

  it("prefers explicit ranges over derived null runs", () => {
    const bands = chartCartesianGapBands({
      data: series,
      keys: ["reach"],
      xAccessor: (item) => item.date,
      xScale,
      innerWidth: 60,
      ranges: [{ start: series[3]!.date, end: series[4]!.date }],
    });

    expect(bands).toHaveLength(1);
    expect(bands[0]).toMatchObject({ x: 30, width: 10 });
  });
});

describe("buildCartesianSeriesWithLeadingGap", () => {
  it("nulls the leading window and keeps later values plottable", () => {
    const data = buildCartesianSeriesWithLeadingGap({ dayCount: 12, gapDays: 4 });

    expect(data).toHaveLength(12);
    expect(data.slice(0, 4).every((point) => point.reach == null)).toBe(true);
    expect(chartCartesianDefinedSegments(data, "reach")[0]).toEqual({
      startIndex: 4,
      endIndex: 11,
    });
    expect(chartCartesianHasPlottableValues(data, ["reach"])).toBe(true);
  });
});

describe("resolveChartCartesianNoData", () => {
  it("enables auto-detected gaps by default", () => {
    expect(resolveChartCartesianNoData()).toEqual({
      enabled: true,
      label: "No data",
      mode: "plotted",
    });
  });

  it("can disable the hatch entirely", () => {
    expect(resolveChartCartesianNoData(false).enabled).toBe(false);
  });

  it("accepts a custom label, mode, and explicit ranges", () => {
    const start = new Date(2026, 5, 1);
    const end = new Date(2026, 5, 10);
    expect(
      resolveChartCartesianNoData({
        label: "Awaiting crawl",
        mode: "all",
        ranges: [{ start, end }],
      }),
    ).toEqual({
      enabled: true,
      label: "Awaiting crawl",
      mode: "all",
      ranges: [{ start, end }],
    });
  });
});
