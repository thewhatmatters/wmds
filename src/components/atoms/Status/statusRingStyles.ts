import { typographyClass } from "../../../lib/typography";

/** Fixed diameter — pairs with **Accordion** / **TaskRows** leading slot (`size-6`). */
export const statusRingSizePx = 24;

export const statusRingStrokePx = 2;

/** ~28% visible arc when `active` — matches task-progress ring reference. */
export const statusRingArcVisibleRatio = 0.28;

export const statusRingShellClasses =
  "relative inline-flex shrink-0 items-center justify-center";

export const statusRingSvgClasses = "absolute inset-0";

export const statusRingSvgActiveClasses = "animate-spin";

export const statusRingTrackClasses = "stroke-border";

export const statusRingArcClasses = "stroke-muted";

export const statusRingStepClasses = `${typographyClass("caption")} relative font-semibold tabular-nums text-fg text-[0.65625rem]`;
