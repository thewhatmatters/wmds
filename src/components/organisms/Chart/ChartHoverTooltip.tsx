import type { useTooltipInPortal } from "@visx/tooltip";
import type { ChartTooltipItem } from "../../../lib/chartTheme";
import { cn } from "../../../lib/cn";
import {
  chartTooltipAnchorAboveLeftClasses,
  chartTooltipAnchorAboveRightClasses,
  chartTooltipAnchorBelowLeftClasses,
  chartTooltipAnchorBelowRightClasses,
  chartTooltipPortalClasses,
} from "./chartStyles";
import { ChartTooltipContent } from "./ChartTooltipContent";

export interface ChartHoverTooltipProps {
  TooltipInPortal: ReturnType<typeof useTooltipInPortal>["TooltipInPortal"];
  open: boolean;
  left: number;
  top: number;
  chartWidth: number;
  label: string;
  items: ChartTooltipItem[];
}

export function ChartHoverTooltip({
  TooltipInPortal,
  open,
  left,
  top,
  chartWidth,
  label,
  items,
}: ChartHoverTooltipProps) {
  if (!open) return null;

  const below = top < 56;
  const alignLeft = left > chartWidth - 176;
  const placement = below
    ? alignLeft
      ? chartTooltipAnchorBelowLeftClasses
      : chartTooltipAnchorBelowRightClasses
    : alignLeft
      ? chartTooltipAnchorAboveLeftClasses
      : chartTooltipAnchorAboveRightClasses;

  return (
    <TooltipInPortal
      unstyled
      applyPositionStyle
      left={left}
      top={top}
      offsetLeft={0}
      offsetTop={0}
      className={chartTooltipPortalClasses}
      style={{ pointerEvents: "none" }}
    >
      <div className={cn(placement, chartTooltipPortalClasses)}>
        <ChartTooltipContent label={label} items={items} />
      </div>
    </TooltipInPortal>
  );
}
