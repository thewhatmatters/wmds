import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";
import type { ClusterTier } from "../../../lib/clusterScale";

export const avatarSizes = ["xsm", "sm", "md", "lg", "xl"] as const;

export type AvatarSize = (typeof avatarSizes)[number];

/** WMDS avatar scale — media tiers (not cluster hit targets). */
export const avatarSizePx: Record<AvatarSize, number> = {
  xsm: 20,
  sm: 24,
  md: 36,
  lg: 48,
  xl: 128,
};

export const avatarShellSizeClasses: Record<AvatarSize, string> = {
  xsm: "size-5",
  sm: "size-6",
  md: "size-9",
  lg: "size-12",
  xl: "size-32",
};

export const avatarRootClasses = "relative inline-flex shrink-0 overflow-visible";

export const avatarImageClasses = "size-full rounded-full object-cover";

export const avatarFallbackShellClasses = cn(
  "flex size-full items-center justify-center rounded-full bg-body ring-1 ring-border",
);

export const avatarInitialsClasses: Record<AvatarSize, string> = {
  xsm: cn(typographyClass("caption"), "font-medium uppercase leading-none text-fg"),
  sm: cn(typographyClass("caption"), "font-medium uppercase leading-none text-fg"),
  md: cn(typographyClass("ui-label"), "font-medium uppercase leading-none text-fg"),
  lg: cn(typographyClass("body"), "font-medium uppercase leading-none text-fg"),
  xl: cn(typographyClass("subheading"), "font-semibold uppercase leading-none text-fg"),
};

export const avatarIconClasses: Record<AvatarSize, string> = {
  xsm: "size-2.5 shrink-0 stroke-current text-muted",
  sm: "size-3 shrink-0 stroke-current text-muted",
  md: "size-4 shrink-0 stroke-current text-muted",
  lg: "size-6 shrink-0 stroke-current text-muted",
  xl: "size-12 shrink-0 stroke-current text-muted",
};

/**
 * Presence dot center on the circle rim — ~50° from east (5 o'clock).
 * Size-independent; 45° overlaps trailing initials on `sm`.
 */
export const avatarPresenceAnchorClasses = cn(
  "absolute -translate-x-1/2 -translate-y-1/2",
  "left-[calc(50%+50%*cos(50deg))] top-[calc(50%+50%*sin(50deg))]",
);

export const avatarPresenceRingClasses = "rounded-full ring-2 ring-surface";

/** Cluster row pairing — md cluster → md avatar (36px). */
export const avatarSizeForClusterMap: Record<ClusterTier, AvatarSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

export function avatarSizeForCluster(tier: ClusterTier): AvatarSize {
  return avatarSizeForClusterMap[tier];
}

/** Derive 1–2 uppercase initials from a display name. */
export function avatarInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}
