import type { SemanticVariant } from "../../../lib/semanticVariants";

export const badgeVariants = ["neutral", "info", "success", "warning", "destructive"] as const;

export type BadgeVariant = (typeof badgeVariants)[number];

export type BadgeSize = "sm" | "md";

/** Shared shell — Astryx-style compact pill labels. */
export const badgeBaseClasses =
  "inline-flex shrink-0 items-center justify-center font-sans font-medium tracking-normal";

/**
 * Solid semantic fills — matches [Astryx Badge](https://astryx.atmeta.com/components/Badge) status row.
 * Neutral stays subtle (category / draft tags).
 */
export const badgeSolidClasses: Record<BadgeVariant, string> = {
  neutral: "border border-border bg-secondary text-secondary-foreground shadow-raised",
  info: "bg-info text-info-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

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

/** Internal — trailing count on secondary/primary buttons. */
export const badgeOnButtonCountClasses =
  "border border-transparent bg-bg text-fg shadow-raised";

export function isBadgeVariant(value: string): value is BadgeVariant {
  return (badgeVariants as readonly string[]).includes(value);
}

export type { SemanticVariant };
