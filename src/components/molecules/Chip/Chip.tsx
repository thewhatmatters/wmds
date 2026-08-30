import type { ReactElement, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { CountPill, segmentedDisabledClasses, segmentedFocusRingClasses } from "../../../lib/segmentedControl";
import { useChipFilterGroup } from "./ChipFilterGroup";
import { ChipIcon } from "./ChipIcon";
import {
  chipBaseClasses,
  chipIconGapClasses,
  chipReadOnlyClasses,
  chipRemovableGapClasses,
  chipRemoveButtonClasses,
  chipRemoveIconClasses,
  chipSelectedClasses,
  chipSizeClasses,
  chipUnselectedClasses,
  type ChipSize,
} from "./chipStyles";

export type { ChipSize } from "./chipStyles";
export { chipSizes } from "./chipStyles";
export { ChipFilterGroup, type ChipFilterGroupProps, type ChipSelectionMode } from "./ChipFilterGroup";

/** Layout-only — not for colors or typography overrides. */
export type ChipLayoutClassName = string;

export interface ChipProps {
  children: ReactNode;
  size?: ChipSize;
  /** Selection value — required inside {@link ChipFilterGroup}. */
  value?: string;
  /** Standalone filter toggle — omit when using `ChipFilterGroup`. */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Removable token — trailing × dismiss. Not combinable with filter group. */
  onRemove?: () => void;
  /** Leading Lucide icon. */
  icon?: ReactElement;
  /** Trailing count — filter rails only; not with `onRemove`. */
  count?: number;
  /** Display-only shell (e.g. SNAP on a list row). */
  readOnly?: boolean;
  disabled?: boolean;
  className?: ChipLayoutClassName;
}

function resolveChipLabel(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  return "item";
}

function assertChipPattern(
  props: Pick<ChipProps, "value" | "selected" | "onSelectedChange" | "onRemove" | "count" | "readOnly">,
  inGroup: boolean,
) {
  if (inGroup) {
    if (props.value == null) {
      console.warn("[WMDS Chip] `value` is required inside ChipFilterGroup.");
    }
    if (props.onRemove != null || props.selected != null || props.onSelectedChange != null) {
      console.warn("[WMDS Chip] Filter group chips cannot use `onRemove` or standalone `selected`.");
    }
  }

  if (props.onRemove != null && props.count != null) {
    console.warn("[WMDS Chip] `count` is not combinable with `onRemove`.");
  }

  if (props.readOnly && (props.onRemove != null || props.selected != null || inGroup)) {
    console.warn("[WMDS Chip] `readOnly` chips are display-only — no group, remove, or selection.");
  }
}

function useChipSelected(
  value: string | undefined,
  selectedProp: boolean | undefined,
  inGroup: boolean,
  group: ReturnType<typeof useChipFilterGroup>,
): boolean {
  if (!inGroup || group == null || value == null) {
    return Boolean(selectedProp);
  }

  if (group.selectionMode === "multiple") {
    return (group.value as string[]).includes(value);
  }

  return group.value === value;
}

function toggleInGroup(
  value: string,
  group: NonNullable<ReturnType<typeof useChipFilterGroup>>,
) {
  if (group.selectionMode === "multiple") {
    const current = group.value as string[];
    const next = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];
    group.onValueChange(next);
    return;
  }

  const current = group.value as string;
  group.onValueChange(current === value ? "" : value);
}

/**
 * Interactive filter, removable token, or read-only label chip.
 * Pattern-first — use {@link ChipFilterGroup} for multi-select filters (Farmer Market).
 */
export function Chip({
  children,
  size = "md",
  value,
  selected: selectedProp,
  onSelectedChange,
  onRemove,
  icon,
  count,
  readOnly = false,
  disabled,
  className,
}: ChipProps) {
  const group = useChipFilterGroup();
  const inGroup = group != null;
  assertChipPattern(
    { value, selected: selectedProp, onSelectedChange, onRemove, count, readOnly },
    inGroup,
  );

  const label = resolveChipLabel(children);
  const isRemovable = onRemove != null;
  const isSelected = useChipSelected(value, selectedProp, inGroup, group);
  const showIcon = icon != null;
  const shellSizeClass = isRemovable ? chipRemovableGapClasses[size] : chipSizeClasses[size];

  if (readOnly) {
    return (
      <span
        className={cn(
          chipBaseClasses,
          shellSizeClass,
          showIcon && chipIconGapClasses[size],
          chipReadOnlyClasses,
          className,
        )}
        data-pattern="read-only"
        data-size={size}
      >
        {showIcon ? <ChipIcon size={size}>{icon}</ChipIcon> : null}
        {children}
      </span>
    );
  }

  if (isRemovable) {
    return (
      <span
        className={cn(
          chipBaseClasses,
          shellSizeClass,
          showIcon && chipIconGapClasses[size],
          chipSelectedClasses,
          className,
        )}
        data-pattern="removable"
        data-size={size}
      >
        {showIcon ? <ChipIcon size={size}>{icon}</ChipIcon> : null}
        <span className="truncate">{children}</span>
        <button
          type="button"
          className={cn(
            chipRemoveButtonClasses[size],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
          )}
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <X className={chipRemoveIconClasses[size]} strokeWidth={2} aria-hidden />
        </button>
      </span>
    );
  }

  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (inGroup && value != null && group != null) {
      toggleInGroup(value, group);
      return;
    }

    onSelectedChange?.(!isSelected);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      onClick={handleClick}
      className={cn(
        chipBaseClasses,
        shellSizeClass,
        showIcon && chipIconGapClasses[size],
        segmentedFocusRingClasses,
        segmentedDisabledClasses,
        isSelected ? chipSelectedClasses : chipUnselectedClasses,
        className,
      )}
      data-pattern={inGroup ? "filter" : "toggle"}
      data-size={size}
      data-value={value}
    >
      {showIcon ? <ChipIcon size={size}>{icon}</ChipIcon> : null}
      {children}
      {count != null ? <CountPill active={isSelected} count={count} /> : null}
    </button>
  );
}
