import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { ButtonStatusIcon, ButtonStatusLabel } from "./ButtonStatusContent";
import {
  getStatusPaint,
  getStatusShellClass,
  statusMorphTransition,
} from "./buttonStatusMotion";
import {
  buttonStatusIconGapClasses,
  buttonStatusSizeClasses,
  resolveStatusLabels,
  type ButtonStatus,
} from "./buttonStatusStyles";
import {
  buttonBaseClasses,
  buttonPillClass,
  type ButtonRole,
  type ButtonSize,
} from "./buttonStyles";

export interface ButtonStatusButtonProps {
  status: ButtonStatus;
  role?: ButtonRole;
  size?: ButtonSize;
  statusLabels?: Partial<Record<ButtonStatus, string>>;
  disableOnError?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  id?: string;
  name?: string;
  form?: string;
  children: ReactNode;
}

export function ButtonStatusButton({
  status,
  role = "primary",
  size = "md",
  statusLabels,
  disableOnError = false,
  disabled,
  className,
  children,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  id,
  name,
  form,
}: ButtonStatusButtonProps) {
  const labels = resolveStatusLabels(children, statusLabels);
  const label = labels[status];
  const isDisabled = disabled || status === "loading" || (status === "error" && disableOnError);
  const paint = getStatusPaint(status, role);

  return (
    <motion.button
      type={type}
      layout
      disabled={isDisabled}
      aria-busy={status === "loading" || undefined}
      aria-live="polite"
      aria-label={ariaLabel}
      data-role={role}
      data-size={size}
      data-status={status}
      animate={paint}
      initial={false}
      className={cn(
        buttonBaseClasses,
        buttonStatusSizeClasses[size],
        status !== "idle" && buttonStatusIconGapClasses[size],
        buttonPillClass,
        getStatusShellClass(status, role),
        "overflow-hidden",
        className,
      )}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={statusMorphTransition}
      onClick={onClick}
      id={id}
      name={name}
      form={form}
    >
      <ButtonStatusIcon status={status} size={size} />
      <ButtonStatusLabel label={label} />
    </motion.button>
  );
}
