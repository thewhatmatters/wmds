import { motionTransition, pressScaleClass } from "../../../lib/motion";
import {
  clusterHeightClasses,
  clusterSquareClasses,
} from "../../../lib/clusterScale";

/** Prescribed action roles — not a semantic color picker. ADR-0004. */
export const buttonRoles = ["primary", "secondary", "ghost", "destructive"] as const;

export type ButtonRole = (typeof buttonRoles)[number];

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type IconButtonSize = ButtonSize;

/** All buttons are pills — one prescribed shape (ADR-0004). */
export const buttonPillClass = "rounded-full";

export const buttonBaseClasses =
  "inline-flex cursor-pointer items-center justify-center font-sans font-medium tracking-normal " +
  "transition-[color,transform,box-shadow,border-color,outline-color,background-color] " +
  motionTransition("fast") +
  " " +
  pressScaleClass +
  " " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body " +
  "disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50";

export const buttonRoleClasses: Record<ButtonRole, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-secondary text-secondary-foreground shadow-raised hover:bg-secondary-hover active:bg-secondary-active",
  ghost:
    "bg-transparent text-ghost-foreground hover:bg-ghost-hover active:bg-ghost-active",
  destructive:
    "bg-error text-on-error hover:bg-error-hover active:bg-error-active",
};

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
