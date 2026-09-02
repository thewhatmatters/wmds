import { ResponsiveLine } from "@nivo/line";
import type { PointTooltipProps } from "@nivo/line";
import { cn } from "../../../lib/cn";
import {
  chartAreaOpacity,
  chartLineWidth,
  chartMargins,
  chartNivoTheme,
  chartSeriesColor,
  hasChartData,
  toNivoPoints,
  type ChartPoint,
} from "../../../lib/chartTheme";
import {
  chartFrameClasses,
  chartPlotClasses,
  chartTooltipClasses,
  chartTooltipMetaClasses,
  chartTooltipValueClasses,
} from "./chartStyles";

export type { ChartPoint };

/** Layout-only — width, height, margin. Not for series color or chrome. */
export type ChartLayoutClassName = string;

export interface ChartProps {
  /**
   * One 30-day series. Empty, missing, or non-finite values render nothing.
   * Pitchkit hides Insights chrome when this series is absent.
   */
  data?: readonly ChartPoint[] | null;
  /** Layout-only: width, height, flex placement. */
  className?: ChartLayoutClassName;
  "aria-label"?: string;
}

type ChartSeries = {
  id: string;
  data: { x: Date; y: number }[];
};

function ChartTooltip({ point }: PointTooltipProps<ChartSeries>) {
  return (
    <div className={chartTooltipClasses}>
      <p className={chartTooltipMetaClasses}>{point.data.xFormatted}</p>
      <p className={chartTooltipValueClasses}>{point.data.yFormatted}</p>
    </div>
  );
}

/**
 * One-series 30-day area + line — Nivo engine, WMDS tokens.
 * No legend, no vertical grid, monotone curve. Empty data renders nothing.
 */
export function Chart({
  data,
  className,
  "aria-label": ariaLabel = "30-day trend",
}: ChartProps) {
  if (!hasChartData(data)) {
    return null;
  }

  const points = toNivoPoints(data);
  if (points.length === 0) {
    return null;
  }

  return (
    <div className={cn(chartFrameClasses, className)} role="img" aria-label={ariaLabel}>
      <div className={chartPlotClasses}>
        <ResponsiveLine<ChartSeries>
          data={[{ id: "value", data: points }]}
          theme={chartNivoTheme}
          colors={[chartSeriesColor]}
          curve="monotoneX"
          enableArea
          areaOpacity={chartAreaOpacity}
          lineWidth={chartLineWidth}
          enablePoints={false}
          enableGridX={false}
          enableGridY
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: "%b %d",
            tickValues: 4,
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: 3,
          }}
          xScale={{ type: "time", format: "native", precision: "day", useUTC: true }}
          xFormat="time:%b %d"
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, nice: true }}
          margin={chartMargins}
          layers={["grid", "axes", "areas", "crosshair", "lines", "mesh"]}
          legends={[]}
          useMesh
          enableSlices={false}
          isInteractive
          animate={false}
          tooltip={ChartTooltip}
        />
      </div>
    </div>
  );
}
