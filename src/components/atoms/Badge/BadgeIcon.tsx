import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { badgeIconSizeClasses, type BadgeSize } from "./badgeStyles";

export function BadgeIcon({ size, children }: { size: BadgeSize; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
        badgeIconSizeClasses[size],
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
