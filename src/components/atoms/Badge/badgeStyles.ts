import type { SemanticVariant } from "../../../lib/semanticVariants";
import { cn } from "../../../lib/cn";

export const badgeVariants = ["neutral", "info", "success", "warning", "destructive"] as const;

export type BadgeVariant = (typeof badgeVariants)[number];

export type BadgeSize = "sm" | "md";

export const badgeEmphases = ["solid", "muted"] as const;

export type BadgeEmphasis = (typeof badgeEmphases)[number];

/** Shared shell — Astryx-style compact pill labels. */
export const badgeBaseClasses =
  "inline-flex shrink-0 items-center justify-center font-sans font-medium tracking-normal";

/**
 * Solid semantic fills — matches [Astryx Badge](https://astryx.atmeta.com/components/Badge) status row.
 * Neutral stays subtle (category / draft tags).
 */
export const badgeSolidClasses: Record<BadgeVariant, string> = {
  neutral: "border border-border bg-secondary text-secondary-foreground shadow-raised",
  info: "bg-info text-on-info",
  success: "bg-success text-on-success",
  warning: "bg-warning text-on-warning",
  destructive: "bg-error text-on-error",
};

/** Soft semantic fills — task row trailing pills, subtle status copy. */
export const badgeMutedClasses: Record<BadgeVariant, string> = {
  neutral: "border border-border bg-secondary text-secondary-foreground",
  info: "bg-info-muted text-info",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  destructive: "bg-error-muted text-error",
};

export function badgeSurfaceClasses(variant: BadgeVariant, emphasis: BadgeEmphasis): string {
  return emphasis === "muted" ? badgeMutedClasses[variant] : badgeSolidClasses[variant];
}

/** Label sizing — text-only and icon patterns share the same padding shell. */
export const badgeLabelSizeClasses: Record<BadgeSize, string> = {
  sm: "h-5 rounded-full px-2 text-xs leading-none",
  md: "h-6 rounded-full px-2.5 text-sm leading-none",
};

/** Gap between leading icon and label — only when `icon` is set. */
export const badgeIconGapClasses: Record<BadgeSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
};

export const badgeIconSizeClasses: Record<BadgeSize, string> = {
  sm: "size-3 shrink-0 stroke-current",
  md: "size-3.5 shrink-0 stroke-current",
};

/** Compact numeric pill — notifications, totals. */
export const badgeCountSizeClasses: Record<BadgeSize, string> = {
  sm: "min-h-[1.125rem] min-w-[1.125rem] rounded-full px-1 text-xs leading-none tabular-nums",
  md: "min-h-[1.25rem] min-w-[1.25rem] rounded-full px-1 text-sm leading-none tabular-nums",
};

/** Icon-only circle — **TaskRows** leading done/failed (22px). */
export const badgeIconOnlySizeClasses = "size-[1.375rem] rounded-full p-0";

/** Internal — trailing count on secondary/primary buttons. */
export const badgeOnButtonCountClasses =
  "border border-transparent bg-surface text-fg shadow-raised";

/** Segment filter count — Chip / Tab trailing totals (not notification count). */
export function badgeSegmentCountClasses(active: boolean): string {
  return cn(
    "rounded px-[length:var(--spacing-1)] text-[10.5px] leading-none tabular-nums text-muted",
    active && "bg-secondary",
  );
}

export function isBadgeVariant(value: string): value is BadgeVariant {
  return (badgeVariants as readonly string[]).includes(value);
}

export type { SemanticVariant };
