import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { inputDisabledLabelClasses } from "../../atoms/Input/inputShellStyles";

export const fieldOrientations = ["vertical", "horizontal"] as const;

export type FieldOrientation = (typeof fieldOrientations)[number];

/** Vertical label → control → description — matches Input field stack rhythm. */
export const fieldVerticalStackClasses = "flex w-full flex-col gap-1.5";

/** Label beside control — Stripe-style two-column row. */
export const fieldHorizontalStackClasses = "flex w-full items-start gap-4";

/** Left label column — fixed band; control column flexes. */
export const fieldHorizontalLabelColumnClasses =
  "w-[7.5rem] shrink-0 pt-2.5 sm:w-32";

/** Right control column in horizontal layout. */
export const fieldHorizontalControlColumnClasses =
  "flex min-w-0 flex-1 flex-col gap-1.5";

/** Gap between multiple controls under one label. */
export const fieldMultiControlStackClasses = "flex w-full flex-col gap-2";

export const fieldLabelClasses = typographyClass("ui-label");

export const fieldDescriptionClasses = typographyClass("caption");

export function fieldLabelClassesFor(disabled?: boolean): string {
  return cn(fieldLabelClasses, disabled && inputDisabledLabelClasses);
}
