import { Children, isValidElement, useId, type KeyboardEvent, type ReactNode } from "react";
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
  const hasSelection = Children.toArray(children).some(
    (child) =>
      isValidElement<{ value?: string; disabled?: boolean }>(child) &&
      child.type === SegmentedControlItem &&
      child.props.value === value &&
      !child.props.disabled,
  );

  return (
    <SegmentedControlProvider
      value={{
        layoutId,
        size,
        layout,
        value,
        onValueChange,
        disabled,
        hasSelection: hasSelection && !disabled,
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
        onKeyDown={(event) => moveSelection(event, onValueChange)}
      >
        <SegmentedControlItemGroup layoutId={layoutId}>{children}</SegmentedControlItemGroup>
      </div>
    </SegmentedControlProvider>
  );
}

const nextKeys = new Set(["ArrowRight", "ArrowDown"]);
const previousKeys = new Set(["ArrowLeft", "ArrowUp"]);

/**
 * Radio-group keys: arrows move to the next or previous enabled segment (wrapping, and following the reading
 * direction for left and right), Home and End to the first and last. The segment moved to is selected and focused.
 */
function moveSelection(event: KeyboardEvent<HTMLDivElement>, onValueChange: (value: string) => void) {
  const { key } = event;
  if (!nextKeys.has(key) && !previousKeys.has(key) && key !== "Home" && key !== "End") return;
  const segments = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='radio']:not(:disabled)")];
  if (segments.length === 0) return;
  const current = segments.indexOf(event.target as HTMLButtonElement);
  const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
  const horizontal = key === "ArrowLeft" || key === "ArrowRight";
  let step = nextKeys.has(key) ? 1 : -1;
  if (rtl && horizontal) step = -step;
  const index =
    key === "Home"
      ? 0
      : key === "End"
        ? segments.length - 1
        : (Math.max(current, step > 0 ? -1 : 0) + step + segments.length) % segments.length;
  const target = segments[index];
  event.preventDefault();
  target.focus();
  const value = target.dataset.value;
  if (value != null && target.getAttribute("aria-checked") !== "true") onValueChange(value);
}

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
});
