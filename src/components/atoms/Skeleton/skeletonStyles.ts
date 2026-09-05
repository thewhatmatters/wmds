import { cn } from "../../../lib/cn";

/** Astryx-aligned radius scale — [Skeleton](https://astryx.atmeta.com/components/Skeleton). */
export const skeletonRadii = ["none", "inner", "element", "container", "full"] as const;

export type SkeletonRadius = (typeof skeletonRadii)[number];

export const skeletonRadiusClasses: Record<SkeletonRadius, string> = {
  none: "rounded-none",
  inner: "rounded-sm",
  element: "rounded-lg",
  container: "rounded-xl",
  full: "rounded-full",
};

/** Resting block — pairs with Motion shimmer overlay in {@link Skeleton}. */
export const skeletonRootClasses = "block shrink-0 bg-skeleton wmds-skeleton-host";

/** Shimmer host — clips the sweeping highlight ([Motion skeleton shimmer](https://motion.dev/examples/react-skeleton-shimmer)). */
export const skeletonShimmerHostClasses = "relative overflow-hidden";

/** Horizontal highlight band — theme-aware via semantic surface mix. */
export const skeletonShimmerBandClasses =
  "pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-background-surface)_55%,var(--color-skeleton)_45%)] to-transparent";

/** Initial delay before shimmer starts (ms) — avoids flash on fast loads. */
export const skeletonDelayMs = 1000;

/** Stagger increment per `index` prop (ms). */
export const skeletonStaggerMs = 100;

/** Pause between shimmer sweeps (seconds). */
export const skeletonShimmerRepeatDelayS = 0.5;

export function skeletonDelaySeconds(index: number): number {
  return (skeletonDelayMs + skeletonStaggerMs * index) / 1000;
}

export function skeletonDimensionStyle(
  width: number | string,
  height: number | string,
): { width: number | string; height: number | string } {
  return { width, height };
}

export function skeletonHostClasses(radius: SkeletonRadius, className?: string): string {
  return cn(
    skeletonRootClasses,
    skeletonShimmerHostClasses,
    skeletonRadiusClasses[radius],
    className,
  );
}
