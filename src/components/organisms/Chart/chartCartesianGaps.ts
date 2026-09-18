import type { ChartCartesianPoint } from "./chartCartesianContext";

export const chartCartesianGapModes = ["plotted", "all"] as const;

/** How in-series hatch bands decide that an x is missing. */
export type ChartCartesianGapMode = (typeof chartCartesianGapModes)[number];

/** Inclusive index run of missing values. */
export type ChartCartesianGapRun = {
  startIndex: number;
  endIndex: number;
};

/** Inclusive index run of plottable values for one series. */
export type ChartCartesianDefinedSegment = {
  startIndex: number;
  endIndex: number;
};

/** Explicit domain span for a hatch band. */
export type ChartCartesianGapRange = {
  start: Date;
  end: Date;
};

/** Resolved hatch band in plot pixels. */
export type ChartCartesianGapBand = ChartCartesianGapRange & {
  x: number;
  width: number;
};

export const chartCartesianNoDataLabelDefault = "No data";

/** Hide the centered pill when the band is narrower than a Badge sm label. */
export const chartCartesianNoDataMinPillWidth = 80;

export type ChartCartesianNoDataOptions = {
  /** Override the hatch pill — default **No data**. */
  label?: string;
  /**
   * Explicit domain spans. When omitted, contiguous `null` / `undefined`
   * (or non-finite) runs are derived from the data.
   */
  ranges?: ChartCartesianGapRange[];
  /**
   * `plotted` (default) — gap when every key in `seriesKeys` is missing.
   * `all` — gap when every key in the series config is missing.
   */
  mode?: ChartCartesianGapMode;
};

export type ChartCartesianNoDataProp = boolean | ChartCartesianNoDataOptions;

export type ChartCartesianNoDataResolved = {
  enabled: boolean;
  label: string;
  ranges?: ChartCartesianGapRange[];
  mode: ChartCartesianGapMode;
};

export function isChartCartesianNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isChartCartesianSeriesDefined(
  point: ChartCartesianPoint,
  key: string,
  yAccessor?: (point: ChartCartesianPoint, key: string) => number,
): boolean {
  const raw = point[key];
  if (raw === null || raw === undefined) {
    return false;
  }
  if (typeof raw === "number" && !Number.isFinite(raw)) {
    return false;
  }
  if (yAccessor != null) {
    return Number.isFinite(yAccessor(point, key));
  }
  return isChartCartesianNumber(raw);
}

export function isChartCartesianPointGap(
  point: ChartCartesianPoint,
  keys: string[],
  yAccessor?: (point: ChartCartesianPoint, key: string) => number,
): boolean {
  if (keys.length === 0) {
    return false;
  }
  return keys.every((key) => !isChartCartesianSeriesDefined(point, key, yAccessor));
}

export function chartCartesianHasPlottableValues(
  data: ChartCartesianPoint[],
  keys: string[],
  yAccessor?: (point: ChartCartesianPoint, key: string) => number,
): boolean {
  return data.some((point) =>
    keys.some((key) => isChartCartesianSeriesDefined(point, key, yAccessor)),
  );
}

export function resolveChartCartesianGapKeys({
  mode = "plotted",
  seriesKeys,
  configKeys,
}: {
  mode?: ChartCartesianGapMode;
  seriesKeys: string[];
  configKeys: string[];
}): string[] {
  return mode === "all" ? configKeys : seriesKeys;
}

export function resolveChartCartesianNoData(
  noData?: ChartCartesianNoDataProp,
): ChartCartesianNoDataResolved {
  if (noData === false) {
    return {
      enabled: false,
      label: chartCartesianNoDataLabelDefault,
      mode: "plotted",
    };
  }

  if (noData === true || noData == null) {
    return {
      enabled: true,
      label: chartCartesianNoDataLabelDefault,
      mode: "plotted",
    };
  }

  return {
    enabled: true,
    label: noData.label ?? chartCartesianNoDataLabelDefault,
    ranges: noData.ranges,
    mode: noData.mode ?? "plotted",
  };
}

function collectIndexRuns(
  data: ChartCartesianPoint[],
  isRunMember: (point: ChartCartesianPoint, index: number) => boolean,
): ChartCartesianGapRun[] {
  const runs: ChartCartesianGapRun[] = [];
  let startIndex: number | null = null;

  for (let index = 0; index < data.length; index++) {
    const inRun = isRunMember(data[index]!, index);
    if (inRun && startIndex == null) {
      startIndex = index;
    }
    if (!inRun && startIndex != null) {
      runs.push({ startIndex, endIndex: index - 1 });
      startIndex = null;
    }
  }

  if (startIndex != null) {
    runs.push({ startIndex, endIndex: data.length - 1 });
  }

  return runs;
}

/** Contiguous x-runs where every supplied key is missing. */
export function chartCartesianGapRuns(
  data: ChartCartesianPoint[],
  keys: string[],
  yAccessor?: (point: ChartCartesianPoint, key: string) => number,
): ChartCartesianGapRun[] {
  return collectIndexRuns(data, (point) => isChartCartesianPointGap(point, keys, yAccessor));
}

/** Contiguous plottable segments for one series — LinePath / Area `defined()` runs. */
export function chartCartesianDefinedSegments(
  data: ChartCartesianPoint[],
  key: string,
  yAccessor?: (point: ChartCartesianPoint, key: string) => number,
): ChartCartesianDefinedSegment[] {
  return collectIndexRuns(data, (point) => isChartCartesianSeriesDefined(point, key, yAccessor));
}

function midpoint(start: number, end: number): number {
  return (start + end) / 2;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function chartCartesianGapRangePixels(
  range: ChartCartesianGapRange,
  xScale: (date: Date) => number | undefined,
  innerWidth: number,
): Pick<ChartCartesianGapBand, "x" | "width"> {
  const startX = xScale(range.start) ?? 0;
  const endX = xScale(range.end) ?? innerWidth;
  const x = clamp(Math.min(startX, endX), 0, innerWidth);
  const right = clamp(Math.max(startX, endX), 0, innerWidth);
  return { x, width: Math.max(0, right - x) };
}

export function chartCartesianGapRunBand(
  run: ChartCartesianGapRun,
  data: ChartCartesianPoint[],
  xAccessor: (point: ChartCartesianPoint) => Date,
  xScale: (date: Date) => number | undefined,
  innerWidth: number,
): ChartCartesianGapBand {
  const startPoint = data[run.startIndex]!;
  const endPoint = data[run.endIndex]!;
  const startDate = xAccessor(startPoint);
  const endDate = xAccessor(endPoint);

  let x0 = xScale(startDate) ?? 0;
  let x1 = xScale(endDate) ?? innerWidth;

  if (run.startIndex === 0) {
    x0 = 0;
  } else {
    const previous = xScale(xAccessor(data[run.startIndex - 1]!)) ?? x0;
    x0 = midpoint(previous, x0);
  }

  if (run.endIndex >= data.length - 1) {
    x1 = innerWidth;
  } else {
    const next = xScale(xAccessor(data[run.endIndex + 1]!)) ?? x1;
    x1 = midpoint(x1, next);
  }

  const x = clamp(Math.min(x0, x1), 0, innerWidth);
  const right = clamp(Math.max(x0, x1), 0, innerWidth);

  return {
    start: startDate,
    end: endDate,
    x,
    width: Math.max(0, right - x),
  };
}

export function chartCartesianGapBands(options: {
  data: ChartCartesianPoint[];
  keys: string[];
  xAccessor: (point: ChartCartesianPoint) => Date;
  xScale: (date: Date) => number | undefined;
  innerWidth: number;
  yAccessor?: (point: ChartCartesianPoint, key: string) => number;
  ranges?: ChartCartesianGapRange[];
}): ChartCartesianGapBand[] {
  const { data, keys, xAccessor, xScale, innerWidth, yAccessor, ranges } = options;

  if (innerWidth <= 0 || data.length === 0) {
    return [];
  }

  if (ranges != null) {
    return ranges
      .map((range) => ({
        ...range,
        ...chartCartesianGapRangePixels(range, xScale, innerWidth),
      }))
      .filter((band) => band.width > 0);
  }

  return chartCartesianGapRuns(data, keys, yAccessor)
    .map((run) => chartCartesianGapRunBand(run, data, xAccessor, xScale, innerWidth))
    .filter((band) => band.width > 0);
}
