import type { ReactElement, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { ButtonBadge } from "./ButtonBadge";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonStatusButton } from "./ButtonStatusButton";
import type { ButtonStatus } from "./buttonStatusStyles";
import {
  buttonBaseClasses,
  buttonPillClass,
  buttonRoleClasses,
  buttonSizeClasses,
  type ButtonRole,
  type ButtonSize,
} from "./buttonStyles";

export type { ButtonRole, ButtonSize } from "./buttonStyles";
export { buttonRoles } from "./buttonStyles";
export type { ButtonStatus } from "./buttonStatusStyles";
export { defaultStatusLabels, getNextButtonStatus } from "./buttonStatusStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type ButtonLayoutClassName = string;

export interface ButtonProps {
  /** Button label. */
  children: ReactNode;
  /** Action role — primary CTA, secondary, ghost, or destructive. Default: `primary`. */
  role?: ButtonRole;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /**
   * Async / submit morph — whole pill animates idle → loading → success → error.
   * [Motion multi-state badge](https://motion.dev/examples/react-multi-state-badge).
   * Mutually exclusive with `icon` and `count`.
   */
  status?: ButtonStatus;
  statusLabels?: Partial<Record<ButtonStatus, string>>;
  /** When true, error state is non-interactive. Default: clickable for retry. */
  disableOnError?: boolean;
  /** Leading Lucide icon — `import { … } from "lucide-react"`. Not combinable with `status`. */
  icon?: ReactElement;
  /** Trailing numeric count (inbox / notifications). Not combinable with `status`. */
  count?: number;
  /** Layout-only: width, margin, flex placement. */
  className?: ButtonLayoutClassName;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  id?: string;
  name?: string;
  form?: string;
}

function assertActionPattern(props: Pick<ButtonProps, "status" | "icon" | "count">) {
  if (props.status != null) {
    if (props.icon != null || props.count != null) {
      console.warn("[WMDS Button] `status` is mutually exclusive with `icon` and `count`.");
    }
  }
}

export function Button({
  children,
  role = "primary",
  size = "md",
  disabled,
  type = "button",
  status,
  statusLabels,
  disableOnError,
  icon,
  count,
  className,
  onClick,
  "aria-label": ariaLabel,
  id,
  name,
  form,
}: ButtonProps) {
  assertActionPattern({ status, icon, count });

  if (status != null) {
    return (
      <ButtonStatusButton
        status={status}
        role={role}
        size={size}
        statusLabels={statusLabels}
        disableOnError={disableOnError}
        disabled={disabled}
        className={className}
        type={type}
        onClick={onClick}
        aria-label={ariaLabel}
        id={id}
        name={name}
        form={form}
      >
        {children}
      </ButtonStatusButton>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      id={id}
      name={name}
      form={form}
      className={cn(
        buttonBaseClasses,
        buttonRoleClasses[role],
        buttonSizeClasses[size],
        buttonPillClass,
        "gap-2",
        className,
      )}
      data-role={role}
      data-size={size}
    >
      {icon ? <ButtonIcon size={size}>{icon}</ButtonIcon> : null}
      <span>{children}</span>
      {count != null ? <ButtonBadge value={count} /> : null}
    </button>
  );
}
