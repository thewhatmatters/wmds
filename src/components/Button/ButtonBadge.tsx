import type { ReactNode } from "react";
import { Badge } from "../Badge/Badge";

/** Button end-slot badge — contextual overrides on top of standalone `Badge`. */
export function ButtonBadge({ value }: { value: number | string }) {
  const isCount = typeof value === "number";

  return (
    <Badge
      label={value}
      variant="neutral"
      size="sm"
      appearance={isCount ? "count" : "label"}
      className={
        isCount
          ? "border-transparent bg-bg text-fg"
          : "border-border bg-surface text-muted"
      }
    />
  );
}

export function isBadgeShorthand(value: ReactNode): value is number | string {
  return typeof value === "number" || typeof value === "string";
}
