import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

/** Frame shapes. The frame holds its box before the picture arrives, so nothing shifts on load. */
export const mediaRatios = ["1/1", "4/5", "3/4", "4/3", "3/2", "16/9", "21/9"] as const;

export type MediaRatio = (typeof mediaRatios)[number];

/** Literal class per ratio — Tailwind only generates classes it can read in full. */
export const mediaRatioClasses: Record<MediaRatio, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-4/5",
  "3/4": "aspect-3/4",
  "4/3": "aspect-4/3",
  "3/2": "aspect-3/2",
  "16/9": "aspect-video",
  "21/9": "aspect-21/9",
};

export const mediaFits = ["cover", "contain"] as const;

export type MediaFit = (typeof mediaFits)[number];

export const mediaFitClasses: Record<MediaFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

/** Steps of the surface radius knob (`--radius-surface`); `sm` is a **Card**'s corner. */
export const mediaRadii = ["none", "sm", "md", "lg"] as const;

export type MediaRadius = (typeof mediaRadii)[number];

export const mediaRadiusClasses: Record<MediaRadius, string> = {
  none: "rounded-none",
  sm: "rounded-[var(--radius-surface-sm)]",
  md: "rounded-[var(--radius-surface-md)]",
  lg: "rounded-[var(--radius-surface)]",
};

/** Named crop points: the part of the picture that stays in the frame when it is cropped. */
export const mediaFocuses = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export type MediaFocusName = (typeof mediaFocuses)[number];

/** A crop point as percentages of the picture: `{ x: 50, y: 20 }` keeps a face near the top. */
export interface MediaFocusPoint {
  x: number;
  y: number;
}

export type MediaFocus = MediaFocusName | MediaFocusPoint;

const mediaFocusPositions: Record<MediaFocusName, string> = {
  center: "50% 50%",
  top: "50% 0%",
  bottom: "50% 100%",
  left: "0% 50%",
  right: "100% 50%",
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
};

const clampPercent = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50);

/** CSS `object-position` for a crop point. Numbers outside 0–100 are held to the picture's edge. */
export function mediaFocusPosition(focus: MediaFocus): string {
  if (typeof focus === "string") return mediaFocusPositions[focus] ?? mediaFocusPositions.center;
  return `${clampPercent(focus.x)}% ${clampPercent(focus.y)}%`;
}

/** Frame — a tinted well behind the picture; clips it to the radius. */
export const mediaFrameClasses = "relative isolate block w-full overflow-hidden bg-skeleton";

/** The picture fills the frame. */
export const mediaImageClasses = "absolute inset-0 block size-full";

/** Missing or failed picture — a quiet glyph centred in the tinted well. */
export const mediaFallbackClasses =
  "absolute inset-0 flex items-center justify-center text-muted [&>svg]:size-8 [&>svg]:shrink-0 [&>svg]:stroke-current";

export const mediaFigureClasses = "m-0 flex w-full min-w-0 flex-col gap-2";

/** Caption at the start, tag at the end; the tag drops under a long caption. */
export const mediaLegendClasses = "flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1";

export const mediaCaptionClasses = cn(typographyClass("caption"), "min-w-0 text-muted");

/** The visible source label ("Stock photo") — small mono capitals. */
export const mediaTagClasses = cn(typographyClass("eyebrow"), "min-w-0 text-muted");
