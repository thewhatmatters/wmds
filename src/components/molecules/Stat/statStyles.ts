import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import type { BadgeVariant } from "../../atoms/Badge/Badge";
import type { ButtonSize } from "../../atoms/Button/buttonStyles";

export const statSizes = ["sm", "md", "lg"] as const;

export type StatSize = (typeof statSizes)[number];

export const statTrendDirections = ["up", "down", "neutral", "flat"] as const;

export type StatTrendDirection = (typeof statTrendDirections)[number];

export const statGroupColumns = [2, 3, 4] as const;

export type StatGroupColumns = (typeof statGroupColumns)[number];

/** Bordered metric tile — insights row and hero KPI. */
export const statShellClasses = "flex min-w-0 flex-col rounded-xl border border-border bg-surface";

export const statShellSizeClasses: Record<StatSize, string> = {
  sm: "gap-2 p-4",
  md: "gap-3 p-5",
  lg: "gap-3 p-5",
};

export const statLabelRowClasses = "flex flex-wrap items-center gap-2";

export const statLabelStartClasses = "shrink-0";

export const statLabelTextClasses = "min-w-0 flex-1";

export const statLabelEndClasses = "ml-auto shrink-0";

/** Trailing cluster when `end` and `action` share the label row. */
export const statLabelTrailClasses = "ml-auto flex shrink-0 items-center gap-2";

export const statContentClasses = "flex min-w-0 flex-col gap-1";

export const statContentLgClasses = "gap-2";

export const statLabelClasses = `${typographyClass("overline")} text-muted`;

/** Hero label — sentence case. `sm` / `md` stay on the overline. */
export const statLabelLgClasses = "type-label min-w-0 flex-1 text-muted";

/**
 * Leading glyph tile. `text-brand-outline` is navy in light (`--color-brand`) and the
 * lifted navy in dark, where `#011272` disappears on the surface.
 */
export const statIconTileClasses =
  "inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-outline";

export const statIconTileSizeClasses: Record<StatSize, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-9",
};

export const statIconButtonSize: Record<StatSize, ButtonSize> = {
  sm: "xs",
  md: "sm",
  lg: "sm",
};

export const statValueRowClasses = "flex flex-wrap items-center gap-x-2 gap-y-1";

export const statValueSizeClasses: Record<StatSize, string> = {
  sm: `${typographyClass("section-heading")} tabular-nums tracking-tight text-fg`,
  md: `${typographyClass("page-heading")} tabular-nums tracking-tight text-fg`,
  lg: "type-display-3 tabular-nums tracking-tight text-fg",
};

/** Visible secondary line — "vs $14,850", "of $1M goal". Figures stay tabular. */
export const statContextClasses = `${typographyClass("caption")} tabular-nums`;

/** Stand-in figure when the source is not wired. */
export const statUnavailableClasses = "type-body text-muted";

export const statLoadingLabelHeights: Record<StatSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

export const statLoadingValueHeights: Record<StatSize, number> = {
  sm: 28,
  md: 36,
  lg: 40,
};

export const statLoadingContextHeight = 16;

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
