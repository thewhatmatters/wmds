import type { ReactNode } from "react";
import { buttonHorizontalPadding, type ButtonSize } from "./buttonStyles";

/** Multi-state pill cycle — inspired by [Motion multi-state badge](https://motion.dev/examples/react-multi-state-badge). */
export type ButtonStatus = "idle" | "loading" | "success" | "error";

export const buttonStatusCycle: ButtonStatus[] = ["idle", "loading", "success", "error"];

export const defaultStatusLabels: Record<ButtonStatus, string> = {
  idle: "Start",
  loading: "Processing",
  success: "Success",
  error: "Error",
};

export function getNextButtonStatus(current: ButtonStatus): ButtonStatus {
  const index = buttonStatusCycle.indexOf(current);
  return buttonStatusCycle[(index + 1) % buttonStatusCycle.length]!;
}

export function resolveStatusLabels(
  children: ReactNode,
  overrides?: Partial<Record<ButtonStatus, string>>,
): Record<ButtonStatus, string> {
  const idleLabel =
    overrides?.idle ??
    (typeof children === "string" || typeof children === "number" ? String(children) : defaultStatusLabels.idle);

  return {
    idle: idleLabel,
    loading: overrides?.loading ?? defaultStatusLabels.loading,
    success: overrides?.success ?? defaultStatusLabels.success,
    error: overrides?.error ?? defaultStatusLabels.error,
  };
}

/** Status morph sizing — same horizontal padding as classic buttons. Gap applied only when icon visible. */
export const buttonStatusSizeClasses = {
  xs: `min-h-7 ${buttonHorizontalPadding.xs} py-1 text-sm leading-none`,
  sm: `min-h-8 ${buttonHorizontalPadding.sm} py-1.5 text-sm leading-none`,
  md: `min-h-11 ${buttonHorizontalPadding.md} py-2.5 text-sm leading-none`,
  lg: `min-h-12 ${buttonHorizontalPadding.lg} py-3 text-base leading-none`,
} as const satisfies Record<ButtonSize, string>;

export const buttonStatusIconGapClasses = {
  xs: "gap-1.5",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2",
} as const satisfies Record<ButtonSize, string>;
