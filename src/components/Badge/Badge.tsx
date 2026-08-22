import type { HTMLAttributes, ReactNode } from "react";

/** Semantic roles — maps Astryx `error` → `destructive`. Decorative palette variants are out of scope for WMDS. */
export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "destructive";

export type BadgeSize = "sm" | "md";

export type BadgeAppearance = "label" | "count";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge content — Astryx API name is `label`; WMDS accepts `children` or `label`. */
  label?: ReactNode;
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** `count` — compact pill for numeric badges (tabular nums, min width). */
  appearance?: BadgeAppearance;
  /** Content-agnostic leading slot — image, icon, initials, or any node. */
  startSlot?: ReactNode;
  /** Content-agnostic trailing slot — icon, count, or any node. */
  endSlot?: ReactNode;
}

const baseClasses =
  "inline-flex shrink-0 items-center justify-center font-sans font-medium tracking-normal";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border border-border bg-surface text-muted",
  info:
    "border border-[color-mix(in_srgb,var(--color-info)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-info)_12%,var(--color-surface))] text-info",
  success:
    "border border-[color-mix(in_srgb,var(--color-success)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-success)_12%,var(--color-surface))] text-success",
  warning:
    "border border-[color-mix(in_srgb,var(--color-warning)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-warning)_12%,var(--color-surface))] text-warning",
  destructive:
    "border border-[color-mix(in_srgb,var(--color-destructive)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-destructive)_12%,var(--color-surface))] text-destructive",
};

const labelSizeClasses: Record<BadgeSize, string> = {
  sm: "rounded-full px-[length:var(--spacing-1-5)] py-[length:var(--spacing-0)] text-xs leading-[var(--line-height-xs)]",
  md: "rounded-full px-[length:var(--spacing-2)] py-[length:var(--spacing-1)] text-sm leading-[var(--line-height-sm)]",
};

/** Inline chip — slot + label; padding is per-side, not label `px`. */
const chipSizeClasses: Record<BadgeSize, string> = {
  sm: "rounded-full py-[1px] text-xs leading-none gap-[3px]",
  md: "rounded-full py-[length:var(--spacing-1)] text-sm leading-none gap-[length:var(--spacing-1)]",
};

const countSizeClasses: Record<BadgeSize, string> = {
  sm: "min-h-[1.125rem] min-w-[1.125rem] rounded-full px-[length:var(--spacing-1)] text-xs leading-none tabular-nums",
  md: "min-h-[1.25rem] min-w-[1.25rem] rounded-full px-[length:var(--spacing-1)] text-sm leading-none tabular-nums",
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Badge({
  label,
  children,
  variant = "neutral",
  size = "sm",
  appearance = "label",
  startSlot,
  endSlot,
  className,
  ...props
}: BadgeProps) {
  const content = children ?? label;
  const hasStart = startSlot != null;
  const hasEnd = endSlot != null;
  const isChip = hasStart || hasEnd;

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        appearance === "count"
          ? countSizeClasses[size]
          : isChip
            ? chipSizeClasses[size]
            : labelSizeClasses[size],
        isChip && "mx-[length:var(--spacing-0)] align-middle",
        isChip && hasStart && (size === "sm" ? "pl-[2px]" : "pl-[length:var(--spacing-1)]"),
        isChip && !hasStart && "pl-[length:var(--spacing-1-5)]",
        isChip && hasEnd && (size === "sm" ? "pr-[2px]" : "pr-[length:var(--spacing-1)]"),
        isChip && !hasEnd && "pr-[length:var(--spacing-1-5)]",
        isChip && variant === "neutral" && "border-border bg-secondary text-fg shadow-raised",
        className,
      )}
      data-variant={variant}
      data-size={size}
      data-appearance={appearance}
      {...props}
    >
      {startSlot}
      {content}
      {endSlot}
    </span>
  );
}
