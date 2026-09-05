/** Mount enter on **Chart.SegmentedBar** — spring fill when data replaces loading. */
export type ChartSegmentedBarAnimate = "initial" | "none";

/**
 * Spring fill — [Motion loading progress bar](https://motion.dev/examples/react-loading-progress-bar).
 * `useSpring` smooths discrete segment steps on resolve.
 */
export const chartSegmentedBarSpringConfig = {
  stiffness: 100,
  damping: 18,
  restDelta: 0.001,
};
