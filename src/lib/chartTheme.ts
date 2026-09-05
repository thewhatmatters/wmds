/** WMDS chart tokens — semantic CSS variables for visx-composed Chart patterns. */

import { backgroundPatternDotGridClasses } from "./backgroundPatterns";

export type ChartTone = "neutral" | "primary" | "success" | "destructive";
export type ChartVariant = "hero" | "compact" | "sparkline";

export type ChartMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ChartGradientStops = {
  top: string;
  topOpacity: number;
  bottom: string;
  bottomOpacity: number;
};

export type ChartAreaPreset = {
  strokeWidth: number;
  fillOpacity: number;
  type: "monotone" | "linear" | "step";
  animation: boolean;
};

/** Token-backed stroke/fill colors per tone. */
export const chartColorTokens: Record<ChartTone, { stroke: string; fill: string }> = {
  neutral: {
    stroke: "var(--color-text-primary)",
    fill: "var(--color-text-primary)",
  },
  primary: {
    stroke: "var(--color-primary)",
    fill: "var(--color-primary)",
  },
  success: {
    stroke: "var(--color-success)",
    fill: "var(--color-success)",
  },
  destructive: {
    stroke: "var(--color-error)",
    fill: "var(--color-error)",
  },
};

export const chartUiTokens = {
  grid: "var(--color-border)",
  axis: "var(--color-muted)",
  cursor: "var(--color-border)",
  placeholder: "var(--color-border)",
  tooltipBg: "var(--color-background-popover)",
  tooltipBorder: "var(--color-border)",
  tooltipFg: "var(--color-text-primary)",
  tooltipMuted: "var(--color-text-secondary)",
  /** Error state tick fill — soft error wash across the track. */
  errorSegment: "var(--color-error-muted)",
} as const;

/** Dot-grid canvas — apply `backgroundPatternDotGridClasses` or Chart shell with grid. */
export const chartGrid = {
  className: backgroundPatternDotGridClasses,
  size: "14px",
  dot: "color-mix(in srgb, var(--color-text-primary) 8%, transparent)",
  dotDark: "color-mix(in srgb, var(--color-text-primary) 12%, transparent)",
} as const;

export const chartMargins: Record<ChartVariant, ChartMargins> = {
  hero: { top: 8, right: 8, bottom: 0, left: 8 },
  compact: { top: 6, right: 4, bottom: 0, left: 4 },
  sparkline: { top: 2, right: 0, bottom: 2, left: 0 },
};

/** Cartesian plots — room for axis ticks and labels (ADR-0015). */
export const chartCartesianMargins: Record<ChartVariant, ChartMargins> = {
  hero: { top: 12, right: 12, bottom: 32, left: 44 },
  compact: { top: 8, right: 8, bottom: 28, left: 36 },
  sparkline: { top: 4, right: 4, bottom: 4, left: 4 },
};

export const chartAreaPresets: Record<ChartVariant, ChartAreaPreset> = {
  hero: {
    strokeWidth: 1.5,
    fillOpacity: 0.08,
    type: "monotone",
    animation: true,
  },
  compact: {
    strokeWidth: 1.5,
    fillOpacity: 0.08,
    type: "monotone",
    animation: true,
  },
  sparkline: {
    strokeWidth: 1.25,
    fillOpacity: 0.18,
    type: "monotone",
    animation: false,
  },
};

/** Resolve stroke color for a tone. */
export function chartStroke(tone: ChartTone = "neutral"): string {
  return chartColorTokens[tone].stroke;
}

/** Resolve fill color for a tone. */
export function chartFill(tone: ChartTone = "neutral"): string {
  return chartColorTokens[tone].fill;
}

/** Vertical gradient stops for area fills (SVG linearGradient). */
export function chartGradientStops(
  tone: ChartTone = "neutral",
  variant: ChartVariant = "hero",
): ChartGradientStops {
  const color = chartFill(tone);
  const preset = chartAreaPresets[variant];
  return {
    top: color,
    topOpacity: preset.fillOpacity,
    bottom: color,
    bottomOpacity: 0,
  };
}

/** Infer success/destructive from first vs last numeric value. */
export function resolveChartTone(values: (number | null | undefined)[]): ChartTone {
  const nums = values.filter((value): value is number => value != null && !Number.isNaN(value));
  if (nums.length < 2) {
    return "neutral";
  }

  return nums[nums.length - 1]! >= nums[0]! ? "success" : "destructive";
}

/** Scalar / slot charts — segmented capacity bar (no Cartesian axes). */
export const chartSegmentTickSpec = {
  /** Fixed tick width (px) — never stretch or shrink; group when container is too narrow. */
  width: 5,
  gap: 1,
  segmentRadius: 2,
} as const;

export type ChartSegmentTickSpec = typeof chartSegmentTickSpec;

export const chartSegmentPresets = {
  default: {
    segments: 60,
    height: 32,
    segmentRadius: 2,
  },
  compact: {
    segments: 40,
    height: 24,
    segmentRadius: 2,
  },
  /** Period strip — display count from {@link resolveSegmentedBarLayout} + bucketing. */
  periodWeek: {
    height: 32,
    segmentRadius: 2,
  },
  periodMonth: {
    height: 32,
    segmentRadius: 2,
  },
  periodQuarter: {
    height: 32,
    segmentRadius: 2,
  },
  periodYear: {
    height: 32,
    segmentRadius: 2,
  },
} as const;

export type ChartSegmentPreset = keyof typeof chartSegmentPresets;

export type ChartSegmentPresetConfig = (typeof chartSegmentPresets)[ChartSegmentPreset];

/** Dashboard period filter — drives period-strip segment count (Card.Header Select). */
export type ChartPeriodKind = "week" | "month" | "quarter" | "year" | "rolling";

export type ChartPeriod = {
  kind: ChartPeriodKind;
  /** Raw series length — e.g. 90 for last three months. */
  dayCount?: number;
  /** Display ticks when raw series is longer (e.g. 90 days → 30 ticks, 3 days each). */
  segments?: number;
};

export type ChartSegmentedBarMode = "capacity" | "period";

export type ChartPeriodAggregate = "avg" | "max" | "min";

export type ChartPeriodPoint = {
  label: string;
  rate: number;
};

/** One display tick — aggregate rate for bar height; `points` for tooltip drill-down. */
export type ChartPeriodBucket = {
  rate: number;
  label: string;
  points: ChartPeriodPoint[];
};

export type ChartBucketPeriodOptions = {
  aggregate?: ChartPeriodAggregate;
  pointLabel?: (dayIndex: number) => string;
  bucketLabel?: (startIndex: number, endIndex: number) => string;
};

/** Segment count for a period strip — display ticks (may be fewer than raw `dayCount`). */
export function resolvePeriodSegments(period: ChartPeriod): number {
  if (period.segments != null) {
    return period.segments;
  }

  switch (period.kind) {
    case "week":
      return 7;
    case "month":
      return period.dayCount ?? 30;
    case "quarter":
      return 13;
    case "year":
      return 12;
    case "rolling":
      return 30;
  }
}

/** Visual preset for a period kind — padding tuned for tick density. */
export function resolvePeriodSegmentPreset(period: ChartPeriod): ChartSegmentPreset {
  switch (period.kind) {
    case "week":
      return "periodWeek";
    case "month":
    case "rolling":
      return "periodMonth";
    case "quarter":
      return "periodQuarter";
    case "year":
      return "periodYear";
  }
}

function clampUnitRate(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

/** Pad or truncate rates to the resolved segment count (1:1 — prefer {@link chartBucketPeriodData}). */
export function chartNormalizePeriodData(data: readonly number[], segmentCount: number): number[] {
  return Array.from({ length: segmentCount }, (_, index) => clampUnitRate(data[index] ?? 0));
}

function aggregateRates(rates: number[], aggregate: ChartPeriodAggregate): number {
  if (rates.length === 0) {
    return 0;
  }

  if (aggregate === "max") {
    return Math.max(...rates);
  }

  if (aggregate === "min") {
    return Math.min(...rates);
  }

  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
}

/**
 * Map raw daily (or finer) rates to display buckets.
 * When `data.length` > `segmentCount`, groups points (e.g. 90 days → 30 ticks × 3 days).
 */
export function chartBucketPeriodData(
  data: readonly number[],
  segmentCount: number,
  options: ChartBucketPeriodOptions = {},
): ChartPeriodBucket[] {
  const aggregate = options.aggregate ?? "avg";
  const pointLabel = options.pointLabel ?? ((index: number) => `Day ${index + 1}`);
  const bucketLabel =
    options.bucketLabel ??
    ((startIndex: number, endIndex: number) =>
      startIndex === endIndex
        ? pointLabel(startIndex)
        : `${pointLabel(startIndex)} – ${pointLabel(endIndex)}`);

  if (segmentCount <= 0) {
    return [];
  }

  if (data.length === 0) {
    return Array.from({ length: segmentCount }, (_, index) => ({
      rate: 0,
      label: pointLabel(index),
      points: [],
    }));
  }

  if (data.length <= segmentCount) {
    return Array.from({ length: segmentCount }, (_, index) => {
      const rate = clampUnitRate(data[index] ?? 0);
      const label = pointLabel(index);

      return {
        rate,
        label,
        points: data[index] != null ? [{ label, rate }] : [],
      };
    });
  }

  return Array.from({ length: segmentCount }, (_, bucketIndex) => {
    const start = Math.floor((bucketIndex * data.length) / segmentCount);
    const end = Math.floor(((bucketIndex + 1) * data.length) / segmentCount);
    const sliceEnd = Math.max(end, start + 1);
    const points: ChartPeriodPoint[] = [];

    for (let index = start; index < sliceEnd; index += 1) {
      points.push({
        label: pointLabel(index),
        rate: clampUnitRate(data[index] ?? 0),
      });
    }

    return {
      rate: aggregateRates(
        points.map((point) => point.rate),
        aggregate,
      ),
      label: bucketLabel(start, sliceEnd - 1),
      points,
    };
  });
}

/** Center-to-center stride for fixed-width ticks. */
export function chartSegmentStride(
  tickSpec: Pick<ChartSegmentTickSpec, "width" | "gap"> = chartSegmentTickSpec,
): number {
  return tickSpec.width + tickSpec.gap;
}

/** Max equal-width ticks that fit in `containerWidth` without shrinking below spec. */
export function chartMaxTicksForWidth(
  containerWidth: number,
  tickSpec: Pick<ChartSegmentTickSpec, "width" | "gap"> = chartSegmentTickSpec,
): number {
  if (containerWidth <= 0) {
    return 0;
  }

  return Math.max(1, Math.floor((containerWidth + tickSpec.gap) / chartSegmentStride(tickSpec)));
}

/** Total SVG width for `tickCount` fixed-width ticks. */
export function chartSegmentBarWidth(
  tickCount: number,
  tickSpec: Pick<ChartSegmentTickSpec, "width" | "gap"> = chartSegmentTickSpec,
): number {
  if (tickCount <= 0) {
    return 0;
  }

  return tickCount * tickSpec.width + (tickCount - 1) * tickSpec.gap;
}

export function chartSegmentX(
  index: number,
  tickSpec: Pick<ChartSegmentTickSpec, "width" | "gap"> = chartSegmentTickSpec,
): number {
  return index * chartSegmentStride(tickSpec);
}

export function chartSegmentTickCenterX(
  index: number,
  tickSpec: Pick<ChartSegmentTickSpec, "width" | "gap"> = chartSegmentTickSpec,
): number {
  return chartSegmentX(index, tickSpec) + tickSpec.width / 2;
}

/** Resolve segment visual config — capacity presets include default tick count. */
export function resolveSegmentBarConfig(options: {
  mode: ChartSegmentedBarMode;
  preset?: ChartSegmentPreset;
  segments?: number;
  period?: ChartPeriod;
  dataLength?: number;
}): {
  preset: ChartSegmentPreset;
  config: ChartSegmentPresetConfig;
  segmentCount: number;
} {
  const { mode, preset, segments, period, dataLength = 0 } = options;

  if (mode === "period") {
    const resolvedPeriod = period ?? { kind: "month" as const, dayCount: dataLength || 30 };
    const resolvedPreset = preset ?? resolvePeriodSegmentPreset(resolvedPeriod);
    const segmentCount =
      segments ?? resolvedPeriod.segments ?? resolvePeriodSegments(resolvedPeriod);

    return {
      preset: resolvedPreset,
      config: chartSegmentPresets[resolvedPreset],
      segmentCount,
    };
  }

  const resolvedPreset = preset ?? "default";
  const config = chartSegmentPresets[resolvedPreset];
  const segmentCount =
    segments ??
    ("segments" in config ? config.segments : undefined) ??
    chartSegmentPresets.default.segments;

  return {
    preset: resolvedPreset,
    config,
    segmentCount,
  };
}

/**
 * Capacity meter layout — fixed 5px ticks, flex gap so the bar fills `containerWidth`.
 * Reduces tick count only when the card cannot fit the requested segments at min gap.
 */
export function resolveCapacityBarLayout(
  containerWidth: number,
  options: { segments?: number; preset?: ChartSegmentPreset } = {},
): {
  preset: ChartSegmentPreset;
  config: ChartSegmentPresetConfig;
  displayCount: number;
  tickWidth: number;
  gap: number;
  barWidth: number;
} {
  const tickSpec = chartSegmentTickSpec;
  const preset = options.preset ?? "default";
  const config = chartSegmentPresets[preset];
  const requestedSegments =
    options.segments ??
    ("segments" in config ? config.segments : undefined) ??
    chartSegmentPresets.default.segments;
  const maxFit = chartMaxTicksForWidth(containerWidth, tickSpec);
  const displayCount = Math.max(1, Math.min(requestedSegments, maxFit));
  const totalTickWidth = displayCount * tickSpec.width;
  const gap =
    displayCount > 1 ? Math.max(tickSpec.gap, (containerWidth - totalTickWidth) / (displayCount - 1)) : 0;

  return {
    preset,
    config,
    displayCount,
    tickWidth: tickSpec.width,
    gap,
    barWidth: containerWidth,
  };
}

export function chartSegmentPosition(
  index: number,
  tickWidth: number,
  gap: number,
): number {
  return index * (tickWidth + gap);
}

export function chartSegmentTickCenter(
  index: number,
  tickWidth: number,
  gap: number,
): number {
  return chartSegmentPosition(index, tickWidth, gap) + tickWidth / 2;
}

/** Segmented bar fill — `velocity` = single-tone fade; `semantic` = RAG (red → orange → yellow → green). */
export const chartSegmentFillVariants = {
  solid: {
    kind: "solid" as const,
  },
  velocity: {
    kind: "velocity" as const,
    startOpacity: 1,
    endOpacity: 0.22,
  },
  semantic: {
    kind: "semantic" as const,
    /** Full-bar RAG scale — each tick picks up hue by position (0 → capacity). */
    stops: [
      { offset: 0, color: "var(--color-chart-rag-1)" },
      { offset: 0.33, color: "var(--color-chart-rag-2)" },
      { offset: 0.66, color: "var(--color-chart-rag-3)" },
      { offset: 1, color: "var(--color-chart-rag-4)" },
    ],
  },
} as const;

export type ChartSegmentFillVariant = keyof typeof chartSegmentFillVariants;

/** v1 categorical series palette — 12 distinguishable hues, no semantic meaning (ADR-0013). */
export const chartCategoricalCount = 12 as const;

export const chartCategoricalPalette = [
  "var(--color-chart-categorical-1)",
  "var(--color-chart-categorical-2)",
  "var(--color-chart-categorical-3)",
  "var(--color-chart-categorical-4)",
  "var(--color-chart-categorical-5)",
  "var(--color-chart-categorical-6)",
  "var(--color-chart-categorical-7)",
  "var(--color-chart-categorical-8)",
  "var(--color-chart-categorical-9)",
  "var(--color-chart-categorical-10)",
  "var(--color-chart-categorical-11)",
  "var(--color-chart-categorical-12)",
] as const;

export type ChartCategoricalIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Resolve stroke/fill for series index — wraps modulo palette length. */
export function chartSeriesColor(index: number): string {
  const normalized =
    ((index % chartCategoricalPalette.length) + chartCategoricalPalette.length) %
    chartCategoricalPalette.length;
  return chartCategoricalPalette[normalized]!;
}

/** Format ratio as whole-percent display copy — e.g. 0.72 → "72%". */
export function chartFormatPercent(value: number, max: number): string {
  if (max <= 0) {
    return "0%";
  }

  return `${Math.round((value / max) * 100)}%`;
}

/** Indicator style for tooltip rows — shadcn Chart parity (ADR-0015). */
export const chartTooltipIndicators = ["dot", "line", "dashed"] as const;

export type ChartTooltipIndicator = (typeof chartTooltipIndicators)[number];

/** One series entry — shared by tooltip, legend, and Area marks. */
export type ChartSeriesConfigEntry = {
  label: string;
  color: string;
};

/** Series labels and colors decoupled from data shape (shadcn ChartConfig). */
export type ChartSeriesConfig = Record<string, ChartSeriesConfigEntry>;

/** Build categorical series config from keys + labels. */
export function chartSeriesConfigFromKeys(
  entries: ReadonlyArray<{ key: string; label: string }>,
  options?: { colorStartIndex?: number },
): ChartSeriesConfig {
  const start = options?.colorStartIndex ?? 0;
  return Object.fromEntries(
    entries.map(({ key, label }, index) => [
      key,
      { label, color: chartSeriesColor(start + index) },
    ]),
  );
}

/** Single semantic series — uses **ChartTone** stroke token, not categorical. */
export function chartSeriesConfigFromTone(
  key: string,
  label: string,
  tone: ChartTone = "primary",
): ChartSeriesConfig {
  const color = chartStroke(tone);
  return { [key]: { label, color } };
}

/** Tabular tooltip value — locale-aware grouping, no currency assumptions. */
export function chartFormatTooltipValue(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/** Default y-axis tick — integer grouping; compact notation from 10k+. */
export function chartFormatAxisValue(value: number): string {
  if (!Number.isFinite(value)) {
    return "";
  }

  const abs = Math.abs(value);
  if (abs >= 10_000) {
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

/** Default x-axis / header label for tooltip — period-aware date formatting. */
export function chartFormatTooltipLabel(date: Date, periodKind?: ChartPeriodKind): string {
  if (periodKind === "year") {
    return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date);
  }

  if (periodKind === "quarter") {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export type ChartTooltipItem = {
  /** Config key — matches ChartSeriesConfig. */
  key: string;
  label: string;
  value: string | number;
  color: string;
};

/** Map active series values + config to tooltip rows. */
export function chartTooltipItemsFromConfig(
  config: ChartSeriesConfig,
  values: Record<string, number | string | null | undefined>,
  keys?: string[],
): ChartTooltipItem[] {
  const order = keys ?? Object.keys(config);
  return order
    .filter((key) => config[key] != null && values[key] != null && values[key] !== undefined)
    .map((key) => {
      const entry = config[key]!;
      const raw = values[key]!;
      return {
        key,
        label: entry.label,
        color: entry.color,
        value: typeof raw === "number" ? chartFormatTooltipValue(raw) : raw,
      };
    });
}

/** Bundled theme for Chart patterns and custom visx compositions in consumer apps. */
export const chartTheme = {
  colors: chartColorTokens,
  ui: chartUiTokens,
  margins: chartMargins,
  cartesianMargins: chartCartesianMargins,
  area: chartAreaPresets,
  segments: chartSegmentPresets,
  segmentFill: chartSegmentFillVariants,
  segmentTick: chartSegmentTickSpec,
  categorical: chartCategoricalPalette,
  chartBucketPeriodData,
  chartMaxTicksForWidth,
  chartNormalizePeriodData,
  chartSegmentBarWidth,
  chartSegmentTickCenterX,
  chartSegmentX,
  chartSeriesColor,
  resolvePeriodSegmentPreset,
  resolvePeriodSegments,
  resolveSegmentBarConfig,
  resolveCapacityBarLayout,
  chartStroke,
  chartFill,
  chartGradientStops,
  chartFormatPercent,
  chartFormatTooltipLabel,
  chartFormatTooltipValue,
  chartSeriesConfigFromKeys,
  chartSeriesConfigFromTone,
  chartTooltipItemsFromConfig,
  chartGrid,
  resolveChartTone,
} as const;
