import type { ReactNode } from "react";
import { LayoutGroup, motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { segmentedDisabledClasses } from "../../../lib/segmentedControl";
import { useSegmentedControl } from "./SegmentedControlContext";
import {
  segmentedControlItemBodyClasses,
  segmentedControlItemBodyStretchClasses,
  segmentedControlItemClasses,
  segmentedControlItemEndClasses,
  segmentedControlItemGapClasses,
  segmentedControlItemLabelClasses,
  segmentedControlItemSizeClasses,
  segmentedControlItemSelectedClasses,
  segmentedControlItemStartClasses,
  segmentedControlItemStretchClasses,
  segmentedControlItemUnselectedClasses,
  segmentedControlThumbClasses,
} from "./segmentedControlStyles";

/** Layout-only — width in stretch layouts comes from the parent track. */
export type SegmentedControlItemLayoutClassName = string;

export interface SegmentedControlItemProps {
  /** Stable selection value — required. */
  value: string;
  /** Primary segment label. */
  children: ReactNode;
  /** Leading affordance — icon or swatch (**ButtonIcon** / **BadgeIcon** from stories). */
  start?: ReactNode;
  /** Trailing meta — count or shortcut. */
  end?: ReactNode;
  disabled?: boolean;
  className?: SegmentedControlItemLayoutClassName;
}

/**
 * One segment inside {@link SegmentedControl} — start | label | end. Not a standalone export pattern.
 */
export function SegmentedControlItem({
  value,
  children,
  start,
  end,
  disabled: itemDisabled,
  className,
}: SegmentedControlItemProps) {
  const group = useSegmentedControl();
  const isSelected = group.value === value;
  const disabled = group.disabled || itemDisabled;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={() => {
        if (disabled || isSelected) {
          return;
        }
        group.onValueChange(value);
      }}
      className={cn(
        segmentedControlItemClasses,
        segmentedControlItemSizeClasses[group.size],
        group.layout === "stretch" && segmentedControlItemStretchClasses,
        segmentedDisabledClasses,
        isSelected ? segmentedControlItemSelectedClasses : segmentedControlItemUnselectedClasses,
        className,
      )}
      data-value={value}
      data-selected={isSelected || undefined}
    >
      {isSelected ? (
        <motion.span
          layoutId={group.layoutId}
          className={segmentedControlThumbClasses}
          transition={motionTransitionProp("fast")}
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          segmentedControlItemBodyClasses,
          segmentedControlItemGapClasses[group.size],
          group.layout === "stretch" && segmentedControlItemBodyStretchClasses,
        )}
      >
        {start != null ? (
          <span className={segmentedControlItemStartClasses[group.size]} aria-hidden>
            {start}
          </span>
        ) : null}
        <span className={segmentedControlItemLabelClasses}>{children}</span>
        {end != null ? <span className={segmentedControlItemEndClasses}>{end}</span> : null}
      </span>
    </button>
  );
}

/** Wraps segment buttons so the sliding thumb shares one layoutId scope. */
export function SegmentedControlItemGroup({
  layoutId,
  children,
}: {
  layoutId: string;
  children: ReactNode;
}) {
  return <LayoutGroup id={layoutId}>{children}</LayoutGroup>;
}
