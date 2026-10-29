import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { inputDisabledLabelClasses } from "../../atoms/Input/inputShellStyles";

export const fieldOrientations = ["vertical", "horizontal"] as const;

export type FieldOrientation = (typeof fieldOrientations)[number];

/** Vertical label → control → description — matches Input field stack rhythm. */
export const fieldVerticalStackClasses = "flex w-full flex-col gap-1.5";

/**
 * Label beside control — Stripe-style two-column row, from `lg` (1024) only. Below that it stacks like
 * the vertical Field, since a side label squeezes the control on phones and tablets (Form layout L8).
 */
export const fieldHorizontalStackClasses = "flex w-full flex-col gap-1.5 lg:flex-row lg:items-start lg:gap-4";

/** Left label column from `lg` — fixed band; control column flexes. Stacked above the control below `lg`. */
export const fieldHorizontalLabelColumnClasses = "lg:w-32 lg:shrink-0 lg:pt-2.5";

/** Right control column in horizontal layout (full width while stacked). */
export const fieldHorizontalControlColumnClasses =
  "flex w-full min-w-0 flex-col gap-1.5 lg:flex-1";

/** Gap between multiple controls under one label. */
export const fieldMultiControlStackClasses = "flex w-full flex-col gap-2";

export const fieldLabelClasses = typographyClass("ui-label");

export const fieldDescriptionClasses = typographyClass("caption");

export function fieldLabelClassesFor(disabled?: boolean): string {
  return cn(fieldLabelClasses, disabled && inputDisabledLabelClasses);
}
