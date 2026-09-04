import type { ReactElement, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { BadgeIcon } from "./BadgeIcon";
import {
  badgeBaseClasses,
  badgeCountSizeClasses,
  badgeIconGapClasses,
  badgeIconOnlySizeClasses,
  badgeLabelSizeClasses,
  badgeSolidClasses,
  badgeSurfaceClasses,
  type BadgeEmphasis,
  type BadgeSize,
  type BadgeVariant,
} from "./badgeStyles";

export type { BadgeEmphasis, BadgeSize, BadgeVariant } from "./badgeStyles";
export { badgeEmphases, badgeVariants } from "./badgeStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type BadgeLayoutClassName = string;

export interface BadgeProps {
  /** Status or category label. Omit for `count` or `iconOnly`. */
  children?: ReactNode;
  /** Semantic color — solid or muted fills. Default: `neutral`. */
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** `solid` (default) or `muted` soft fills for trailing status copy. */
  emphasis?: BadgeEmphasis;
  /** Compact numeric pill — notifications, unread totals. Not combinable with `icon`. */
  count?: number;
  /** Leading Lucide icon — label pattern, or required for `iconOnly`. */
  icon?: ReactElement;
  /** Circular icon-only badge — **TaskRows** leading done/failed. Requires `icon`; no `children`. */
  iconOnly?: boolean;
  /** Layout-only: margin in prose, flex placement. */
  className?: BadgeLayoutClassName;
}

function assertBadgePattern(props: Pick<BadgeProps, "count" | "icon" | "iconOnly" | "children">) {
  if (props.count != null && props.icon) {
    console.warn("[WMDS Badge] `count` is mutually exclusive with `icon`.");
  }

  if (props.iconOnly) {
    if (!props.icon) {
      console.warn("[WMDS Badge] `iconOnly` requires `icon`.");
    }
    if (props.count != null || props.children != null) {
      console.warn("[WMDS Badge] `iconOnly` is mutually exclusive with `children` and `count`.");
    }
    return;
  }

  if (props.children == null && props.count == null) {
    console.warn("[WMDS Badge] Provide `children`, `count`, or `iconOnly` + `icon`.");
  }
}

/**
 * Short status, count, or category label — [Astryx Badge](https://astryx.atmeta.com/components/Badge).
 * Pattern-first: label, count, icon + label, icon-only, muted emphasis.
 */
export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  emphasis = "solid",
  count,
  icon,
  iconOnly = false,
  className,
}: BadgeProps) {
  assertBadgePattern({ count, icon, iconOnly, children });

  const surface = badgeSurfaceClasses(variant, emphasis);
  const isCount = count != null;
  const isIconOnly = iconOnly && icon != null && !isCount;
  const isIconLabel = icon != null && !isCount && !isIconOnly;

  if (isCount) {
    return (
      <span
        className={cn(badgeBaseClasses, surface, badgeCountSizeClasses[size], className)}
        data-variant={variant}
        data-size={size}
        data-emphasis={emphasis}
        data-pattern="count"
      >
        {count}
      </span>
    );
  }

  if (isIconOnly) {
    return (
      <span
        className={cn(badgeBaseClasses, badgeSolidClasses[variant], badgeIconOnlySizeClasses, className)}
        data-variant={variant}
        data-pattern="icon-only"
        aria-hidden
      >
        <BadgeIcon size="sm">{icon}</BadgeIcon>
      </span>
    );
  }

  return (
    <span
      className={cn(
        badgeBaseClasses,
        surface,
        badgeLabelSizeClasses[size],
        isIconLabel && badgeIconGapClasses[size],
        className,
      )}
      data-variant={variant}
      data-size={size}
      data-emphasis={emphasis}
      data-pattern={isIconLabel ? "icon" : "label"}
    >
      {isIconLabel ? <BadgeIcon size={size}>{icon}</BadgeIcon> : null}
      {children}
    </span>
  );
}
