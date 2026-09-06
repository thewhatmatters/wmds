import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import type { BadgeVariant } from "../../atoms/Badge/Badge";

export const statSizes = ["sm", "md"] as const;

export type StatSize = (typeof statSizes)[number];

export const statTrendDirections = ["up", "down", "neutral"] as const;

export type StatTrendDirection = (typeof statTrendDirections)[number];

export const statGroupColumns = [2, 3, 4] as const;

export type StatGroupColumns = (typeof statGroupColumns)[number];

/** Bordered metric tile — insights row and hero KPI. */
export const statShellClasses = "flex min-w-0 flex-col rounded-xl border border-border bg-surface";

export const statShellSizeClasses: Record<StatSize, string> = {
  sm: "gap-2 p-4",
  md: "gap-3 p-5",
};

export const statLabelRowClasses = "flex items-center gap-2";

export const statLabelStartClasses = "shrink-0";

export const statLabelTextClasses = "min-w-0 flex-1";

export const statLabelEndClasses = "ml-auto shrink-0";

export const statContentClasses = "flex min-w-0 flex-col gap-1";

export const statLabelClasses = `${typographyClass("overline")} text-muted`;

export const statValueRowClasses = "flex flex-wrap items-baseline gap-x-2 gap-y-1";

export const statValueSizeClasses: Record<StatSize, string> = {
  sm: `${typographyClass("section-heading")} tabular-nums tracking-tight text-fg`,
  md: `${typographyClass("page-heading")} tabular-nums tracking-tight text-fg`,
};

export const statLoadingLabelHeights: Record<StatSize, number> = {
  sm: 12,
  md: 14,
};

export const statLoadingValueHeights: Record<StatSize, number> = {
  sm: 28,
  md: 36,
};

export function statGroupGridClasses(columns: StatGroupColumns): string {
  const lgCols: Record<StatGroupColumns, string> = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  return cn("grid grid-cols-2 gap-4", lgCols[columns]);
}

export function statTrendBadgeVariant(direction: StatTrendDirection): BadgeVariant {
  if (direction === "up") {
    return "success";
  }
  if (direction === "down") {
    return "destructive";
  }
  return "neutral";
}
