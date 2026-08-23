import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import {
  CountPill,
  horizontalScrollClasses,
  segmentedDisabledClasses,
  segmentedFocusRingClasses,
} from "../../lib/segmentedControl";
import { StatusDot, type StatusDotVariant } from "../StatusDot/StatusDot";

export type ChipDotVariant = StatusDotVariant;

export interface ChipGroupProps<T extends string = string>
  extends HTMLAttributes<HTMLDivElement> {
  /** Currently selected chip value. */
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name for the filter chip toolbar. */
  "aria-label": string;
  children: ReactNode;
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selection value — required when rendered inside `Chip.Group`. */
  value?: string;
  /** Standalone pressed state — omit when using `Chip.Group`. */
  pressed?: boolean;
  /** Trailing count pill. */
  count?: number;
  /** Semantic status dot before the label. Ignored when `startSlot` is set. */
  dot?: ChipDotVariant;
  /** Arbitrary leading slot — icon, avatar, or custom dot. */
  startSlot?: ReactNode;
  children: ReactNode;
}

const ChipGroupContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

function useChipGroup() {
  return useContext(ChipGroupContext);
}

function ChipRoot({
  value,
  pressed,
  count,
  dot,
  startSlot,
  className,
  children,
  onClick,
  type = "button",
  ...props
}: ChipProps) {
  const group = useChipGroup();
  const inGroup = group != null;

  if (inGroup && value == null) {
    throw new Error("Chip inside Chip.Group requires a `value` prop.");
  }

  const isPressed = inGroup ? group.value === value : Boolean(pressed);
  const leading = startSlot ?? (dot != null ? <StatusDot variant={dot} decorative /> : null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inGroup && value != null) {
      group.onValueChange(value);
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      aria-pressed={isPressed}
      className={cn(
        "inline-flex h-[26px] shrink-0 items-center gap-[length:var(--spacing-1-5)] rounded-full",
        "px-[length:var(--spacing-2-5)] text-xs font-medium leading-none",
        "transition-[background-color,box-shadow,color] duration-[length:var(--duration-base)] ease-[var(--ease-standard)]",
        segmentedFocusRingClasses,
        segmentedDisabledClasses,
        isPressed
          ? "bg-surface text-fg shadow-raised"
          : "text-muted hover:bg-ghost-hover",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {leading}
      {children}
      {count != null ? <CountPill active={isPressed} count={count} /> : null}
    </button>
  );
}

function ChipGroup<T extends string = string>({
  value,
  onValueChange,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: ChipGroupProps<T>) {
  return (
    <ChipGroupContext.Provider
      value={{ value, onValueChange: onValueChange as (value: string) => void }}
    >
      <div
        role="toolbar"
        aria-label={ariaLabel}
        className={cn(
          "-mx-[length:var(--spacing-1)] flex items-center gap-[length:var(--spacing-1)] px-[length:var(--spacing-1)] py-[length:var(--spacing-1)]",
          horizontalScrollClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ChipGroupContext.Provider>
  );
}

export const Chip = Object.assign(ChipRoot, {
  Group: ChipGroup,
});
