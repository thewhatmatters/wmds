import type { ReactElement, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { Avatar, type AvatarSize } from "../Avatar/Avatar";
import { BadgeIcon } from "./BadgeIcon";
import {
  badgeAvatarLabelSizeClasses,
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

/** Leading round image. `alt` is the Avatar name; pass `""` when the badge label already speaks the word. */
export interface BadgeAvatar {
  src: string;
  alt: string;
}

/**
 * Avatar size for each badge size — the circle matches the pill height.
 * sm → 20px (`xsm`), md → 24px (`sm`).
 */
export const badgeAvatarSize: Record<BadgeSize, AvatarSize> = {
  sm: "xsm",
  md: "sm",
};

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
  /** Leading Lucide icon — label pattern, or required for `iconOnly`. Not with `avatar`. */
  icon?: ReactElement;
  /**
   * Leading round image — renders **Avatar** at `badgeAvatarSize` for this badge's `size`.
   * Mutually exclusive with `icon`, `iconOnly`, and `count`.
   */
  avatar?: BadgeAvatar;
  /** Circular icon-only badge — **TaskRows** leading done/failed. Requires `icon`; no `children`. */
  iconOnly?: boolean;
  /** Layout-only: margin in prose, flex placement. */
  className?: BadgeLayoutClassName;
}

function assertBadgePattern(
  props: Pick<BadgeProps, "count" | "icon" | "avatar" | "iconOnly" | "children">,
) {
  if (props.avatar && (props.icon || props.iconOnly || props.count != null)) {
    console.warn("[WMDS Badge] `avatar` is mutually exclusive with `icon`, `iconOnly`, and `count`.");
  }

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
 * Short status, count, or category label — solid semantic fills.
 * Pattern-first: label, count, icon + label, avatar + label, icon-only, muted emphasis.
 */
export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  emphasis = "solid",
  count,
  icon,
  avatar,
  iconOnly = false,
  className,
}: BadgeProps) {
  assertBadgePattern({ count, icon, avatar, iconOnly, children });

  const surface = badgeSurfaceClasses(variant, emphasis);
  const isCount = count != null && avatar == null;
  const isIconOnly = iconOnly && icon != null && !isCount && avatar == null;
  const hasAvatar = avatar != null && !isCount && !isIconOnly;
  const isIconLabel = icon != null && !isCount && !isIconOnly && !hasAvatar;

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
        hasAvatar ? badgeAvatarLabelSizeClasses[size] : badgeLabelSizeClasses[size],
        isIconLabel && badgeIconGapClasses[size],
        className,
      )}
      data-variant={variant}
      data-size={size}
      data-emphasis={emphasis}
      data-pattern={hasAvatar ? "avatar" : isIconLabel ? "icon" : "label"}
    >
      {hasAvatar && avatar != null ? (
        <Avatar name={avatar.alt} src={avatar.src} size={badgeAvatarSize[size]} />
      ) : null}
      {isIconLabel ? <BadgeIcon size={size}>{icon}</BadgeIcon> : null}
      {children}
    </span>
  );
}
