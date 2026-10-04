import type { SemanticVariant } from "../../../lib/semanticVariants";
import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";

export const badgeVariants = ["neutral", "info", "success", "warning", "destructive"] as const;

export type BadgeVariant = (typeof badgeVariants)[number];

export type BadgeSize = "sm" | "md";

export const badgeEmphases = ["solid", "muted", "outline"] as const;

export type BadgeEmphasis = (typeof badgeEmphases)[number];

/** Shared shell — Astryx-style compact pill labels. */
export const badgeBaseClasses =
  "inline-flex shrink-0 items-center justify-center font-sans font-medium normal-case tracking-normal";

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

/** Hairline outline, transparent fill — author and category tags. */
export const badgeOutlineClasses: Record<BadgeVariant, string> = {
  neutral: "border border-border-emphasized bg-transparent text-fg",
  info: "border border-info bg-transparent text-info",
  success: "border border-success bg-transparent text-success",
  warning: "border border-warning bg-transparent text-warning",
  destructive: "border border-error bg-transparent text-error",
};

export function badgeSurfaceClasses(variant: BadgeVariant, emphasis: BadgeEmphasis): string {
  if (emphasis === "outline") return badgeOutlineClasses[variant];
  return emphasis === "muted" ? badgeMutedClasses[variant] : badgeSolidClasses[variant];
}

/** Mono uppercase label — the same face, size, and tracking as **Button** `mono`. `!` beats the sans medium shell. */
export const badgeMonoClasses =
  "!font-mono !text-[length:var(--font-size-sm)] !font-normal !uppercase !tracking-[0.14em]";

/**
 * A badge composed onto a link (`render`): an underline on hover, the hairline darkens on an
 * outline badge, the focus ring, and a 44px-tall hit area around the 20–24px pill.
 */
export const badgeInteractiveClasses = cn(
  "relative cursor-pointer decoration-1 underline-offset-2 hover:underline",
  "after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body",
  "transition-[border-color,text-decoration-color]",
  motionTransition("fast"),
);

export const badgeInteractiveOutlineClasses = "hover:border-fg";

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

/**
 * Label shell when a leading Avatar fills the pill height.
 * sm pairs with Avatar `xsm` (20px); md pairs with Avatar `sm` (24px).
 */
export const badgeAvatarLabelSizeClasses: Record<BadgeSize, string> = {
  sm: "h-5 gap-1 rounded-full py-0 pl-0 pr-2 text-xs leading-none",
  md: "h-6 gap-1.5 rounded-full py-0 pl-0 pr-2.5 text-sm leading-none",
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
