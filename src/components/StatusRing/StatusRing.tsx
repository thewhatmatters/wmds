import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

const SIZE = 24;
const STROKE = 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = CIRCUMFERENCE * 0.28;

export type StatusRingProps = HTMLAttributes<HTMLSpanElement> & {
  /** Numeric count — rendered centered when `children` is omitted. */
  count?: number;
  /** Center content override (count, icon, short label). */
  children?: ReactNode;
  /** Clockwise arc sweep. Defaults to `true` when `count > 0`. */
  active?: boolean;
  /** Native tooltip — defaults to `label` when set. */
  title?: string;
} & (
  | { decorative: true; label?: string }
  | { decorative?: false; label: string }
);

/**
 * 24px count ring with optional clockwise sweep — pairs with {@link StatusDot} in list rows.
 * Use `decorative` inside `List.ItemMedia` when a visible row label is present.
 */
export const StatusRing = forwardRef<HTMLSpanElement, StatusRingProps>(function StatusRing(
  {
    count,
    children,
    active,
    label,
    decorative = false,
    title,
    className,
    ...props
  },
  ref,
) {
  const center = children ?? count;
  const isActive = active ?? (count != null ? count > 0 : false);
  const tooltip = title ?? (decorative ? undefined : label);

  return (
    <span
      ref={ref}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      title={tooltip}
      className={cn(
        "relative inline-flex size-6 shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    >
      <svg
        width={SIZE}
        height={SIZE}
        className={cn("absolute inset-0", isActive && "animate-status-ring")}
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={STROKE}
        />
        {isActive ? (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
          />
        ) : null}
      </svg>
      {center != null ? (
        <span className="relative text-[10.5px] font-semibold tabular-nums leading-none text-fg">
          {center}
        </span>
      ) : null}
    </span>
  );
});
