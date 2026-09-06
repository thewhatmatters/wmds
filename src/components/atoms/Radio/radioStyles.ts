import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import {
  inputDisabledLabelClasses,
  inputStatusBannerSurfaceClasses,
  inputStatusShellClasses,
  type InputStatus,
} from "../Input/inputShellStyles";

export const radioSizes = ["sm", "md"] as const;

export type RadioSize = (typeof radioSizes)[number];

/** Row rhythm — aligns with cluster sm (28px) / md (36px) tiers. */
export const radioRowSizeClasses: Record<RadioSize, string> = {
  sm: "min-h-7 gap-2",
  md: "min-h-9 gap-2.5",
};

export const radioHitTargetSizeClasses: Record<RadioSize, string> = {
  sm: "size-7",
  md: "size-9",
};

export const radioCircleSizeClasses: Record<RadioSize, string> = {
  sm: "size-[18px] rounded-full",
  md: "size-[22px] rounded-full",
};

export const radioDotSizeClasses: Record<RadioSize, string> = {
  sm: "size-2",
  md: "size-2.5",
};

export const radioCircleBaseClasses = cn(
  "pointer-events-none flex items-center justify-center border shadow-none",
  "transition-[background-color,border-color]",
  motionTransition("fast"),
);

export const radioCircleUncheckedClasses =
  "border-border-emphasized bg-surface group-hover/radio:border-border-emphasized group-hover/radio:bg-body";

export const radioCircleCheckedClasses =
  "border-primary bg-primary group-hover/radio:border-primary group-hover/radio:bg-primary";

export const radioDotClasses = "rounded-full bg-primary-foreground";

export const radioCircleDisabledClasses = "opacity-50";

export const radioLabelClasses = typographyClass("ui-label");

export const radioDescriptionClasses = cn(typographyClass("caption"), "leading-snug");

export const radioTextColumnClasses = "flex min-w-0 flex-col gap-px";

export const radioLabelWithDescriptionClasses = cn(radioLabelClasses, "leading-tight");

export const radioDescriptionRowClasses: Record<RadioSize, string> = {
  sm: "flex min-w-0 items-start gap-2",
  md: "flex min-w-0 items-start gap-2.5",
};

export const radioHitTargetDescriptionAlignClasses: Record<RadioSize, string> = {
  sm: "mt-px",
  md: "mt-0.5",
};

export const radioRowBaseClasses = "group/radio relative flex w-full cursor-pointer";

export const radioRowLabelOnlyClasses = "items-center";

export const radioRowDisabledClasses = "cursor-not-allowed";

export const radioHiddenInputClasses =
  "peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed";

export const radioFocusRingClasses =
  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-body";

export function radioCircleClassesFor(
  size: RadioSize,
  checked: boolean,
  disabled?: boolean,
  status?: InputStatus,
): string {
  return cn(
    radioCircleBaseClasses,
    radioCircleSizeClasses[size],
    radioFocusRingClasses,
    checked ? radioCircleCheckedClasses : radioCircleUncheckedClasses,
    status != null && inputStatusShellClasses[status],
    disabled && radioCircleDisabledClasses,
  );
}

export function radioLabelClassesFor(disabled?: boolean, withDescription?: boolean): string {
  return cn(
    withDescription ? radioLabelWithDescriptionClasses : radioLabelClasses,
    disabled && inputDisabledLabelClasses,
  );
}

export function radioStatusBannerClassesFor(status: InputStatus): string {
  return cn(
    "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 leading-snug",
    inputStatusBannerSurfaceClasses[status],
  );
}
