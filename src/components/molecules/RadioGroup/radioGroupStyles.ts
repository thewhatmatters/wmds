import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { inputDisabledLabelClasses } from "../../atoms/Input/inputShellStyles";
import { radioSizes, type RadioSize } from "../../atoms/Radio/radioStyles";

export { radioSizes, type RadioSize };

export const radioGroupOrientations = ["vertical", "horizontal"] as const;

export type RadioGroupOrientation = (typeof radioGroupOrientations)[number];

export const radioGroupFieldStackClasses = "flex w-full flex-col gap-1.5";

export const radioGroupLabelClasses = typographyClass("ui-label");

export const radioGroupDescriptionClasses = cn(typographyClass("caption"), "leading-snug");

export const radioGroupItemsClasses: Record<RadioGroupOrientation, string> = {
  vertical: "flex flex-col gap-2",
  horizontal: "flex flex-row flex-wrap gap-x-5 gap-y-2",
};

export function radioGroupLabelClassesFor(disabled?: boolean): string {
  return cn(radioGroupLabelClasses, disabled && inputDisabledLabelClasses);
}

export { radioStatusBannerClassesFor as radioGroupStatusBannerClassesFor } from "../../atoms/Radio/radioStyles";
