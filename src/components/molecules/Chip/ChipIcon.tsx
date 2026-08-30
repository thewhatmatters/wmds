import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { chipIconSizeClasses, type ChipSize } from "./chipStyles";

export function ChipIcon({ size, children }: { size: ChipSize; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
        chipIconSizeClasses[size],
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
