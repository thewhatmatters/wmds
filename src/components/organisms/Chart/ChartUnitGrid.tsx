import { ParentSize } from "@visx/responsive";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { cn } from "../../../lib/cn";
import {
  chartUiTokens,
  type ChartSeriesConfig,
} from "../../../lib/chartTheme";
import { allocateChartUnits } from "./chartExploration";
import { ChartHoverTooltip } from "./ChartHoverTooltip";
import { ChartLegend } from "./ChartLegend";
import {
  chartExplorationEmptyClasses,
  chartExplorationPlotHostClasses,
  chartExplorationRootClasses,
  chartExplorationSummaryClasses,
  chartExplorationSvgClasses,
  chartUnitGridCellClasses,
} from "./chartStyles";

export interface ChartUnitGridPart {
  key: string;
  value: number;
}

export type ChartUnitGridLayoutClassName = string;

export interface ChartUnitGridProps {
  parts: ChartUnitGridPart[];
  config: ChartSeriesConfig;
  "aria-label": string;
  total?: number;
  columns?: number;
  minHeight?: number;
  className?: ChartUnitGridLayoutClassName;
}

interface ChartUnitGridTooltipDatum {
  index: number;
  key: string | null;
  label: string;
  value: number;
  color: string;
}

export function ChartUnitGrid({
  parts,
  config,
  "aria-label": ariaLabel,
  total = 100,
  columns = 10,
  minHeight = 240,
  className,
}: ChartUnitGridProps) {
  const safeColumns = Math.max(1, Math.round(columns));
  const units = allocateChartUnits(parts, total);
  const rows = Math.ceil(units.length / safeColumns);
  const hasData = units.some(Boolean);
  const unallocatedCount = units.filter((key) => key == null).length;
  const partByKey = new Map(parts.map((part) => [part.key, part]));
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
  } = useTooltip<ChartUnitGridTooltipDatum>();

  if (!hasData) {
    return <div className={cn(chartExplorationEmptyClasses, className)}>No composition data</div>;
  }

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
            const cellWidth = width / safeColumns;
            const cellHeight = height / rows;
            const gap = Math.min(6, cellWidth * 0.18, cellHeight * 0.18);

            return (
              <>
                <svg
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel}
                className={chartExplorationSvgClasses}
              >
                {units.map((key, index) => {
                  const column = index % safeColumns;
                  const row = Math.floor(index / safeColumns);
                  const color =
                    key == null ? chartUiTokens.placeholder : config[key]?.color;
                  const part = key == null ? undefined : partByKey.get(key);
                  const label =
                    key == null ? "Unallocated" : config[key]?.label ?? key;
                  const tooltipColor = color ?? chartUiTokens.placeholder;
                  const showCellTooltip = () => {
                    showTooltip({
                      tooltipData: {
                        index,
                        key,
                        label,
                        value: part?.value ?? unallocatedCount,
                        color: tooltipColor,
                      },
                      tooltipLeft: column * cellWidth + cellWidth / 2,
                      tooltipTop: row * cellHeight + gap / 2,
                    });
                  };
                  return (
                    <rect
                      key={`${key ?? "empty"}-${index}`}
                      x={column * cellWidth + gap / 2}
                      y={row * cellHeight + gap / 2}
                      width={Math.max(0, cellWidth - gap)}
                      height={Math.max(0, cellHeight - gap)}
                      rx={Math.min(4, cellWidth * 0.12, cellHeight * 0.12)}
                      className={chartUnitGridCellClasses}
                      fill={tooltipColor}
                      fillOpacity={
                        tooltipOpen && tooltipData?.key !== key ? 0.28 : 1
                      }
                      stroke={
                        tooltipOpen && tooltipData?.index === index
                          ? "var(--color-text-primary)"
                          : "transparent"
                      }
                      strokeWidth={1}
                      aria-hidden
                      onPointerEnter={showCellTooltip}
                      onPointerMove={showCellTooltip}
                      onPointerLeave={hideTooltip}
                    />
                  );
                })}
                </svg>
                <ChartHoverTooltip
                  TooltipInPortal={TooltipInPortal}
                  open={tooltipOpen && tooltipData != null}
                  left={tooltipLeft}
                  top={tooltipTop}
                  chartWidth={width}
                  label={tooltipData?.label ?? ""}
                  items={
                    tooltipData == null
                      ? []
                      : [
                          {
                            key: "composition",
                            label: "Composition",
                            value: `${tooltipData.value} of ${total}`,
                            color: tooltipData.color,
                          },
                        ]
                  }
                />
              </>
            );
          }}
        </ParentSize>
      </div>
      <p className={chartExplorationSummaryClasses}>
        {parts
          .map(
            (part) =>
              `${config[part.key]?.label ?? part.key}: ${part.value} of ${total}`,
          )
          .join("; ")}
      </p>
      <ChartLegend config={config} />
    </div>
  );
}
