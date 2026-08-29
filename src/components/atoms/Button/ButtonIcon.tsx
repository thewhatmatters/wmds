import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { buttonIconSizeClasses, type ButtonSize } from "./buttonStyles";

/** Sized icon wrapper for Button and IconButton — inherits foreground, scales SVG. */
export function ButtonIcon({ size, children }: { size: ButtonSize; children: ReactNode }) {
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
