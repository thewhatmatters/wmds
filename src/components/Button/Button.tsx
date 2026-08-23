import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonBadge, isBadgeShorthand } from "./ButtonBadge";
import {
  buttonBaseClasses,
  buttonIconSizeClasses,
  buttonSizeClasses,
  buttonVariantClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

export type { ButtonSize, ButtonVariant } from "./buttonStyles";

function ButtonIcon({ size, children }: { size: ButtonSize; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
        buttonIconSizeClasses[size],
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

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
      className={cn(
        buttonBaseClasses,
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        "gap-2 rounded-md",
        className,
      )}
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
