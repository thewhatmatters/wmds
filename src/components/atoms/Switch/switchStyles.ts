import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import {
  inputDisabledLabelClasses,
  inputStatusBannerSurfaceClasses,
  inputStatusShellClasses,
  type InputStatus,
} from "../Input/inputShellStyles";

export const switchSizes = ["sm", "md"] as const;

export type SwitchSize = (typeof switchSizes)[number];

export const switchLayouts = ["inline", "settings"] as const;

export type SwitchLayout = (typeof switchLayouts)[number];

/** Row rhythm — aligns with cluster sm (28px) / md (36px) tiers. */
export const switchRowSizeClasses: Record<SwitchSize, string> = {
  sm: "min-h-7 gap-2",
  md: "min-h-9 gap-2.5",
};

export const switchHitTargetSizeClasses: Record<SwitchSize, string> = {
  sm: "size-7",
  md: "size-9",
};

/** Pill track — [Astryx Switch](https://astryx.atmeta.com/components/Switch). */
export const switchTrackSizeClasses: Record<SwitchSize, string> = {
  sm: "h-[18px] w-8 rounded-full p-0.5",
  md: "h-[22px] w-10 rounded-full p-0.5",
};

export const switchThumbSizeClasses: Record<SwitchSize, string> = {
  sm: "size-3.5",
  md: "size-[18px]",
};

export const switchThumbOffsetPx: Record<SwitchSize, number> = {
  sm: 14,
  md: 18,
};

export const switchTrackBaseClasses = cn(
  "pointer-events-none relative flex shrink-0 items-center border border-transparent",
  "transition-[background-color,border-color,box-shadow]",
  motionTransition("fast"),
);

/** Off — recessed body well (SegmentedControl track family). */
export const switchTrackUncheckedClasses = "bg-body shadow-hairline";

/** On — filled primary track so state reads at a glance (reference switch pattern). */
export const switchTrackCheckedClasses = "border-primary bg-primary shadow-none";

/** Raised knob — surface + shadow; position animated via Motion (same tier as **SegmentedControl** thumb). */
export const switchThumbClasses = "block rounded-full bg-surface shadow-raised";

export const switchTrackDisabledClasses = "opacity-50";

export const switchLabelClasses = typographyClass("ui-label");

export const switchDescriptionClasses = cn(typographyClass("caption"), "leading-snug");

export const switchTextColumnClasses = "flex min-w-0 flex-col gap-px";

export const switchLabelWithDescriptionClasses = cn(switchLabelClasses, "leading-tight");

export const switchDescriptionRowClasses: Record<SwitchSize, string> = {
  sm: "flex min-w-0 items-start gap-2",
  md: "flex min-w-0 items-start gap-2.5",
};

export const switchHitTargetDescriptionAlignClasses: Record<SwitchSize, string> = {
  sm: "mt-px",
  md: "mt-0.5",
};

export const switchRowBaseClasses = "group/switch relative flex w-full cursor-pointer";

export const switchRowLabelOnlyClasses = "items-center";

export const switchSettingsRowClasses = "items-center justify-between gap-4";

export const switchRowDisabledClasses = "cursor-not-allowed";

export const switchHiddenInputClasses =
  "peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed";

export const switchFocusRingClasses =
  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-body";

export function switchTrackClassesFor(
  size: SwitchSize,
  checked: boolean,
  disabled?: boolean,
  status?: InputStatus,
): string {
  return cn(
    switchTrackBaseClasses,
    switchTrackSizeClasses[size],
    switchFocusRingClasses,
    checked ? switchTrackCheckedClasses : switchTrackUncheckedClasses,
    status != null && inputStatusShellClasses[status],
    disabled && switchTrackDisabledClasses,
  );
}

export function switchLabelClassesFor(disabled?: boolean, withDescription?: boolean): string {
  return cn(
    withDescription ? switchLabelWithDescriptionClasses : switchLabelClasses,
    disabled && inputDisabledLabelClasses,
  );
}

export function switchStatusBannerClassesFor(status: InputStatus): string {
  return cn(
    "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 leading-snug",
    inputStatusBannerSurfaceClasses[status],
  );
}
