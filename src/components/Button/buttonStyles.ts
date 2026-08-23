
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type IconButtonSize = ButtonSize;

export const buttonBaseClasses =
  "inline-flex items-center justify-center font-sans font-medium tracking-normal " +
  "transition-[color,transform] duration-[length:var(--duration-fast)] ease-[var(--ease-standard)] " +
  "enabled:active:scale-[var(--motion-press-scale)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:pointer-events-none disabled:opacity-50";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-secondary text-secondary-foreground shadow-raised hover:bg-secondary-hover active:bg-secondary-active",
  ghost:
    "bg-transparent text-ghost-foreground hover:bg-ghost-hover active:bg-ghost-active",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active",
  success:
    "bg-success text-success-foreground shadow-inset-highlight hover:bg-success-hover active:bg-success-active",
  warning:
    "bg-warning text-warning-foreground hover:bg-warning-hover active:bg-warning-active",
  info: "bg-info text-info-foreground hover:bg-info-hover active:bg-info-active",
};

/** py + text line-height ≈ visual height (xs ~28px, sm ~32px, md ~40px, lg ~48px). */
export const buttonSizeClasses: Record<ButtonSize, string> = {
  xs: "px-[length:var(--spacing-3)] py-[length:var(--spacing-1)] text-sm leading-[var(--line-height-sm)]",
  sm: "px-[length:var(--spacing-3)] py-[length:var(--spacing-1-5)] text-sm leading-[var(--line-height-sm)]",
  md: "px-[length:var(--spacing-4)] py-[length:var(--spacing-2-5)] text-sm leading-[var(--line-height-sm)]",
  lg: "px-[length:var(--spacing-6)] py-[length:var(--spacing-3)] text-base leading-[var(--line-height-base)]",
};

export const buttonIconSizeClasses: Record<ButtonSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-[1.125rem]",
};

/** Square hit targets — paired with buttonIconSizeClasses for the glyph. */
export const iconButtonSizeClasses: Record<IconButtonSize, string> = {
  xs: "size-7",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}
