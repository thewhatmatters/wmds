import { AxisBottom } from "@visx/axis";
import { GlyphDot } from "@visx/glyph";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { cn } from "../../../lib/cn";
import {
  chartFormatAxisValue,
  chartStroke,
  chartUiTokens,
  type ChartTone,
} from "../../../lib/chartTheme";
import { resolveDistributionDomain } from "./chartExploration";
import { ChartHoverTooltip } from "./ChartHoverTooltip";
import {
  chartExplorationEmptyClasses,
  chartExplorationPlotHostClasses,
  chartExplorationRootClasses,
  chartExplorationSummaryClasses,
  chartExplorationSvgClasses,
} from "./chartStyles";

export interface ChartDistributionItem {
  id: string;
  label: string;
  value: number;
  valueLabel?: string;
}

export interface ChartDistributionReference {
  value: number;
  label: string;
}

export type ChartDistributionStripLayoutClassName = string;

export interface ChartDistributionStripProps {
  items: ChartDistributionItem[];
  "aria-label": string;
  reference?: ChartDistributionReference;
  tone?: ChartTone;
  metricLabel?: string;
  valueFormatter?: (value: number) => string;
  minHeight?: number;
  className?: ChartDistributionStripLayoutClassName;
}

interface ChartDistributionTooltipDatum {
  index: number;
  item: ChartDistributionItem;
}

export function ChartDistributionStrip({
  items,
  "aria-label": ariaLabel,
  reference,
  tone = "primary",
  metricLabel = "Value",
  valueFormatter = chartFormatAxisValue,
  minHeight = 240,
  className,
}: ChartDistributionStripProps) {
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
  } = useTooltip<ChartDistributionTooltipDatum>();
  const validItems = items.filter((item) => Number.isFinite(item.value));

  if (validItems.length === 0) {
    return <div className={cn(chartExplorationEmptyClasses, className)}>No distribution data</div>;
  }

  const domain = resolveDistributionDomain(
    validItems.map((item) => item.value),
    reference?.value,
  );
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
            const margin = { left: 28, right: 20, top: 24 };
            const baseline = height - 48;
            const xScale = scaleLinear<number>({
              domain,
              range: [margin.left, width - margin.right],
              nice: true,
            });

            return (
              <>
                <svg
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel}
                className={chartExplorationSvgClasses}
              >
                <LinePath
                  data={[
                    { x: margin.left, y: baseline },
                    { x: width - margin.right, y: baseline },
                  ]}
                  x={(point) => point.x}
                  y={(point) => point.y}
                  stroke={chartUiTokens.grid}
                  strokeWidth={1}
                />

                {reference != null ? (
                  <>
                    <LinePath
                      data={[
                        { x: xScale(reference.value), y: margin.top },
                        { x: xScale(reference.value), y: baseline + 10 },
                      ]}
                      x={(point) => point.x}
                      y={(point) => point.y}
                      stroke={chartUiTokens.axis}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={xScale(reference.value)}
                      y={14}
                      textAnchor="middle"
                      fill={chartUiTokens.axis}
                      fontSize={10}
                    >
                      {reference.label}
                    </text>
                  </>
                ) : null}

                {validItems.map((item, index) => {
                  const y = baseline - (index % 3) * 14;
                  const valueLabel =
                    item.valueLabel ?? valueFormatter(item.value);
                  const x = xScale(item.value);
                  const showPointTooltip = () => {
                    showTooltip({
                      tooltipData: { index, item },
                      tooltipLeft: x,
                      tooltipTop: y,
                    });
                  };
                  return (
                    <g key={item.id} aria-hidden>
                      <text
                        x={x}
                        y={y - 7}
                        textAnchor="middle"
                        fill={chartUiTokens.axis}
                        fontSize={9}
                      >
                        {item.label}
                      </text>
                      <GlyphDot
                        cx={x}
                        cy={y}
                        r={
                          tooltipOpen && tooltipData?.index === index ? 5 : 3.5
                        }
                        fill={color}
                        stroke="var(--color-bg)"
                        strokeWidth={2}
                        onPointerEnter={showPointTooltip}
                        onPointerMove={showPointTooltip}
                        onPointerLeave={hideTooltip}
                      >
                        <title>{`${item.label}: ${valueLabel}`}</title>
                      </GlyphDot>
                    </g>
                  );
                })}

                <AxisBottom
                  top={baseline + 14}
                  scale={xScale}
                  numTicks={5}
                  stroke={chartUiTokens.grid}
                  tickStroke={chartUiTokens.grid}
                  tickFormat={(value) => valueFormatter(Number(value))}
                  tickLabelProps={() => ({
                    fill: chartUiTokens.axis,
                    fontSize: 10,
                    textAnchor: "middle",
                  })}
                />
                </svg>
                <ChartHoverTooltip
                  TooltipInPortal={TooltipInPortal}
                  open={tooltipOpen && tooltipData != null}
                  left={tooltipLeft}
                  top={tooltipTop}
                  chartWidth={width}
                  label={tooltipData?.item.label ?? ""}
                  items={
                    tooltipData == null
                      ? []
                      : [
                          {
                            key: "value",
                            label: metricLabel,
                            value:
                              tooltipData.item.valueLabel ??
                              valueFormatter(tooltipData.item.value),
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
        {reference != null ? (
          <li>{`${reference.label}: ${valueFormatter(reference.value)}`}</li>
        ) : null}
        {validItems.map((item) => (
          <li key={item.id}>
            {`${item.label}: ${item.valueLabel ?? valueFormatter(item.value)}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
