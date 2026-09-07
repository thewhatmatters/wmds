import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  kbdBaseClasses,
  kbdSizeClasses,
  type KbdSize,
} from "./kbdStyles";

export type { KbdSize } from "./kbdStyles";
export { kbdSizes } from "./kbdStyles";

/** Layout-only — margin or flex placement; not for re-theming the keycap. */
export type KbdLayoutClassName = string;

export interface KbdProps {
  /** Visible key label, such as `K`, `⌘`, `Enter`, or `Esc`. */
  children: ReactNode;
  size?: KbdSize;
  /** Accessible expansion for symbolic key labels when needed. */
  "aria-label"?: string;
  /** Layout-only: margin or flex placement. */
  className?: KbdLayoutClassName;
}

/** Semantic keyboard keycap for shortcuts and command hints. */
export function Kbd({
  children,
  size = "sm",
  "aria-label": ariaLabel,
  className,
}: KbdProps) {
  return (
    <kbd
      aria-label={ariaLabel}
      className={cn(kbdBaseClasses, kbdSizeClasses[size], className)}
      data-size={size}
    >
      {children}
    </kbd>
  );
}
