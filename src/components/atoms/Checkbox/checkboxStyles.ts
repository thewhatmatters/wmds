import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import {
  inputDisabledLabelClasses,
  inputStatusBannerSurfaceClasses,
  inputStatusShellClasses,
  type InputStatus,
} from "../Input/inputShellStyles";

export const checkboxSizes = ["sm", "md"] as const;

export type CheckboxSize = (typeof checkboxSizes)[number];

/** Row rhythm — aligns with cluster sm (28px) / md (36px) tiers. */
export const checkboxRowSizeClasses: Record<CheckboxSize, string> = {
  sm: "min-h-7 gap-2",
  md: "min-h-9 gap-2.5",
};

/** Touch target wrapper — centers the visual box ([Astryx CheckboxInput](https://astryx.atmeta.com/components/CheckboxInput)). */
export const checkboxHitTargetSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-7",
  md: "size-9",
};

export const checkboxBoxSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-[18px] rounded",
  md: "size-[22px] rounded-md",
};

export const checkboxCheckIconSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-3",
  md: "size-3.5",
};

export const checkboxIndeterminateBarSizeClasses: Record<CheckboxSize, string> = {
  sm: "h-0.5 w-2.5",
  md: "h-0.5 w-3",
};

export const checkboxBoxBaseClasses = cn(
  "pointer-events-none flex items-center justify-center border shadow-none",
  motionTransition("fast"),
);

export const checkboxBoxUncheckedClasses =
  "border-border-emphasized bg-surface group-hover/checkbox:border-border-emphasized group-hover/checkbox:bg-body";

export const checkboxBoxCheckedClasses =
  "border-primary bg-primary text-on-primary group-hover/checkbox:border-primary group-hover/checkbox:bg-primary";

export const checkboxBoxDisabledClasses = "opacity-50";

export const checkboxLabelClasses = typographyClass("ui-label");

export const checkboxDescriptionClasses = typographyClass("caption");

export const checkboxLabelTextColumnClasses = "flex min-w-0 flex-col gap-0.5";

export const checkboxRowBaseClasses =
  "group/checkbox relative flex w-full cursor-pointer";

/** Single-line label — vertically center with the box ([Astryx CheckboxInput](https://astryx.atmeta.com/components/CheckboxInput)). */
export const checkboxRowLabelOnlyClasses = "items-center";

/** Label + description — top-align; box nudged to label cap via {@link checkboxHitTargetDescriptionAlignClasses}. */
export const checkboxRowWithDescriptionClasses = "items-start";

export const checkboxHitTargetDescriptionAlignClasses: Record<CheckboxSize, string> = {
  sm: "mt-px",
  md: "mt-0.5",
};

export const checkboxRowClasses = cn(checkboxRowBaseClasses, checkboxRowLabelOnlyClasses);

export const checkboxRowDisabledClasses = "cursor-not-allowed";

export const checkboxHiddenInputClasses =
  "peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed";

export const checkboxFocusRingClasses =
  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-body";

export function checkboxBoxClassesFor(
  size: CheckboxSize,
  checked: boolean,
  indeterminate: boolean,
  disabled?: boolean,
  status?: InputStatus,
): string {
  const isOn = checked || indeterminate;

  return cn(
    checkboxBoxBaseClasses,
    checkboxBoxSizeClasses[size],
    checkboxFocusRingClasses,
    isOn ? checkboxBoxCheckedClasses : checkboxBoxUncheckedClasses,
    status != null && inputStatusShellClasses[status],
    disabled && checkboxBoxDisabledClasses,
  );
}

export function checkboxLabelClassesFor(disabled?: boolean): string {
  return cn(checkboxLabelClasses, disabled && inputDisabledLabelClasses);
}

/** Flat status row below the checkbox — no pill overlap band. */
export function checkboxStatusBannerClassesFor(status: InputStatus): string {
  return cn(
    "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 leading-snug",
    inputStatusBannerSurfaceClasses[status],
  );
}
