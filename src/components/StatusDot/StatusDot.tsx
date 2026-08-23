import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type StatusDotVariant = "neutral" | "info" | "success" | "warning" | "destructive";

type StatusDotBaseProps = {
  variant: StatusDotVariant;
  /** Pulse to indicate live/active status. Respects `prefers-reduced-motion`. */
  pulsing?: boolean;
  /** Native tooltip — defaults to `label` when set. */
  title?: string;
  /** Optional icon centered in the dot (`currentColor` / foreground ink). */
  icon?: ReactNode;
};

export type StatusDotProps = StatusDotBaseProps &
  HTMLAttributes<HTMLSpanElement> &
  (
    | { decorative: true; label?: string }
    | { decorative?: false; label: string }
  );

const variantClasses: Record<StatusDotVariant, string> = {
  neutral: "bg-muted text-surface",
  info: "bg-info text-info-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

/**
 * Small semantic status indicator — [Astryx StatusDot](https://astryx.atmeta.com/components/StatusDot).
 * Fixed 8px (`size-2`). Pair with a visible label, or use `decorative` inside Badge/Chip.
 */
export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  {
    variant,
    label,
    decorative = false,
    pulsing = false,
    title,
    icon,
    className,
    ...props
  },
  ref,
) {
  const tooltip = title ?? (decorative ? undefined : label);

  return (
    <span
      ref={ref}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      title={tooltip}
      className={cn(
        "inline-flex size-2 shrink-0 items-center justify-center rounded-full",
        variantClasses[variant],
        pulsing && "animate-status-dot-pulse",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          className="inline-flex size-full items-center justify-center [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current"
          aria-hidden
        >
          {icon}
        </span>
      ) : null}
    </span>
  );
});
