import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const sectionCaptionElements = ["h2", "h3", "h4", "p"] as const;

export type SectionCaptionElement = (typeof sectionCaptionElements)[number];

/** The caption row — the label, an optional action at its end, and the rule under it. */
export const sectionCaptionRowClasses = "flex min-h-4 items-center justify-between gap-3";

export const sectionCaptionRuledClasses = "border-b border-border-emphasized pb-3";

export const sectionCaptionLabelClasses = cn("m-0 min-w-0", typographyClass("eyebrow"));

/** The "/" marker — decoration; screen readers skip it. */
export const sectionCaptionMarkerClasses = "select-none";

/** Holds a 28px control (**Button** `size="xs"`) without growing the 16px caption line. */
export const sectionCaptionEndClasses = "-my-1.5 flex shrink-0 items-center gap-2";
