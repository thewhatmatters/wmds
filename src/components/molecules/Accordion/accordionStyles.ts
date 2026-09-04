import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import {
  capsuleRowOpenRadiusClass,
  capsuleRowRadiusClass,
  capsuleStackGapClass,
} from "../../../lib/insetWell";

export const accordionVariants = ["list", "capsule", "plain"] as const;

export type AccordionVariant = (typeof accordionVariants)[number];

export const accordionRootListClasses =
  "flex w-full flex-col overflow-hidden rounded-lg bg-surface font-sans text-fg shadow-raised";

/** Nested in **Card.Body** — parent owns surface; slot is square. */
export const accordionRootListInsetClasses = "flex w-full flex-col font-sans text-fg";

export const accordionRootCapsuleClasses =
  `flex w-full min-h-0 flex-col ${capsuleStackGapClass} font-sans text-fg`;

export const accordionRootPlainClasses = "flex w-full flex-col font-sans text-fg";

export const accordionItemListClasses =
  "overflow-hidden border-b border-border last:border-b-0 " + motionTransition("fast");

export const accordionItemPlainClasses =
  "overflow-hidden border-b border-border last:border-b-0 " + motionTransition("fast");

/** Hairline + elevation via `shadow-raised` only — do not add `border`. */
export const accordionItemCapsuleClasses =
  "overflow-hidden bg-surface shadow-raised transition-[border-radius,background-color] duration-300 ease-standard";

/** Collapsed — full pill (h-11 row → R = 22px). */
export const accordionItemCapsuleClosedClasses = capsuleRowRadiusClass;

/** Expanded — 14px uniform radius. */
export const accordionItemCapsuleOpenClasses = capsuleRowOpenRadiusClass;

/** Horizontal inset — matches **Card** section padding (`px-4`). */
export const accordionInsetXClasses = "px-4";

export const accordionTriggerBaseClasses =
  "flex h-11 w-full items-center gap-2.5 text-left " + accordionInsetXClasses;

/** Expandable header — pointer + hover fill on the full trigger band. */
export const accordionTriggerInteractiveClasses =
  "cursor-pointer hover:bg-ghost-hover active:bg-ghost-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset " +
  motionTransition("fast");

export const accordionLeadingSlotClasses = "flex size-6 shrink-0 items-center justify-center";

/** FAQ / settings — regular body weight (hierarchy via chevron + indent, not medium labels). */
export const accordionLabelPlainClasses = `${typographyClass("body")} min-w-0 flex-1 truncate`;

/** List / capsule / **TaskRows** — compact primary line in h-11 row. */
export const accordionLabelRowClasses = `${typographyClass("ui-label")} min-w-0 flex-1 truncate text-[0.8125rem]`;

export const accordionTrailingClusterClasses = "flex shrink-0 items-center gap-2";

/** Chevron column — decorative inside the disclosure button. */
export const accordionChevronSlotClasses =
  "-ml-2 flex size-7 shrink-0 items-center justify-center rounded-full text-muted";

export const accordionChevronRotateClasses =
  "inline-flex " + motionTransition("medium") + " transition-transform";

export const accordionChevronOpenClasses = "rotate-180";

export const accordionPanelInnerClasses = "overflow-hidden";

/** Panel answers — body scale + secondary color (`text-muted`) below primary headers. */
export const accordionPanelContentClasses =
  "type-body text-muted tracking-normal pb-4 pt-0 " + accordionInsetXClasses;
