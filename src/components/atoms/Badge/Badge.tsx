import { useRender } from "@base-ui/react/use-render";
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
  badgeInteractiveClasses,
  badgeInteractiveOutlineClasses,
  badgeLabelSizeClasses,
  badgeMonoClasses,
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
  /**
   * `solid` (default), `muted` soft fills for trailing status copy, or `outline` — a hairline and a
   * transparent fill, for author and category tags.
   */
  emphasis?: BadgeEmphasis;
  /** Mono uppercase label — the same face and tracking as **Button** `mono`. Label patterns only. */
  mono?: boolean;
  /**
   * Compose the badge onto another element (Base UI `render`) — `render={<a href="/blog?topic=guides" />}`
   * makes a tag a link, with a hover underline, the focus ring, and a 44px-tall hit area. Label,
   * icon, and avatar patterns only.
   */
  render?: ReactElement;
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
  /** DOM id — section `aria-labelledby` targets this badge. */
  id?: string;
  /** Layout-only: margin in prose, flex placement. */
  className?: BadgeLayoutClassName;
}

function assertBadgePattern(
  props: Pick<BadgeProps, "count" | "icon" | "avatar" | "iconOnly" | "children" | "render" | "mono">,
) {
  if ((props.render != null || props.mono) && (props.count != null || props.iconOnly)) {
    console.warn("[WMDS Badge] `render` and `mono` apply to label, icon, and avatar badges — not `count` or `iconOnly`.");
  }

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

interface BadgeLabelProps {
  render?: ReactElement;
  id?: string;
  className: string;
  children: ReactNode;
  "data-variant": BadgeVariant;
  "data-size": BadgeSize;
  "data-emphasis": BadgeEmphasis;
  "data-pattern": string;
  "data-mono"?: string;
}

/** Label shell — a `<span>` by default, or badge chrome composed onto `render` (Base UI). */
function BadgeLabel({ render, ...props }: BadgeLabelProps) {
  return useRender({ render, defaultTagName: "span", props });
}

/**
 * Short status, count, or category label — solid, muted, or outline semantic fills.
 * Pattern-first: label, count, icon + label, avatar + label, icon-only, muted and outline emphasis,
 * mono caps, and links (`render`).
 */
export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  emphasis = "solid",
  mono = false,
  render,
  count,
  icon,
  avatar,
  iconOnly = false,
  id,
  className,
}: BadgeProps) {
  assertBadgePattern({ count, icon, avatar, iconOnly, children, render, mono });

  const surface = badgeSurfaceClasses(variant, emphasis);
  const isCount = count != null && avatar == null;
  const isIconOnly = iconOnly && icon != null && !isCount && avatar == null;
  const hasAvatar = avatar != null && !isCount && !isIconOnly;
  const isIconLabel = icon != null && !isCount && !isIconOnly && !hasAvatar;

  if (isCount) {
    return (
      <span
        id={id}
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
        id={id}
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
    <BadgeLabel
      render={render}
      id={id}
      className={cn(
        badgeBaseClasses,
        surface,
        hasAvatar ? badgeAvatarLabelSizeClasses[size] : badgeLabelSizeClasses[size],
        isIconLabel && badgeIconGapClasses[size],
        mono && badgeMonoClasses,
        render != null && badgeInteractiveClasses,
        render != null && emphasis === "outline" && badgeInteractiveOutlineClasses,
        className,
      )}
      data-variant={variant}
      data-size={size}
      data-emphasis={emphasis}
      data-pattern={hasAvatar ? "avatar" : isIconLabel ? "icon" : "label"}
      data-mono={mono ? "" : undefined}
    >
      {hasAvatar && avatar != null ? (
        <Avatar name={avatar.alt} src={avatar.src} size={badgeAvatarSize[size]} />
      ) : null}
      {isIconLabel ? <BadgeIcon size={size}>{icon}</BadgeIcon> : null}
      {children}
    </BadgeLabel>
  );
}
