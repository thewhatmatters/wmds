import { typographyClass } from "../../../lib/typography";

/** Default plot size — override height/width with layout-only `className`. */
export const chartFrameClasses = "relative h-48 w-full";

/** Fills the frame so Nivo AutoSizer can measure inside flex/grid parents. */
export const chartPlotClasses = "absolute inset-0";

export const chartTooltipClasses =
  "rounded-lg bg-surface px-2.5 py-1.5 shadow-hairline";

export const chartTooltipMetaClasses = typographyClass("caption");

export const chartTooltipValueClasses = typographyClass("ui-label");
