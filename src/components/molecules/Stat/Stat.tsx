import type { ReactNode } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
import { cn } from "../../../lib/cn";
import {
  statContentClasses,
  statGroupGridClasses,
  statLabelClasses,
  statLoadingLabelHeights,
  statLoadingValueHeights,
  statShellClasses,
  statShellSizeClasses,
  statLabelEndClasses,
  statLabelRowClasses,
  statLabelStartClasses,
  statLabelTextClasses,
  statTrendBadgeVariant,
  statValueRowClasses,
  statValueSizeClasses,
  type StatGroupColumns,
  type StatSize,
  type StatTrendDirection,
} from "./statStyles";

export type {
  StatGroupColumns,
  StatSize,
  StatTrendDirection,
} from "./statStyles";
export {
  statGroupColumns,
  statGroupGridClasses,
  statSizes,
  statTrendDirections,
} from "./statStyles";

/** Layout-only — grid width, margin; not for re-theming the tile shell. */
export type StatLayoutClassName = string;

export interface StatTrend {
  /** Trend copy — e.g. `+2.1%` or `-0.8%`. */
  value: string;
  direction?: StatTrendDirection;
  /** Optional context — exposed as `title` on the trend badge for sighted tooltips. */
  label?: string;
}

export interface StatProps {
  /** Metric name — e.g. Followers, ER, Reach. */
  label: string;
  /** Headline figure — pre-formatted string or number. */
  value: ReactNode;
  /** Compact delta — **Badge** `emphasis="muted"` in the value row. */
  trend?: StatTrend;
  /** Leading slot — inline with the label row. */
  start?: ReactNode;
  /** Trailing slot — inline with the label row (e.g. share, kebab). */
  end?: ReactNode;
  size?: StatSize;
  /** Skeleton label + value — sets `aria-busy` on the tile. */
  loading?: boolean;
  className?: StatLayoutClassName;
}

export interface StatGroupProps {
  children: ReactNode;
  /** Landmark label when the group summarizes a dashboard region — e.g. Insights metrics. */
  "aria-label"?: string;
  /** Desktop column count — mobile stays 2-up. Default `4`. */
  columns?: StatGroupColumns;
  className?: StatLayoutClassName;
}

function StatTrendBadge({ trend }: { trend: StatTrend }) {
  const direction = trend.direction ?? "neutral";

  return (
    <span title={trend.label}>
      <Badge size="sm" emphasis="muted" variant={statTrendBadgeVariant(direction)}>
        {trend.value}
      </Badge>
    </span>
  );
}

function StatLoadingContent({ size, index = 0 }: { size: StatSize; index?: number }) {
  return (
    <>
      <Skeleton
        width="45%"
        height={statLoadingLabelHeights[size]}
        radius="inner"
        index={index}
      />
      <Skeleton
        width="70%"
        height={statLoadingValueHeights[size]}
        radius="inner"
        index={index + 1}
      />
    </>
  );
}

function StatRoot({
  label,
  value,
  trend,
  start,
  end,
  size = "sm",
  loading = false,
  className,
}: StatProps) {
  return (
    <article
      className={cn(statShellClasses, statShellSizeClasses[size], className)}
      aria-busy={loading || undefined}
      aria-label={loading ? label : undefined}
    >
      <div className={statContentClasses}>
        {loading ? (
          <StatLoadingContent size={size} />
        ) : (
          <>
            <div className={statLabelRowClasses}>
              {start != null ? <div className={statLabelStartClasses}>{start}</div> : null}
              <span className={cn(statLabelClasses, statLabelTextClasses)}>{label}</span>
              {end != null ? <div className={statLabelEndClasses}>{end}</div> : null}
            </div>
            <div className={statValueRowClasses}>
              <span className={statValueSizeClasses[size]}>{value}</span>
              {trend != null ? <StatTrendBadge trend={trend} /> : null}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function StatGroup({
  children,
  "aria-label": ariaLabel,
  columns = 4,
  className,
}: StatGroupProps) {
  return (
    <div
      className={cn(statGroupGridClasses(columns), className)}
      role={ariaLabel != null ? "group" : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

/**
 * At-a-glance metric tile — label, headline value, optional muted trend badge.
 * Compose in **Stat.Group** for insights rows; pair **Card** + **Chart** below for history.
 */
export const Stat = Object.assign(StatRoot, {
  Group: StatGroup,
});
