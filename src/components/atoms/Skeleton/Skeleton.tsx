import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { readMotionDurationSeconds } from "../../../lib/motion";
import {
  skeletonDelaySeconds,
  skeletonDimensionStyle,
  skeletonHostClasses,
  skeletonRadii,
  skeletonShimmerBandClasses,
  skeletonShimmerRepeatDelayS,
  type SkeletonRadius,
} from "./skeletonStyles";

export type { SkeletonRadius } from "./skeletonStyles";
export { skeletonRadii };

/** Layout-only — width/height in grids; not for color overrides. */
export type SkeletonLayoutClassName = string;

export interface SkeletonProps {
  /** Block width — number (px) or CSS length. Default `100%`. */
  width?: number | string;
  /** Block height — number (px) or CSS length. Default `100%`. */
  height?: number | string;
  /** Corner radius token — default `container` (12px). */
  radius?: SkeletonRadius;
  /**
   * Stagger index for sequential placeholders (0, 1, 2…).
   * Offsets shimmer delay — wave across skeleton screens.
   */
  index?: number;
  className?: SkeletonLayoutClassName;
  style?: CSSProperties;
}

/**
 * Loading placeholder block — compose into skeleton screens (Card, chart wells, KPI rows).
 * Shimmer sweep via Motion — [skeleton shimmer example](https://motion.dev/examples/react-skeleton-shimmer).
 * Pair with `aria-busy` on the owning region; this shape is decorative (`aria-hidden`).
 */
export function Skeleton({
  width = "100%",
  height = "100%",
  radius = "container",
  index = 0,
  className,
  style,
}: SkeletonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={skeletonHostClasses(radius, className)}
      style={{
        ...skeletonDimensionStyle(width, height),
        ...style,
      }}
      aria-hidden
    >
      {!shouldReduceMotion ? (
        <motion.span
          aria-hidden
          className={skeletonShimmerBandClasses}
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: readMotionDurationSeconds("slow"),
            ease: "linear",
            repeat: Infinity,
            repeatDelay: skeletonShimmerRepeatDelayS,
            delay: skeletonDelaySeconds(index),
          }}
        />
      ) : null}
    </span>
  );
}
