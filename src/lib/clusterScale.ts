/**
 * Cluster control scale — canonical heights for Chip + IconButton + compact Button
 * in one row (Card header, filter rails, toolbar groups). See ADR-0011.
 *
 * Implementation uses stable Tailwind spacing utilities (7 / 9 / 11 × 4px base).
 * CSS vars in `src/theme/cluster.css` document the same px for apps — do not use
 * `length:var(--cluster-*)` in component class strings (unreliable in dev CSS order).
 */

export const clusterTiers = ["sm", "md", "lg"] as const;

export type ClusterTier = (typeof clusterTiers)[number];

/** Documented pixel heights at default `--spacing` (4px). */
export const clusterHeightPx: Record<ClusterTier, number> = {
  sm: 28,
  md: 36,
  lg: 44,
};

/** Pill / row height — Chip shells, Button min-height in clusters. */
export const clusterHeightClasses: Record<ClusterTier, string> = {
  sm: "h-7 min-h-7",
  md: "h-9 min-h-9",
  lg: "min-h-11",
};

export const clusterMinHeightClasses: Record<ClusterTier, string> = {
  sm: "min-h-7",
  md: "min-h-9",
  lg: "min-h-11",
};

/** Square hit target — IconButton in clusters. */
export const clusterSquareClasses: Record<ClusterTier, string> = {
  sm: "size-7 shrink-0",
  md: "size-9 shrink-0",
  lg: "size-11 shrink-0",
};

/**
 * Canonical pairing — same cluster tier, same pixel height.
 * Component `size` prop names differ; use this table in Storybook and headers.
 */
export const clusterComponentSizeMap = {
  chip: { sm: "sm", md: "md", lg: "lg" },
  iconButton: { sm: "xs", md: "sm", lg: "md" },
  button: { sm: "xs", md: "sm", lg: "md" },
} as const satisfies Record<string, Record<ClusterTier, string>>;

/** IconButton `size` for a cluster tier — e.g. header `Chip sm` → `xs`. */
export function iconButtonSizeForCluster(tier: ClusterTier): "xs" | "sm" | "md" {
  return clusterComponentSizeMap.iconButton[tier];
}

/** Button `size` for a cluster tier — compact actions beside chips. */
export function buttonSizeForCluster(tier: ClusterTier): "xs" | "sm" | "md" {
  return clusterComponentSizeMap.button[tier];
}
