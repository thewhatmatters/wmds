import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../Button/ButtonIcon";
import {
  buttonBaseClasses,
  buttonIconSizeClasses,
  buttonVariantClasses,
  iconButtonSizeClasses,
  type ButtonVariant,
  type IconButtonSize,
} from "../Button/buttonStyles";

export type { ButtonVariant as IconButtonVariant, IconButtonSize };

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible name — used as `aria-label` (not rendered as visible text). Required. */
  label: string;
  /** Icon element rendered inside the button. Required. */
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  /** Native tooltip on hover — defaults to `label`. */
  title?: string;
}

/**
 * Icon-only button — composition wrapper following [Astryx IconButton](https://astryx.atmeta.com/components/IconButton):
 * required `label` + `icon`, square aspect, no visible text.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    label,
    icon,
    variant = "secondary",
    size = "md",
    loading = false,
    disabled,
    className,
    title,
    type = "button",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const tooltip = title ?? label;

  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={tooltip}
      className={cn(
        buttonBaseClasses,
        buttonVariantClasses[variant],
        "shrink-0 rounded-md",
        iconButtonSizeClasses[size],
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
            buttonIconSizeClasses[size],
          )}
          aria-hidden
        />
      ) : (
        <ButtonIcon size={size}>{icon}</ButtonIcon>
      )}
    </button>
  );
});
