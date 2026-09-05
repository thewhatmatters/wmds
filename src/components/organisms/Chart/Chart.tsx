import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Group } from "@visx/group";
import { cn } from "../../../lib/cn";
import {
  chartSegmentFillVariants,
  chartSegmentPresets,
  chartSegmentPosition,
  chartStroke,
  chartUiTokens,
  resolveCapacityBarLayout,
  type ChartSegmentFillVariant,
  type ChartSegmentPreset,
  type ChartTone,
} from "../../../lib/chartTheme";
import { chartFrameClasses, chartSegmentBarHostClasses } from "./chartStyles";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltipContent } from "./ChartTooltipContent";
import {
  ChartCartesian,
  ChartCartesianAreaSeries,
  ChartCartesianAxisBottom,
  ChartCartesianAxisLeft,
  ChartCartesianGrid,
  ChartCartesianTooltipLayer,
} from "./ChartCartesian";

export {
  chartKpiHeroRowClasses,
  chartKpiHeroValueClasses,
  chartKpiTrendLabelClasses,
  chartKpiTrendRowClasses,
  chartKpiTrendValueClasses,
} from "./chartStyles";

export type { ChartSegmentFillVariant, ChartSegmentPreset, ChartTone } from "../../../lib/chartTheme";
export {
  chartCategoricalCount,
  chartCategoricalPalette,
  chartFormatPercent,
  chartMaxTicksForWidth,
  chartSegmentBarWidth,
  chartSegmentFillVariants,
  chartSegmentPresets,
  chartSegmentTickSpec,
  resolveCapacityBarLayout,
  resolveSegmentBarConfig,
} from "../../../lib/chartTheme";

/** Layout-only — width, margin in dashboard grids. */
export type ChartLayoutClassName = string;

export interface ChartSegmentedBarProps {
  /** Filled amount — e.g. occupied units. */
  value: number;
  /** Capacity — e.g. total units. */
  max: number;
  /** Semantic fill for filled segments. */
  tone?: ChartTone;
  /** `solid` | `velocity` (tone fade) | `semantic` (RAG red → warning → green). */
  fill?: ChartSegmentFillVariant;
  /** Tick count target — defaults to 60; bar fills card width with fixed 5px ticks + flex gap (min 1px). */
  segments?: number;
  preset?: ChartSegmentPreset;
  /** Accessible name — defaults to percent of max. */
  label?: string;
  className?: ChartLayoutClassName;
}

export interface ChartFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** CSS length for segment marks — defaults to preset height via inline var. */
  segmentHeight?: number;
  className?: ChartLayoutClassName;
}

function ChartFrameRoot({
  children,
  segmentHeight = chartSegmentPresets.default.height,
  className,
  style,
  ...props
}: ChartFrameProps) {
  return (
    <div
      className={cn(chartFrameClasses, className)}
      style={
        {
          ...style,
          "--chart-segment-height": `${segmentHeight}px`,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

function ChartSegmentedBarInner({
  width,
  value,
  max,
  tone = "primary",
  fill = "solid",
  segments: segmentsProp,
  preset = "default",
  label,
  gradientId,
}: ChartSegmentedBarProps & { width: number; gradientId: string }) {
  const layout = resolveCapacityBarLayout(width, { preset, segments: segmentsProp });
  const { config: presetConfig, displayCount, tickWidth, gap, barWidth } = layout;
  const height = presetConfig.height;
  const radius = presetConfig.segmentRadius;
  const safeMax = max > 0 ? max : 1;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const filledSegments = Math.min(
    displayCount,
    Math.max(0, Math.round((clampedValue / safeMax) * displayCount)),
  );

  const segmentIndexes = useMemo(
    () => Array.from({ length: displayCount }, (_, index) => index),
    [displayCount],
  );

  const fillColor = chartStroke(tone);
  const trackColor = chartUiTokens.placeholder;
  const usesBarGradient = fill === "velocity" || fill === "semantic";
  const percentLabel = `${Math.round((clampedValue / safeMax) * 100)}%`;
  const ariaLabel = label ?? `${percentLabel} of capacity`;

  if (width <= 0) {
    return null;
  }

  return (
    <svg
      width={barWidth}
      height={height}
      role="meter"
      aria-label={ariaLabel}
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      className="block w-full max-w-full"
    >
      {usesBarGradient ? (
        <defs>
          <linearGradient
            id={gradientId}
            x1={0}
            x2={barWidth}
            y1={0}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            {fill === "velocity" ? (
              <>
                <stop
                  offset="0%"
                  stopColor={fillColor}
                  stopOpacity={chartSegmentFillVariants.velocity.startOpacity}
                />
                <stop
                  offset="100%"
                  stopColor={fillColor}
                  stopOpacity={chartSegmentFillVariants.velocity.endOpacity}
                />
              </>
            ) : (
              chartSegmentFillVariants.semantic.stops.map((stop) => (
                <stop key={stop.offset} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
              ))
            )}
          </linearGradient>
        </defs>
      ) : null}
      <Group>
        {segmentIndexes.map((index) => {
          const x = chartSegmentPosition(index, tickWidth, gap);
          const isFilled = index < filledSegments;

          return (
            <rect
              key={index}
              x={x}
              y={0}
              width={tickWidth}
              height={height}
              rx={radius}
              ry={radius}
              fill={isFilled && usesBarGradient ? `url(#${gradientId})` : isFilled ? fillColor : trackColor}
            />
          );
        })}
      </Group>
    </svg>
  );
}

function useChartHostWidth<T extends HTMLElement>() {
  const hostRef = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const node = hostRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      setWidth(node.getBoundingClientRect().width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { hostRef, width };
}

function ChartSegmentedBar({
  value,
  max,
  tone = "primary",
  fill = "solid",
  segments,
  preset = "default",
  label,
  className,
}: ChartSegmentedBarProps) {
  const { hostRef, width } = useChartHostWidth<HTMLDivElement>();
  const gradientId = useId().replace(/:/g, "");
  const layout = resolveCapacityBarLayout(width, { preset, segments });
  const height = layout.config.height;

  return (
    <div
      ref={hostRef}
      className={cn(chartSegmentBarHostClasses, className)}
      style={{ "--chart-segment-height": `${height}px` } as CSSProperties}
    >
      {width > 0 ? (
        <ChartSegmentedBarInner
          width={width}
          value={value}
          max={max}
          tone={tone}
          fill={fill}
          segments={segments}
          preset={preset}
          label={label}
          gradientId={gradientId}
        />
      ) : null}
    </div>
  );
}

/** Dashboard charts — axis-agnostic shell + scalar / Cartesian patterns. See ADR-0012, ADR-0015. */
export const Chart = Object.assign(ChartFrameRoot, {
  Frame: ChartFrameRoot,
  SegmentedBar: ChartSegmentedBar,
  Cartesian: Object.assign(ChartCartesian, {
    Grid: ChartCartesianGrid,
    AxisBottom: ChartCartesianAxisBottom,
    AxisLeft: ChartCartesianAxisLeft,
    Area: ChartCartesianAreaSeries,
    Tooltip: ChartCartesianTooltipLayer,
  }),
  Legend: ChartLegend,
  Tooltip: {
    Content: ChartTooltipContent,
  },
});

export {
  ChartCartesian,
  ChartCartesianAreaSeries,
  ChartCartesianAxisBottom,
  ChartCartesianAxisLeft,
  ChartCartesianGrid,
  ChartCartesianTooltipLayer,
  ChartLegend,
  ChartTooltipContent,
};
export type { ChartCartesianPoint, ChartCartesianProps } from "./ChartCartesian";
export type { ChartLegendProps, ChartLegendLayoutClassName } from "./ChartLegend";
export type {
  ChartTooltipContentProps,
  ChartTooltipContentLayoutClassName,
} from "./ChartTooltipContent";
