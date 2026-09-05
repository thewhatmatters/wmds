import type { Transition, Variants } from "motion/react";
import { motionTransitionProp, readMotionDurationSeconds } from "../../../lib/motion";

/** Enter animation on first mount — not for period/filter updates. */
export type ChartCartesianAnimate = "initial" | "none";

/** Optional container fade while marks draw — subtle; marks own the Motion Dev-style reveal. */
export const chartCartesianEnterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const chartCartesianEnterTransition: Transition = motionTransitionProp("fast");

/** Stroke draw — Motion pathLength pattern (examples.motion.dev path drawing). */
export const chartCartesianLineEnterTransition: Transition = {
  pathLength: {
    duration: readMotionDurationSeconds("slow"),
    ease: "linear",
  },
};

/** Area fill trails the stroke slightly. */
export const chartCartesianAreaEnterTransition: Transition = {
  opacity: {
    ...motionTransitionProp("medium"),
    delay: readMotionDurationSeconds("slow") * 0.35,
  },
};
