import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonBadge, isBadgeShorthand } from "./ButtonBadge";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "info";

/** Height comes from padding + typography — no fixed height. */
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Shorthand for `startSlot` — Lucide or any icon node. Prefer `startSlot` for arbitrary content. */
  icon?: ReactNode;
  /** Shorthand for `endSlot` — count (`3`) or label (`"New"`). Prefer `endSlot` for arbitrary content. */
  badge?: ReactNode;
  /** Content-agnostic leading slot — image, icon, spinner replacement, or any node. */
  startSlot?: ReactNode;
  /** Content-agnostic trailing slot — badge, icon, or any node. */
  endSlot?: ReactNode;
  children: ReactNode;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium tracking-normal " +
  "transition-[color,transform] duration-[length:var(--duration-fast)] ease-[var(--ease-standard)] " +
  "enabled:active:scale-[var(--motion-press-scale)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
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
const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-[length:var(--spacing-3)] py-[length:var(--spacing-1)] text-sm leading-[var(--line-height-sm)]",
  sm: "px-[length:var(--spacing-3)] py-[length:var(--spacing-1-5)] text-sm leading-[var(--line-height-sm)]",
  md: "px-[length:var(--spacing-4)] py-[length:var(--spacing-2-5)] text-sm leading-[var(--line-height-sm)]",
  lg: "px-[length:var(--spacing-6)] py-[length:var(--spacing-3)] text-base leading-[var(--line-height-base)]",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-[1.125rem]",
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ButtonIcon({ size, children }: { size: ButtonSize; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
        iconSizeClasses[size],
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

function resolveEndSlot(endSlot: ReactNode | undefined, badge: ReactNode | undefined): ReactNode {
  if (endSlot != null) return endSlot;
  if (badge == null) return null;
  if (isBadgeShorthand(badge)) return <ButtonBadge value={badge} />;
  return badge;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  badge,
  startSlot,
  endSlot,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const spinnerSize = size === "xs" ? "size-3.5" : "size-4";

  const resolvedStart =
    !loading && startSlot != null
      ? startSlot
      : !loading && icon != null
        ? (
            <ButtonIcon size={size}>{icon}</ButtonIcon>
          )
        : null;

  const resolvedEnd = resolveEndSlot(endSlot, badge);

  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {loading ? (
        <span
          className={cn(
            "animate-spin shrink-0 rounded-full border-2 border-current border-r-transparent",
            spinnerSize,
          )}
          aria-hidden
        />
      ) : (
        resolvedStart
      )}
      <span>{children}</span>
      {resolvedEnd}
    </button>
  );
}
