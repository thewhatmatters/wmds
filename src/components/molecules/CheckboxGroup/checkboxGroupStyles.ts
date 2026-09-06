import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { inputDisabledLabelClasses } from "../../atoms/Input/inputShellStyles";
import { checkboxSizes, type CheckboxSize } from "../../atoms/Checkbox/checkboxStyles";

export { checkboxSizes, type CheckboxSize };

export const checkboxGroupOrientations = ["vertical", "horizontal"] as const;

export type CheckboxGroupOrientation = (typeof checkboxGroupOrientations)[number];

export const checkboxGroupFieldStackClasses = "flex w-full flex-col";

/** Legend → first item — looser than title/subtitle rhythm inside the header. */
export const checkboxGroupLegendLabelOnlySpacingClasses = "mb-2";

export const checkboxGroupLegendWithDescriptionSpacingClasses = "pb-px";

export const checkboxGroupDescriptionSpacingClasses = "mb-2";

export const checkboxGroupMessageTopSpacingClasses = "mt-1.5";

export const checkboxGroupLabelClasses = typographyClass("ui-label");

export const checkboxGroupDescriptionClasses = cn(typographyClass("caption"), "leading-snug");

export const checkboxGroupItemsClasses: Record<CheckboxGroupOrientation, string> = {
  vertical: "flex flex-col gap-2",
  horizontal: "flex flex-row flex-wrap gap-x-5 gap-y-2",
};

export function checkboxGroupLabelClassesFor(disabled?: boolean): string {
  return cn(checkboxGroupLabelClasses, disabled && inputDisabledLabelClasses);
}

export { checkboxStatusBannerClassesFor as checkboxGroupStatusBannerClassesFor } from "../../atoms/Checkbox/checkboxStyles";
