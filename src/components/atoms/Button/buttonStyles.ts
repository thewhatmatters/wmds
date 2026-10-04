import { motionTransition, pressScaleClass } from "../../../lib/motion";
import {
  clusterHeightClasses,
  clusterSquareClasses,
} from "../../../lib/clusterScale";

/** Prescribed action roles — not a semantic color picker. ADR-0004. */
export const buttonRoles = ["primary", "secondary", "ghost", "destructive", "inverse", "outline"] as const;

export type ButtonRole = (typeof buttonRoles)[number];

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type IconButtonSize = ButtonSize;

/** All action buttons are pills by default — `layout="row"` for flat full-width detail lines. */
export const buttonPillClass = "rounded-full";

export const buttonLayouts = ["pill", "row", "nav"] as const;

export type ButtonLayout = (typeof buttonLayouts)[number];

/** `layout="row"` width: `fill` (default) spans the container; `hug` sizes to its content. */
export const buttonWidths = ["fill", "hug"] as const;

export type ButtonWidth = (typeof buttonWidths)[number];

/** Pill content alignment: `center` (default) or `start` for full-width suggestion and choice rows. */
export const buttonAligns = ["center", "start"] as const;

export type ButtonAlign = (typeof buttonAligns)[number];

/** `role="outline"` border: `strong` (default, `border-fg`) or `quiet` (`border-border` hairline). */
export const buttonEmphases = ["strong", "quiet"] as const;

export type ButtonEmphasis = (typeof buttonEmphases)[number];

export const buttonBaseClasses =
  "inline-flex cursor-pointer items-center font-sans font-medium normal-case tracking-normal " +
  "transition-[color,transform,box-shadow,border-color,outline-color,background-color] " +
  motionTransition("fast") +
  " " +
  pressScaleClass +
  " " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body " +
  "disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "no-underline";

export const buttonRoleClasses: Record<ButtonRole, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-secondary text-secondary-foreground shadow-raised hover:bg-secondary-hover active:bg-secondary-active",
  ghost:
    "bg-transparent text-ghost-foreground hover:bg-ghost-hover active:bg-ghost-active",
  destructive:
    "bg-error text-on-error hover:bg-error-hover active:bg-error-active",
  /** Light pill on the navy field. Brand ink stays #011272 on white in both themes. */
  inverse: "bg-on-brand text-brand shadow-raised hover:bg-on-brand-hover active:bg-on-brand-hover",
  /** Hairline outline, transparent fill. Gallery intro action. */
  outline: "border border-fg bg-transparent text-fg hover:bg-ghost-hover active:bg-ghost-active",
};

/** `role="outline"` with `emphasis="quiet"` — the same outline on the quiet `border-border` hairline. */
export const buttonOutlineQuietClasses =
  "border border-border bg-transparent text-fg hover:bg-ghost-hover active:bg-ghost-active";

/** Content alignment inside a pill (and IconButton / status pills, which stay centered). */
export const buttonAlignClasses: Record<ButtonAlign, string> = {
  center: "justify-center",
  start: "justify-start text-left",
};

/**
 * Mono uppercase label. `!` beats the sans medium shell.
 * Size is `--font-size-sm` (12px) — small, still a control label.
 */
export const buttonMonoLabelClasses =
  "!font-mono !text-[length:var(--font-size-sm)] !font-normal !uppercase !leading-none !tracking-[0.14em]";

/** Trailing new-tab glyph on an `external` link button — the icon **TextLink** `external` shows. */
export const buttonExternalIconClasses = "-ml-0.5 size-[0.85em] shrink-0 stroke-current";

/** Trailing accent square for a Lucide glyph (`endIcon`). */
export const buttonEndIconSquareClasses =
  "inline-flex size-5 shrink-0 items-center justify-center rounded-none bg-accent text-on-accent";

/** Horizontal padding per size — md = 20px (`px-5`). Shared by action and status modes. */
export const buttonHorizontalPadding: Record<ButtonSize, string> = {
  xs: "px-3.5",
  sm: "px-4",
  md: "px-5",
  lg: "px-7",
};

/** Touch-friendly heights — xs/sm/md align to cluster sm/md/lg (ADR-0011); lg is extended. */
export const buttonSizeClasses: Record<ButtonSize, string> = {
  xs: `${clusterHeightClasses.sm} ${buttonHorizontalPadding.xs} py-1 text-sm leading-none`,
  sm: `${clusterHeightClasses.md} ${buttonHorizontalPadding.sm} py-1.5 text-sm leading-none`,
  md: `${clusterHeightClasses.lg} ${buttonHorizontalPadding.md} py-2.5 text-sm leading-none`,
  lg: `min-h-12 ${buttonHorizontalPadding.lg} py-3 text-base leading-none`,
};

export const buttonIconSizeClasses: Record<ButtonSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-[1.125rem]",
};

/** Square hit targets — xs/sm/md align to cluster sm/md/lg; lg is FAB extended (48px). */
export const iconButtonSizeClasses: Record<IconButtonSize, string> = {
  xs: clusterSquareClasses.sm,
  sm: clusterSquareClasses.md,
  md: clusterSquareClasses.lg,
  lg: "size-12 shrink-0",
};

/** Flat row — TaskRows detail lines, settings rows (not a pill CTA). Width comes from `buttonRowWidthClasses`. */
export const buttonRowBaseClasses =
  "flex cursor-pointer items-center font-sans tracking-normal " +
  "transition-[color,background-color,outline-color] " +
  motionTransition("fast") +
  " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring " +
  "disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50";

export const buttonRowLayoutClasses =
  "h-auto min-h-0 rounded-md px-1.5 py-1 text-left font-normal " +
  "focus-visible:ring-inset focus-visible:ring-offset-0";

/** `fill` — label and value pushed apart across the row. `hug` — content width, label and value close together. */
export const buttonRowWidthClasses: Record<ButtonWidth, string> = {
  fill: "w-full justify-between gap-3",
  hug: "w-auto justify-start gap-1.5",
};

/** Inset nav row — **NavList** rows (icon + label + optional count as children). */
export const buttonNavLayoutClasses =
  "h-auto min-h-0 w-full justify-start gap-2.5 rounded-xl px-2.5 py-2 text-left " +
  "text-sm font-normal leading-[var(--line-height-sm)] " +
  "focus-visible:ring-inset focus-visible:ring-offset-0";

export function buttonNavStateClasses(selected: boolean): string {
  return selected
    ? "bg-secondary text-secondary-foreground"
    : "bg-transparent text-muted hover:bg-ghost-hover hover:text-fg";
}
