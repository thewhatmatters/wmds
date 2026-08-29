import type { ReactElement, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { BadgeIcon } from "./BadgeIcon";
import {
  badgeBaseClasses,
  badgeCountSizeClasses,
  badgeIconGapClasses,
  badgeLabelSizeClasses,
  badgeSolidClasses,
  type BadgeSize,
  type BadgeVariant,
} from "./badgeStyles";

export type { BadgeSize, BadgeVariant } from "./badgeStyles";
export { badgeVariants } from "./badgeStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type BadgeLayoutClassName = string;

export interface BadgeProps {
  /** Status or category label. Omit when using `count`. */
  children?: ReactNode;
  /** Semantic color — solid fills for status; neutral for categories. Default: `neutral`. */
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Compact numeric pill — notifications, unread totals. Not combinable with `icon`. */
  count?: number;
  /** Leading Lucide icon — `import { … } from "lucide-react"`. Not combinable with `count`. */
  icon?: ReactElement;
  /** Layout-only: margin in prose, flex placement. */
  className?: BadgeLayoutClassName;
}

function assertBadgePattern(props: Pick<BadgeProps, "count" | "icon" | "children">) {
  if (props.count != null && props.icon) {
    console.warn("[WMDS Badge] `count` is mutually exclusive with `icon`.");
  }

  if (props.children == null && props.count == null) {
    console.warn("[WMDS Badge] Provide `children` or `count`.");
  }
}

/**
 * Short status, count, or category label — [Astryx Badge](https://astryx.atmeta.com/components/Badge).
 * Pattern-first: label, count, or icon — no generic slots.
 */
export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  count,
  icon,
  className,
}: BadgeProps) {
  assertBadgePattern({ count, icon, children });

  const surface = badgeSolidClasses[variant];
  const isCount = count != null;
  const isIcon = icon != null && !isCount;

  if (isCount) {
    return (
      <span
        className={cn(badgeBaseClasses, surface, badgeCountSizeClasses[size], className)}
        data-variant={variant}
        data-size={size}
        data-pattern="count"
      >
        {count}
      </span>
    );
  }

  return (
    <span
      className={cn(
        badgeBaseClasses,
        surface,
        badgeLabelSizeClasses[size],
        isIcon && badgeIconGapClasses[size],
        className,
      )}
      data-variant={variant}
      data-size={size}
      data-pattern={isIcon ? "icon" : "label"}
    >
      {isIcon ? <BadgeIcon size={size}>{icon}</BadgeIcon> : null}
      {children}
    </span>
  );
}
