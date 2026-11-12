import { useDelayedLoading } from "../../../lib/useDelayedLoading";
import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
import { cn } from "../../../lib/cn";
import {
  statContentClasses,
  statContentLgClasses,
  statContextClasses,
  statGroupGridClasses,
  statIconButtonSize,
  statIconTileClasses,
  statIconTileSizeClasses,
  statLabelClasses,
  statLabelLgClasses,
  statLoadingContextHeight,
  statLoadingLabelHeights,
  statLoadingValueHeights,
  statShellClasses,
  statShellSizeClasses,
  statShellVariantClasses,
  statLabelEndClasses,
  statLabelRowClasses,
  statLabelStartClasses,
  statLabelTextClasses,
  statLabelTrailClasses,
  statDetailClasses,
  statTrendBadgeVariant,
  statUnavailableClasses,
  statValueRowClasses,
  statValueSizeClasses,
  type StatGroupColumns,
  type StatSize,
  type StatTrendDirection,
  type StatVariant,
} from "./statStyles";

export type {
  StatGroupColumns,
  StatSize,
  StatTrendDirection,
  StatVariant,
} from "./statStyles";
export {
  statGroupColumns,
  statGroupGridClasses,
  statSizes,
  statTrendDirections,
  statVariants,
} from "./statStyles";

/** Layout-only — grid width, margin; not for re-theming the tile shell. */
export type StatLayoutClassName = string;

export interface StatTrend {
  /** Trend copy — e.g. `+2.1%` or `-0.8%`. */
  value: string;
  /** `up` / `down` tint the badge. `neutral` and `flat` stay muted. */
  direction?: StatTrendDirection;
  /** Optional tooltip on the trend badge. Visible "vs" copy belongs on `context`. */
  label?: string;
}

/** Replaces the figure when the metric source is not wired. */
export interface StatUnavailable {
  /** Stand-in for the figure. Default `Not connected`. */
  label?: string;
  /** Why the figure is missing — visible under the stand-in. */
  reason: string;
}

/**
 * Other attributes (`id`, `data-*`, `aria-*`) land on the root, so a page can anchor, test or
 * choreograph a figure without a wrapper.
 */
export interface StatProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className"> {
  /** Metric name — e.g. Followers, ER, Reach. */
  label: string;
  /** Headline figure — pre-formatted string or number. */
  value: ReactNode;
  /** Compact delta — **Badge** `emphasis="muted"` in the value row. */
  trend?: StatTrend;
  /**
   * Visible secondary line under the figure — e.g. `vs $14,850` or `of $1M goal`.
   * Tabular figures. Hidden while `unavailable` is set (the reason takes this line).
   */
  context?: ReactNode;
  /**
   * One tabular line under the figure — for example "3 new" or "vs last scan".
   * Hidden while `loading` or `unavailable`.
   */
  detail?: ReactNode;
  /** Leading tile — pass a Lucide glyph. Composed with **ButtonIcon**. */
  icon?: ReactNode;
  /** Label-row action — pass **Button** `size="sm"` (e.g. View details). */
  action?: ReactNode;
  /** Replaces the figure and hides `trend`, `context`, and `detail` when the source is not wired. */
  unavailable?: StatUnavailable;
  /** Leading slot — inline with the label row, after `icon`. */
  start?: ReactNode;
  /** Trailing slot — inline with the label row, before `action`. */
  end?: ReactNode;
  size?: StatSize;
  /**
   * The frame. `tile` (default): the bordered metric tile. `plain`: the figure alone, when the
   * surface around it is the frame (a card, a band, a picture). `ruled`: a hairline above, for
   * editorial figure rows.
   */
  variant?: StatVariant;
  /** Skeleton label + value — sets `aria-busy` on the tile. */
  loading?: boolean;
  className?: StatLayoutClassName;
}

/** Other attributes (`id`, `data-*`) land on the grid. */
export interface StatGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> {
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
      {size === "lg" ? (
        <Skeleton width="40%" height={statLoadingContextHeight} radius="inner" index={index + 2} />
      ) : null}
    </>
  );
}

function StatRoot({
  label,
  value,
  trend,
  context,
  detail,
  icon,
  action,
  unavailable,
  start,
  end,
  size = "sm",
  variant = "tile",
  loading = false,
  className,
  "aria-label": ariaLabel,
  ...props
}: StatProps) {
  const skeletonShown = useDelayedLoading(loading);
  const trail = end != null || action != null;

  return (
    <article
      {...props}
      className={cn(statShellClasses, statShellVariantClasses[variant], statShellSizeClasses[variant][size], className)}
      data-variant={variant}
      aria-busy={loading || undefined}
      aria-label={loading ? label : ariaLabel}
    >
      <div className={cn(statContentClasses, size === "lg" && statContentLgClasses)}>
        {loading ? (
          // Loading states Y7: the skeleton keeps its room at once, and shows after 400ms.
          <div className={cn("transition-opacity", skeletonShown ? "opacity-100" : "opacity-0")}>
            <StatLoadingContent size={size} />
          </div>
        ) : (
          <>
            <div className={statLabelRowClasses}>
              {icon != null ? (
                <span className={cn(statIconTileClasses, statIconTileSizeClasses[size])}>
                  <ButtonIcon size={statIconButtonSize[size]}>{icon}</ButtonIcon>
                </span>
              ) : null}
              {start != null ? <div className={statLabelStartClasses}>{start}</div> : null}
              <span className={size === "lg" ? statLabelLgClasses : cn(statLabelClasses, statLabelTextClasses)}>
                {label}
              </span>
              {trail ? (
                <div className={action != null ? statLabelTrailClasses : statLabelEndClasses}>
                  {end}
                  {action}
                </div>
              ) : null}
            </div>
            {unavailable != null ? (
              <>
                <p className={statUnavailableClasses}>{unavailable.label ?? "Not connected"}</p>
                <p className={statContextClasses}>{unavailable.reason}</p>
              </>
            ) : (
              <>
                <div className={statValueRowClasses}>
                  <span className={statValueSizeClasses[size]}>{value}</span>
                  {trend != null ? <StatTrendBadge trend={trend} /> : null}
                </div>
                {context != null ? <p className={statContextClasses}>{context}</p> : null}
                {detail != null ? <p className={statDetailClasses}>{detail}</p> : null}
              </>
            )}
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
  ...props
}: StatGroupProps) {
  return (
    <div
      {...props}
      className={cn(statGroupGridClasses(columns), className)}
      role={ariaLabel != null ? "group" : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

/**
 * At-a-glance metric — label, headline value, optional muted trend badge. `variant` picks the
 * frame: the bordered `tile` (default), `plain` (the figure alone) or `ruled` (a hairline above).
 * `size="lg"` is the hero figure (`type-display-3`, tabular). `context` is the visible
 * "vs" line. `detail` is one tabular line under the figure. Compose in **Stat.Group**
 * for insights rows; pair **Card** + **Chart** below for history.
 */
export const Stat = Object.assign(StatRoot, {
  Group: StatGroup,
});
