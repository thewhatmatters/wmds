import { useId, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../../lib/cn";
import {
  chartAreaPresets,
  chartGradientStops,
  chartMargins,
  chartStroke,
  chartUiTokens,
  resolveChartTone,
  type ChartTone,
  type ChartVariant,
} from "../../foundation/chartTheme";
import { chartContainerClasses, chartPlaceholderClasses, chartSparklineClasses } from "./chartStyles";

export {
  chartAreaPresets,
  chartColorTokens,
  chartFill,
  chartGradientStops,
  chartMargins,
  chartStroke,
  chartTheme,
  chartUiTokens,
  resolveChartTone,
} from "../../foundation/chartTheme";
export type { ChartGradientStops, ChartMargins, ChartTone, ChartVariant } from "../../foundation/chartTheme";

type ChartDatum = Record<string, unknown>;

type ChartTooltipPayload = {
  value?: number | string;
  payload?: ChartDatum;
};

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
  seriesLabel?: string;
  xKey?: string;
};

function ChartTooltipContent({
  active,
  payload,
  label,
  formatValue,
  formatLabel,
  seriesLabel,
  xKey,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0] as ChartTooltipPayload | undefined;
  const row = entry?.payload;
  const rawValue = entry?.value;
  const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);
  const valueLabel = Number.isFinite(numericValue)
    ? (formatValue?.(numericValue) ?? String(rawValue))
    : String(rawValue ?? "—");
  const rawLabel =
    xKey && row?.[xKey] != null ? String(row[xKey]) : label != null ? String(label) : "";
  const labelText = formatLabel?.(rawLabel) ?? rawLabel;

  return (
    <div
      className={cn(
        "rounded-md border px-2 py-1.5 shadow-sm",
        "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)]",
      )}
    >
      {labelText ? (
        <div className="mb-0.5 text-[10px] font-medium text-[var(--color-muted)]">{labelText}</div>
      ) : null}
      <div className="flex items-baseline gap-2 text-xs font-semibold tabular-nums">
        {seriesLabel ? (
          <span className="font-medium text-[var(--color-muted)]">{seriesLabel}</span>
        ) : null}
        <span>{valueLabel}</span>
      </div>
    </div>
  );
}

export type ChartAreaProps = {
  /** Series rows — each object must include `dataKey` (and optional `xKey`). */
  data: ChartDatum[];
  /** Numeric series field. */
  dataKey: string;
  /** Label/category field for tooltips. */
  xKey?: string;
  /** Layout preset — controls margins and stroke weight. */
  variant?: ChartVariant;
  /** Stroke/fill palette. `auto` compares first vs last value. */
  tone?: ChartTone | "auto";
  /** Visible series name in tooltip. */
  label?: string;
  className?: string;
  /** Fixed height — hero charts typically `300px`, compact `120px`. */
  height?: number | string;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
  empty?: ReactNode;
  /** Subtle dot-grid canvas behind the series. Default `true`. */
  showGrid?: boolean;
};

function ChartArea({
  data,
  dataKey,
  xKey,
  variant = "hero",
  tone = "neutral",
  label,
  className,
  height = variant === "compact" ? 120 : 300,
  showTooltip = variant !== "sparkline",
  formatValue,
  formatLabel,
  empty,
  showGrid = true,
}: ChartAreaProps) {
  const gradientId = useId().replace(/:/g, "");
  const preset = chartAreaPresets[variant];
  const margins = chartMargins[variant];
  const numericValues = data.map((row) => row[dataKey] as number | null | undefined);
  const resolvedTone = tone === "auto" ? resolveChartTone(numericValues) : tone;
  const stroke = chartStroke(resolvedTone);
  const gradient = chartGradientStops(resolvedTone, variant);

  if (data.length < 2) {
    return (
      <div className={cn(chartPlaceholderClasses(showGrid), className)} style={{ height }}>
        {empty}
      </div>
    );
  }

  return (
    <div className={cn(chartContainerClasses(showGrid), className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={margins}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradient.top} stopOpacity={gradient.topOpacity} />
              <stop offset="100%" stopColor={gradient.bottom} stopOpacity={gradient.bottomOpacity} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["auto", "auto"]} />
          {xKey ? <XAxis dataKey={xKey} hide /> : null}
          {showTooltip ? (
            <Tooltip
              cursor={{ stroke: chartUiTokens.cursor, strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  formatValue={formatValue}
                  formatLabel={formatLabel}
                  seriesLabel={label}
                  xKey={xKey}
                />
              }
            />
          ) : null}
          <Area
            dataKey={dataKey}
            type={preset.type}
            stroke={stroke}
            strokeWidth={preset.strokeWidth}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={preset.animation}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export type ChartSparklineProps = {
  /** Numeric window — oldest → newest. */
  values: number[];
  tone?: ChartTone | "auto";
  width?: number;
  height?: number;
  className?: string;
  empty?: ReactNode;
  /** Subtle dot-grid canvas behind the series. Default `true`. */
  showGrid?: boolean;
};

function ChartSparkline({
  values,
  tone = "auto",
  width = 104,
  height = 30,
  className,
  empty,
  showGrid = true,
}: ChartSparklineProps) {
  const gradientId = useId().replace(/:/g, "");
  const resolvedTone = tone === "auto" ? resolveChartTone(values) : tone;
  const stroke = chartStroke(resolvedTone);
  const gradient = chartGradientStops(resolvedTone, "sparkline");
  const preset = chartAreaPresets.sparkline;
  const margins = chartMargins.sparkline;
  const data = values.map((value, index) => ({ index, value }));

  if (values.length < 2) {
    return (
      <div className={cn(chartSparklineClasses(showGrid), className)} style={{ width, height }}>
        {empty}
      </div>
    );
  }

  return (
    <div className={cn(chartSparklineClasses(showGrid), className)} style={{ width, height }}>
      <AreaChart width={width} height={height} data={data} margin={margins}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradient.top} stopOpacity={gradient.topOpacity} />
            <stop offset="100%" stopColor={gradient.bottom} stopOpacity={gradient.bottomOpacity} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area
          dataKey="value"
          type={preset.type}
          stroke={stroke}
          strokeWidth={preset.strokeWidth}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={preset.animation}
        />
      </AreaChart>
    </div>
  );
}

export type ChartProps = {
  children?: ReactNode;
  className?: string;
};

/** Optional layout wrapper — most charts use {@link Chart.Area} directly. */
function ChartRoot({ children, className }: ChartProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

/**
 * Token-themed charts on Recharts — area hero, compact equity, inline sparklines.
 * Requires **`recharts`** as a peer dependency in consumer apps.
 */
export const Chart = Object.assign(ChartRoot, {
  Area: ChartArea,
  Sparkline: ChartSparkline,
});

export { ChartArea, ChartSparkline };
