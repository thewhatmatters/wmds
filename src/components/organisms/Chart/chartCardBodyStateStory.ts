/** Storybook-only — Card body phase controls (not a Chart prop). */
export const chartCardBodyStates = ["skeleton", "retrieving", "resolved"] as const;
export type ChartCardBodyState = (typeof chartCardBodyStates)[number];

export const chartCardBodyStateArgType = {
  control: "select" as const,
  options: [...chartCardBodyStates],
  description:
    "Preview loading phases — skeleton, retrieving spinner, or resolved marks. Replays enter animation when switching to resolved.",
};

export const chartCardBodyStateControlsParameters = {
  controls: {
    include: ["bodyState"],
    hideNoControlsWarning: true,
  },
};

export const chartCardBodyStateLabels: Record<ChartCardBodyState, string> = {
  skeleton: "Initial load",
  retrieving: "Retrieving data",
  resolved: "Resolved",
};

export const chartCardBodyStateHints: Record<ChartCardBodyState, string> = {
  skeleton: "Skeleton shimmer (Motion Dev)",
  retrieving: "Chart.Loading spinner",
  resolved: "Resolved",
};

export function initialChartCardBodyState(args: { bodyState?: ChartCardBodyState }): ChartCardBodyState {
  return (args.bodyState ?? "resolved") as ChartCardBodyState;
}
