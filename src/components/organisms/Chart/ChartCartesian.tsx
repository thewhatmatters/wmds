import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridColumns, GridRows } from "@visx/grid";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { line } from "@visx/vendor/d3-shape";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { bisector } from "d3-array";
import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useId,
  useMemo,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  chartAreaPresets,
  chartCartesianMargins,
  chartFormatTooltipLabel,
  chartTooltipItemsFromConfig,
  chartUiTokens,
  type ChartPeriodKind,
  type ChartSeriesConfig,
  type ChartVariant,
} from "../../../lib/chartTheme";
import {
  ChartCartesianProvider,
  useChartCartesian,
  type ChartCartesianPoint,
  type ChartCartesianTooltipDatum,
} from "./chartCartesianContext";
import { ChartTooltipContent } from "./ChartTooltipContent";
import {
  chartCartesianHostClasses,
  chartCartesianSvgClasses,
  chartTooltipActiveDotClasses,
  chartTooltipAnchorAboveClasses,
  chartTooltipAnchorBelowClasses,
  chartTooltipCrosshairClasses,
  chartTooltipCrosshairLineClasses,
} from "./chartStyles";
import {
  chartCartesianAreaEnterTransition,
  chartCartesianEnterTransition,
  chartCartesianEnterVariants,
  chartCartesianLineEnterTransition,
  type ChartCartesianAnimate,
} from "./chartCartesianMotion";

export type { ChartCartesianAnimate } from "./chartCartesianMotion";

export type { ChartCartesianPoint } from "./chartCartesianContext";

/** Layout-only — width, min-height in dashboard grids. */
export type ChartCartesianLayoutClassName = string;

export interface ChartCartesianProps {
  data: ChartCartesianPoint[];
  config: ChartSeriesConfig;
  /** Subset and z-order — defaults to Object.keys(config). */
  seriesKeys?: string[];
  variant?: ChartVariant;
  /** Minimum host height — ParentSize fills width. */
  minHeight?: number;
  periodKind?: ChartPeriodKind;
  xAccessor?: (point: ChartCartesianPoint) => Date;
  yAccessor?: (point: ChartCartesianPoint, key: string) => number;
  /** Accessible chart summary. */
  "aria-label"?: string;
  /** Mount enter — `initial` fades the plot in once; `none` for static Storybook layouts. Period changes do not re-run. */
  animate?: ChartCartesianAnimate;
  className?: ChartCartesianLayoutClassName;
  children?: ReactNode;
}

function defaultYAccessor(point: ChartCartesianPoint, key: string): number {
  const value = point[key];
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

function resolveYMax(
  data: ChartCartesianPoint[],
  seriesKeys: string[],
  yAccessor: (point: ChartCartesianPoint, key: string) => number,
): number {
  let max = 0;
  for (const point of data) {
    for (const key of seriesKeys) {
      max = Math.max(max, yAccessor(point, key));
    }
  }
  return max <= 0 ? 1 : max * 1.08;
}

function ChartCartesianInner({
  width,
  height,
  data,
  config,
  seriesKeys,
  variant,
  periodKind,
  xAccessor,
  yAccessor,
  ariaLabel,
  animateEnter,
  children,
  TooltipInPortal,
}: ChartCartesianProps & {
  width: number;
  height: number;
  animateEnter: boolean;
  TooltipInPortal: ReturnType<typeof useTooltipInPortal>["TooltipInPortal"];
}) {
  const keys = seriesKeys ?? Object.keys(config);
  const margin = chartCartesianMargins[variant ?? "hero"];
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const xScale = useMemo(
    () =>
      scaleTime<number>({
        domain:
          data.length > 0
            ? [xAccessor!(data[0]!), xAccessor!(data[data.length - 1]!)]
            : [new Date(), new Date()],
        range: [0, innerWidth],
      }),
    [data, innerWidth, xAccessor],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, resolveYMax(data, keys, yAccessor!)],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data, innerHeight, keys, yAccessor],
  );

  const contextValue = useMemo(
    () => ({
      data,
      config,
      seriesKeys: keys,
      variant: variant ?? "hero",
      periodKind,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      xAccessor: xAccessor!,
      yAccessor: yAccessor!,
      TooltipInPortal,
      animateEnter,
    }),
    [
      TooltipInPortal,
      animateEnter,
      config,
      data,
      height,
      innerHeight,
      innerWidth,
      keys,
      margin,
      periodKind,
      variant,
      width,
      xAccessor,
      yAccessor,
      xScale,
      yScale,
    ],
  );

  if (innerWidth <= 0 || innerHeight <= 0 || data.length === 0) {
    return null;
  }

  return (
    <ChartCartesianProvider value={contextValue}>
      <motion.svg
        width={width}
        height={height}
        className={chartCartesianSvgClasses}
        role="img"
        aria-label={ariaLabel}
        variants={chartCartesianEnterVariants}
        initial={animateEnter ? "hidden" : false}
        animate="visible"
        transition={chartCartesianEnterTransition}
      >
        <Group left={margin.left} top={margin.top}>
          {children ?? (
            <>
              <ChartCartesianGrid />
              <ChartCartesianAreaSeries />
              <ChartCartesianAxisLeft />
              <ChartCartesianAxisBottom />
              <ChartCartesianTooltipLayer />
            </>
          )}
        </Group>
      </motion.svg>
    </ChartCartesianProvider>
  );
}

export function ChartCartesian({
  data,
  config,
  seriesKeys,
  variant = "hero",
  minHeight = 240,
  periodKind,
  xAccessor = (point) => point.date,
  yAccessor = defaultYAccessor,
  animate = "initial",
  className,
  children,
  "aria-label": ariaLabel = "Time series chart",
}: ChartCartesianProps) {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({ scroll: true, detectBounds: false });
  const shouldReduceMotion = useReducedMotion();
  const shouldEnter = animate === "initial" && !shouldReduceMotion;

  return (
    <div
      ref={containerRef}
      className={cn(chartCartesianHostClasses, className)}
      style={{ minHeight, height: minHeight }}
    >
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <ChartCartesianInner
              width={width}
              height={height}
              data={data}
              config={config}
              seriesKeys={seriesKeys}
              variant={variant}
              periodKind={periodKind}
              xAccessor={xAccessor}
              yAccessor={yAccessor}
              aria-label={ariaLabel}
              animateEnter={shouldEnter}
              TooltipInPortal={TooltipInPortal}
            >
              {children}
            </ChartCartesianInner>
          ) : null
        }
      </ParentSize>
    </div>
  );
}

const CARTESIAN_X_TICK_COUNT = 6;

const cartesianGridLineProps = {
  stroke: chartUiTokens.grid,
  strokeOpacity: 0.6,
  strokeDasharray: "4 4",
  pointerEvents: "none" as const,
};

export function ChartCartesianGrid() {
  const { xScale, yScale, innerWidth, innerHeight } = useChartCartesian();

  return (
    <>
      <GridRows scale={yScale} width={innerWidth} {...cartesianGridLineProps} />
      <GridColumns
        scale={xScale}
        height={innerHeight}
        numTicks={CARTESIAN_X_TICK_COUNT}
        {...cartesianGridLineProps}
      />
    </>
  );
}

export function ChartCartesianAxisBottom() {
  const { xScale, innerHeight, periodKind } = useChartCartesian();

  return (
    <AxisBottom
      top={innerHeight}
      scale={xScale}
      numTicks={CARTESIAN_X_TICK_COUNT}
      stroke={chartUiTokens.axis}
      tickStroke={chartUiTokens.axis}
      tickLine={false}
      axisLine={false}
      tickFormat={(value) => {
        const date = value instanceof Date ? value : new Date(value.valueOf());
        return chartFormatTooltipLabel(date, periodKind);
      }}
      tickLabelProps={() => ({
        fill: chartUiTokens.tooltipMuted,
        fontSize: 11,
        textAnchor: "middle",
        dy: 4,
      })}
    />
  );
}

export function ChartCartesianAxisLeft() {
  const { yScale } = useChartCartesian();

  return (
    <AxisLeft
      scale={yScale}
      numTicks={5}
      stroke={chartUiTokens.axis}
      tickStroke={chartUiTokens.axis}
      tickLine={false}
      axisLine={false}
      tickFormat={(value) => `${value}`}
      tickLabelProps={() => ({
        fill: chartUiTokens.tooltipMuted,
        fontSize: 11,
        textAnchor: "end",
        dx: -4,
        dy: 3,
      })}
    />
  );
}

export function ChartCartesianAreaSeries() {
  const { data, config, seriesKeys, xScale, yScale, xAccessor, yAccessor, variant, animateEnter } =
    useChartCartesian();
  const areaPreset = chartAreaPresets[variant];
  const chartUid = useId().replace(/:/g, "");

  return (
    <>
      {seriesKeys.map((key) => {
        const color = config[key]?.color ?? chartUiTokens.axis;
        const gradientId = `wmds-area-${chartUid}-${key.replace(/[^a-z0-9]/gi, "")}`;
        const linePath =
          line<ChartCartesianPoint>()
            .x((point) => xScale(xAccessor(point)) ?? 0)
            .y((point) => yScale(yAccessor(point, key)) ?? 0)
            .curve(curveMonotoneX)(data) ?? "";

        return (
          <Group key={key}>
            <LinearGradient
              id={gradientId}
              from={color}
              to={color}
              fromOpacity={areaPreset.fillOpacity}
              toOpacity={0}
              vertical
            />
            {animateEnter ? (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={chartCartesianAreaEnterTransition}
              >
                <AreaClosed
                  data={data}
                  x={(point) => xScale(xAccessor(point)) ?? 0}
                  y={(point) => yScale(yAccessor(point, key)) ?? 0}
                  yScale={yScale}
                  fill={`url(#${gradientId})`}
                  stroke="transparent"
                  curve={curveMonotoneX}
                />
              </motion.g>
            ) : (
              <AreaClosed
                data={data}
                x={(point) => xScale(xAccessor(point)) ?? 0}
                y={(point) => yScale(yAccessor(point, key)) ?? 0}
                yScale={yScale}
                fill={`url(#${gradientId})`}
                stroke="transparent"
                curve={curveMonotoneX}
              />
            )}
            {animateEnter ? (
              <motion.path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={areaPreset.strokeWidth}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={chartCartesianLineEnterTransition}
              />
            ) : (
              <LinePath
                data={data}
                x={(point) => xScale(xAccessor(point)) ?? 0}
                y={(point) => yScale(yAccessor(point, key)) ?? 0}
                stroke={color}
                strokeWidth={areaPreset.strokeWidth}
                curve={curveMonotoneX}
              />
            )}
          </Group>
        );
      })}
    </>
  );
}

const bisectDate = bisector<ChartCartesianPoint, Date>((point) => point.date).center;

/** Pixel Y of the topmost series value at a point — tooltip anchors to the line stack. */
function resolveTooltipAnchorY(
  point: ChartCartesianPoint,
  seriesKeys: string[],
  yScale: (value: number) => number,
  yAccessor: (point: ChartCartesianPoint, key: string) => number,
): number {
  return Math.min(...seriesKeys.map((key) => yScale(yAccessor(point, key))));
}

export function ChartCartesianTooltipLayer() {
  const {
    data,
    config,
    seriesKeys,
    innerWidth,
    innerHeight,
    margin,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    periodKind,
    TooltipInPortal,
  } = useChartCartesian();

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, showTooltip, hideTooltip } =
    useTooltip<ChartCartesianTooltipDatum>();

  const handlePointerMove = useCallback(
    (event: PointerEvent<SVGRectElement>) => {
      const point = localPoint(event);
      if (point == null) {
        return;
      }

      const xDate = xScale.invert(point.x);
      const index = bisectDate(data, xDate, 1);
      const datum = data[index];
      if (datum == null) {
        return;
      }

      const x = xScale(xAccessor(datum)) ?? 0;
      const anchorY = resolveTooltipAnchorY(datum, seriesKeys, yScale, yAccessor);
      showTooltip({
        tooltipData: { point: datum, index },
        tooltipLeft: margin.left + x,
        tooltipTop: margin.top + anchorY,
      });
    },
    [data, margin.left, margin.top, seriesKeys, showTooltip, xAccessor, yAccessor, xScale, yScale],
  );

  const tooltipItems =
    tooltipData != null
      ? chartTooltipItemsFromConfig(
          config,
          Object.fromEntries(seriesKeys.map((key) => [key, yAccessor(tooltipData.point, key)])),
          seriesKeys,
        )
      : [];

  const crosshairX = tooltipData != null ? xScale(xAccessor(tooltipData.point)) ?? 0 : null;
  const anchorY =
    tooltipData != null
      ? resolveTooltipAnchorY(tooltipData.point, seriesKeys, yScale, yAccessor)
      : null;
  /** Flip below the anchor when the topmost series sits under ~56px of headroom. */
  const placeTooltipBelow = anchorY != null && anchorY < 56;

  return (
    <>
      <rect
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
        onPointerMove={handlePointerMove}
        onPointerLeave={hideTooltip}
      />
      {tooltipOpen && crosshairX != null ? (
        <line
          x1={crosshairX}
          x2={crosshairX}
          y1={0}
          y2={innerHeight}
          className={chartTooltipCrosshairLineClasses}
        />
      ) : null}
      {tooltipOpen && crosshairX != null && tooltipData != null
        ? seriesKeys.map((key) => {
            const color = config[key]?.color ?? chartUiTokens.axis;
            const y = yScale(yAccessor(tooltipData.point, key));
            return (
              <circle
                key={key}
                cx={crosshairX}
                cy={y}
                r={4}
                fill={color}
                className={chartTooltipActiveDotClasses}
                aria-hidden
              />
            );
          })
        : null}
      {tooltipOpen && tooltipData != null ? (
        <TooltipInPortal
          unstyled
          applyPositionStyle
          left={tooltipLeft}
          top={tooltipTop}
          offsetLeft={4}
          offsetTop={0}
        >
          <div
            className={cn(
              placeTooltipBelow ? chartTooltipAnchorBelowClasses : chartTooltipAnchorAboveClasses,
            )}
          >
            <ChartTooltipContent
              label={chartFormatTooltipLabel(xAccessor(tooltipData.point), periodKind)}
              items={tooltipItems}
            />
          </div>
        </TooltipInPortal>
      ) : null}
    </>
  );
}

ChartCartesian.Grid = ChartCartesianGrid;
ChartCartesian.AxisBottom = ChartCartesianAxisBottom;
ChartCartesian.AxisLeft = ChartCartesianAxisLeft;
ChartCartesian.Area = ChartCartesianAreaSeries;
ChartCartesian.Tooltip = ChartCartesianTooltipLayer;
