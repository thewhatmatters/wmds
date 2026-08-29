/** WMDS chart tokens — map semantic CSS variables to Recharts props. */

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
    stroke: "var(--color-fg)",
    fill: "var(--color-fg)",
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
    stroke: "var(--color-destructive)",
    fill: "var(--color-destructive)",
  },
};

export const chartUiTokens = {
  grid: "var(--color-border)",
  axis: "var(--color-muted)",
  cursor: "var(--color-border)",
  placeholder: "var(--color-border)",
  tooltipBg: "var(--color-bg)",
  tooltipBorder: "var(--color-border)",
  tooltipFg: "var(--color-fg)",
  tooltipMuted: "var(--color-muted)",
} as const;

/** Dot-grid canvas — apply class `wmds-chart-grid` or use `Chart` with `showGrid`. */
export const chartGrid = {
  className: "wmds-chart-grid",
  size: "14px",
  dot: "color-mix(in srgb, var(--color-fg) 8%, transparent)",
  dotDark: "color-mix(in srgb, var(--color-fg) 12%, transparent)",
} as const;

export const chartMargins: Record<ChartVariant, ChartMargins> = {
  hero: { top: 8, right: 8, bottom: 0, left: 8 },
  compact: { top: 6, right: 4, bottom: 0, left: 4 },
  sparkline: { top: 2, right: 0, bottom: 2, left: 0 },
};

export const chartAreaPresets: Record<ChartVariant, ChartAreaPreset> = {
  hero: {
    strokeWidth: 2,
    fillOpacity: 0.12,
    type: "monotone",
    animation: true,
  },
  compact: {
    strokeWidth: 2,
    fillOpacity: 0.1,
    type: "monotone",
    animation: true,
  },
  sparkline: {
    strokeWidth: 1.5,
    fillOpacity: 0.22,
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

/** Vertical gradient stops for area fills (Recharts linearGradient). */
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

/** Bundled theme for custom Recharts compositions in consumer apps. */
export const chartTheme = {
  colors: chartColorTokens,
  ui: chartUiTokens,
  margins: chartMargins,
  area: chartAreaPresets,
  chartStroke,
  chartFill,
  chartGradientStops,
  resolveChartTone,
} as const;
