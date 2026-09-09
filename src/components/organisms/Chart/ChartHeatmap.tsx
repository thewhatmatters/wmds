import { HeatmapRect } from "@visx/heatmap";
import { ParentSize } from "@visx/responsive";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { cn } from "../../../lib/cn";
import {
  chartStroke,
  chartUiTokens,
  type ChartTone,
} from "../../../lib/chartTheme";
import { normalizeHeatmapValue } from "./chartExploration";
import { ChartHoverTooltip } from "./ChartHoverTooltip";
import {
  chartExplorationEmptyClasses,
  chartExplorationLegendLabelClasses,
  chartExplorationPlotHostClasses,
  chartExplorationRootClasses,
  chartExplorationSummaryClasses,
  chartExplorationSvgClasses,
  chartHeatmapLegendScaleClasses,
  chartHeatmapLegendSwatchClasses,
} from "./chartStyles";

export interface ChartHeatmapAxisItem {
  key: string;
  label: string;
}

export interface ChartHeatmapCell {
  rowKey: string;
  columnKey: string;
  value: number;
  valueLabel?: string;
}

export type ChartHeatmapLayoutClassName = string;

export interface ChartHeatmapProps {
  rows: ChartHeatmapAxisItem[];
  columns: ChartHeatmapAxisItem[];
  cells: ChartHeatmapCell[];
  "aria-label": string;
  tone?: ChartTone;
  metricLabel?: string;
  minHeight?: number;
  className?: ChartHeatmapLayoutClassName;
}

interface HeatmapBin extends ChartHeatmapCell {
  rowLabel: string;
  columnLabel: string;
}

interface HeatmapColumn {
  key: string;
  bins: HeatmapBin[];
}

interface ChartHeatmapTooltipDatum {
  cell: HeatmapBin;
}

export function ChartHeatmap({
  rows,
  columns,
  cells,
  "aria-label": ariaLabel,
  tone = "primary",
  metricLabel = "Value",
  minHeight = 240,
  className,
}: ChartHeatmapProps) {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: false,
  });
  const {
    tooltipOpen,
    tooltipLeft = 0,
    tooltipTop = 0,
    tooltipData,
    showTooltip,
    hideTooltip,
  } = useTooltip<ChartHeatmapTooltipDatum>();

  if (rows.length === 0 || columns.length === 0 || cells.length === 0) {
    return <div className={cn(chartExplorationEmptyClasses, className)}>No heatmap data</div>;
  }

  const cellByKey = new Map(
    cells.map((cell) => [`${cell.columnKey}:${cell.rowKey}`, cell]),
  );
  const columnData: HeatmapColumn[] = columns.map((column) => ({
    key: column.key,
    bins: rows.map((row) => {
      const cell = cellByKey.get(`${column.key}:${row.key}`);
      return {
        rowKey: row.key,
        rowLabel: row.label,
        columnKey: column.key,
        columnLabel: column.label,
        value: cell?.value ?? 0,
        valueLabel: cell?.valueLabel,
      };
    }),
  }));
  const max = Math.max(1, ...cells.map((cell) => cell.value));
  const color = chartStroke(tone);

  return (
    <div className={cn(chartExplorationRootClasses, className)}>
      <div
        ref={containerRef}
        className={chartExplorationPlotHostClasses}
        style={{ height: minHeight, minHeight }}
      >
        <ParentSize>
          {({ width, height }) => {
            if (width <= 0 || height <= 0) return null;
            const margin = {
              left: width < 420 ? 54 : 62,
              right: 8,
              top: 28,
              bottom: 4,
            };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            const binWidth = innerWidth / columns.length;
            const binHeight = innerHeight / rows.length;
            const gap = Math.min(8, binWidth * 0.12, binHeight * 0.12);

            return (
              <>
                <svg
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel}
                className={chartExplorationSvgClasses}
              >
                {columns.map((column, index) => (
                  <text
                    key={column.key}
                    x={margin.left + index * binWidth + binWidth / 2}
                    y={15}
                    textAnchor="middle"
                    fill={chartUiTokens.axis}
                    fontSize={10}
                  >
                    {column.label}
                  </text>
                ))}
                {rows.map((row, index) => (
                  <text
                    key={row.key}
                    x={margin.left - 10}
                    y={margin.top + index * binHeight + binHeight / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fill={chartUiTokens.axis}
                    fontSize={10}
                  >
                    {row.label}
                  </text>
                ))}

                <HeatmapRect
                  data={columnData}
                  binWidth={binWidth}
                  binHeight={binHeight}
                  gap={gap}
                  xScale={(index) => index * binWidth}
                  yScale={(index) => index * binHeight}
                  bins={(column) => column.bins}
                  count={(bin) => bin.value}
                  colorScale={() => color}
                  opacityScale={(value) =>
                    0.16 + normalizeHeatmapValue(Number(value), max) * 0.68
                  }
                >
                  {(heatmap) => (
                    <>
                      {heatmap.flatMap((column) =>
                        column.map((cell) => {
                          const x = margin.left + cell.x;
                          const y = margin.top + cell.y;
                          const active =
                            tooltipOpen &&
                            tooltipData?.cell.rowKey === cell.bin.rowKey &&
                            tooltipData.cell.columnKey === cell.bin.columnKey;
                          const showCellTooltip = () => {
                            showTooltip({
                              tooltipData: { cell: cell.bin },
                              tooltipLeft: x + cell.width / 2,
                              tooltipTop: y,
                            });
                          };
                          return (
                            <rect
                              key={`${cell.bin.columnKey}:${cell.bin.rowKey}`}
                              x={x}
                              y={y}
                              width={cell.width}
                              height={cell.height}
                              rx={Math.min(4, binWidth * 0.08, binHeight * 0.08)}
                              fill={cell.color}
                              fillOpacity={cell.opacity}
                              stroke={
                                active ? "var(--color-text-primary)" : "transparent"
                              }
                              strokeWidth={1}
                              aria-hidden
                              onPointerEnter={showCellTooltip}
                              onPointerMove={showCellTooltip}
                              onPointerLeave={hideTooltip}
                            >
                              <title>
                                {`${cell.bin.rowLabel}, ${cell.bin.columnLabel}: ${
                                  cell.bin.valueLabel ?? cell.bin.value
                                }`}
                              </title>
                            </rect>
                          );
                        }),
                      )}
                    </>
                  )}
                </HeatmapRect>
                </svg>
                <ChartHoverTooltip
                  TooltipInPortal={TooltipInPortal}
                  open={tooltipOpen && tooltipData != null}
                  left={tooltipLeft}
                  top={tooltipTop}
                  chartWidth={width}
                  label={
                    tooltipData == null
                      ? ""
                      : `${tooltipData.cell.rowLabel} · ${tooltipData.cell.columnLabel}`
                  }
                  items={
                    tooltipData == null
                      ? []
                      : [
                          {
                            key: "value",
                            label: metricLabel,
                            value:
                              tooltipData.cell.valueLabel ??
                              String(tooltipData.cell.value),
                            color,
                          },
                        ]
                  }
                />
              </>
            );
          }}
        </ParentSize>
      </div>
      <ul className={chartExplorationSummaryClasses}>
        {columnData.flatMap((column) =>
          column.bins.map((cell) => (
            <li key={`${cell.columnKey}:${cell.rowKey}`}>
              {`${cell.rowLabel}, ${cell.columnLabel}: ${
                cell.valueLabel ?? cell.value
              }`}
            </li>
          )),
        )}
      </ul>
      <div className={chartHeatmapLegendScaleClasses} aria-hidden>
        <span className={chartExplorationLegendLabelClasses}>Low</span>
        {[0.16, 0.33, 0.5, 0.67, 0.84].map((opacity) => (
          <span
            key={opacity}
            className={chartHeatmapLegendSwatchClasses}
            style={{ opacity }}
          />
        ))}
        <span className={chartExplorationLegendLabelClasses}>High</span>
      </div>
    </div>
  );
}
