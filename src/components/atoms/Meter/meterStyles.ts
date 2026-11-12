export const meterSizes = ["xs", "sm", "md"] as const;

export type MeterSize = (typeof meterSizes)[number];

export const meterTones = ["primary", "neutral"] as const;

export type MeterTone = (typeof meterTones)[number];

/**
 * Track: a soft mix of the text colour, so it reads on any surface (as in **Progress**).
 * A brand kit may set `--meter-track`.
 */
export const meterTrackClasses =
  "relative block w-full min-w-8 overflow-hidden rounded-full bg-[var(--meter-track,color-mix(in_srgb,var(--color-text-primary)_10%,transparent))]";

/** `xs` is a 2px hairline for table cells and dense rows. */
export const meterSizeClasses: Record<MeterSize, string> = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
};

export const meterFillClasses =
  "absolute inset-y-0 start-0 block rounded-full transition-[width] duration-medium ease-standard motion-reduce:transition-none";

/** A brand kit may set `--meter-fill` (a colour or a gradient) for every meter in its scope. */
export const meterFillToneClasses: Record<MeterTone, string> = {
  primary: "[background:var(--meter-fill,var(--color-primary))]",
  neutral: "[background:var(--meter-fill,var(--color-text-primary))]",
};
