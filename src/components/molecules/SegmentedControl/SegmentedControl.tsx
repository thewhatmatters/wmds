import { useId, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { SegmentedControlProvider } from "./SegmentedControlContext";
import { SegmentedControlItem, SegmentedControlItemGroup } from "./SegmentedControlItem";
import {
  segmentedControlTrackClasses,
  segmentedControlTrackSizeClasses,
  segmentedControlTrackStretchClasses,
  type SegmentedControlLayout,
  type SegmentedControlSize,
} from "./segmentedControlStyles";

export type { SegmentedControlLayout, SegmentedControlSize } from "./segmentedControlStyles";
export { segmentedControlLayouts, segmentedControlSizes } from "./segmentedControlStyles";
export type { SegmentedControlItemLayoutClassName, SegmentedControlItemProps } from "./SegmentedControlItem";

/** Layout-only — width, margin. Use `layout="stretch"` for equal-width segments. */
export type SegmentedControlLayoutClassName = string;

export interface SegmentedControlProps {
  /** Accessible name — e.g. "Card shape" or "Report view". */
  "aria-label": string;
  value: string;
  onValueChange: (value: string) => void;
  size?: SegmentedControlSize;
  /** `hug` (default) sizes to label copy; `stretch` gives each segment equal width. */
  layout?: SegmentedControlLayout;
  disabled?: boolean;
  children: ReactNode;
  className?: SegmentedControlLayoutClassName;
}

function SegmentedControlRoot({
  "aria-label": ariaLabel,
  value,
  onValueChange,
  size = "md",
  layout = "hug",
  disabled,
  children,
  className,
}: SegmentedControlProps) {
  const layoutId = useId();

  return (
    <SegmentedControlProvider
      value={{
        layoutId,
        size,
        layout,
        value,
        onValueChange,
        disabled,
      }}
    >
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn(
          segmentedControlTrackClasses,
          segmentedControlTrackSizeClasses[size],
          layout === "stretch" && segmentedControlTrackStretchClasses,
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        data-size={size}
        data-layout={layout}
      >
        <SegmentedControlItemGroup layoutId={layoutId}>{children}</SegmentedControlItemGroup>
      </div>
    </SegmentedControlProvider>
  );
}

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
});
