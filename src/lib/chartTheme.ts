import type { PartialTheme } from "@nivo/theming";

/**
 * WMDS chart tokens — map semantic CSS variables to Nivo theme + series color.
 * No Nivo color schemes or hex palettes.
 */

export const chartToken = {
  accent: "var(--color-accent)",
  fg: "var(--color-fg)",
  muted: "var(--color-muted)",
  surface: "var(--color-surface)",
  border: "var(--color-border)",
  font: "var(--font-family-body)",
} as const;

export const chartSeriesColor = chartToken.accent;

export const chartAreaOpacity = 0.12;

export const chartLineWidth = 2;

export const chartMargins = {
  top: 8,
  right: 12,
  bottom: 28,
  left: 36,
} as const;

/** Quiet Nivo chrome — muted ticks, hairline horizontal grid, token tooltip. */
export const chartNivoTheme: PartialTheme = {
  background: "transparent",
  text: {
    fill: chartToken.muted,
    fontFamily: chartToken.font,
    fontSize: 12,
  },
  axis: {
    domain: {
      line: { stroke: "transparent" },
    },
    ticks: {
      line: { stroke: "transparent" },
      text: { fill: chartToken.muted, fontFamily: chartToken.font, fontSize: 12 },
    },
    legend: {
      text: { fill: chartToken.muted },
    },
  },
  grid: {
    line: { stroke: chartToken.border, strokeWidth: 1 },
  },
  crosshair: {
    line: {
      stroke: chartToken.border,
      strokeWidth: 1,
    },
  },
  tooltip: {
    container: {
      background: chartToken.surface,
      color: chartToken.fg,
      border: `1px solid ${chartToken.border}`,
      borderRadius: 8,
      boxShadow: "none",
      fontFamily: chartToken.font,
      fontSize: 12,
    },
  },
};

/** One daily point in the 30-day series Pitchkit (and Storybook) pass in. */
export type ChartPoint = {
  /** Day on the x-axis — `Date` or ISO date (`YYYY-MM-DD`). */
  x: Date | string;
  y: number;
};

export function hasChartData(
  data?: readonly ChartPoint[] | null,
): data is readonly ChartPoint[] {
  return Array.isArray(data) && data.some((point) => point != null && Number.isFinite(point.y));
}

export function toNivoPoints(data: readonly ChartPoint[]): { x: Date; y: number }[] {
  return data.flatMap((point) => {
    if (point == null || !Number.isFinite(point.y)) {
      return [];
    }
    const x = point.x instanceof Date ? point.x : new Date(point.x);
    if (Number.isNaN(x.getTime())) {
      return [];
    }
    return [{ x, y: point.y }];
  });
}

export const chartTheme = {
  token: chartToken,
  seriesColor: chartSeriesColor,
  areaOpacity: chartAreaOpacity,
  lineWidth: chartLineWidth,
  margins: chartMargins,
  nivo: chartNivoTheme,
} as const;
