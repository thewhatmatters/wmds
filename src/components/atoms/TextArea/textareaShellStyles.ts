import { cn } from "../../../lib/cn";
import {
  inputAttachedFieldClasses,
  inputAttachedInputClasses,
  inputBaseClasses,
  inputCompoundShellClassesFor,
  inputCompoundShellFocusRingClasses,
  inputControlStackClasses,
  inputDisabledClasses,
  inputDisabledLabelClasses,
  inputFieldStackClasses,
  inputShellBorderClasses,
  inputShellElevationClasses,
  inputShellTransitionClasses,
  inputSoloFocusRingBaseClasses,
  inputSoloFocusRingColorClasses,
  inputStatusBannerSurfaceClasses,
  inputStatusGapClasses,
  inputStatusShellClasses,
  type InputMessagePosition,
  type InputSize,
  type InputStatus,
} from "../Input/inputShellStyles";

export type { InputMessagePosition, InputSize, InputStatus } from "../Input/inputShellStyles";
export { inputMessagePositions, inputSizes, inputStatuses } from "../Input/inputShellStyles";

export const textareaResizes = ["none", "vertical", "both"] as const;

export type TextAreaResize = (typeof textareaResizes)[number];

/** Multiline shell — element radius (Astryx `--radius-element` / 12px), not pill. */
export const textareaSoloRadiusClasses: Record<InputSize, string> = {
  sm: "rounded-xl",
  md: "rounded-xl",
  lg: "rounded-xl",
};

export const textareaResizeClasses: Record<TextAreaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  both: "resize",
};

export const textareaMinHeightClasses: Record<InputSize, string> = {
  sm: "min-h-20",
  md: "min-h-24",
  lg: "min-h-28",
};

export const textareaFixedPaddingClasses: Record<InputSize, string> = {
  sm: "px-2.5 py-2 text-xs leading-normal",
  md: "px-3 py-2.5 text-sm leading-normal",
  lg: "px-4 py-3 text-base leading-normal",
};

/**
 * Bottom-right padding on the **shell wrapper** — native resize grip tracks the
 * textarea box corner; inset the field inside the bordered shell so the grip
 * clears the rounded corner (content padding alone does not move the grip).
 */
export const textareaShellResizePaddingClasses: Record<InputSize, string> = {
  sm: "pr-2.5 pb-2.5",
  md: "pr-3 pb-3",
  lg: "pr-3.5 pb-3.5",
};

export const textareaShellFocusRingBaseClasses =
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-body";

export const textareaShellFocusRingColorClasses = {
  default: "focus-within:ring-focus-ring",
  error: "focus-within:ring-error-focus-ring",
  warning: "focus-within:ring-warning-focus-ring",
  success: "focus-within:ring-success-focus-ring",
} as const;

export function textareaSoloShellClassesFor(
  size: InputSize,
  status: InputStatus | undefined,
  resize: TextAreaResize,
): string {
  const focusColor =
    status != null
      ? textareaShellFocusRingColorClasses[status]
      : textareaShellFocusRingColorClasses.default;

  return cn(
    "relative w-full",
    textareaShellClasses[size],
    textareaSoloRadiusClasses[size],
    textareaShellFocusRingBaseClasses,
    focusColor,
    status != null && cn("border", inputStatusShellClasses[status]),
    resize !== "none" && textareaShellResizePaddingClasses[size],
    inputShellTransitionClasses,
  );
}

export function textareaCompoundFieldPaddingClasses(
  resize: TextAreaResize,
  size: InputSize,
): string | undefined {
  return resize !== "none" ? textareaShellResizePaddingClasses[size] : undefined;
}

export const textareaShellClasses: Record<InputSize, string> = {
  sm: cn(inputShellBorderClasses, inputShellElevationClasses),
  md: cn(inputShellBorderClasses, inputShellElevationClasses),
  lg: cn(inputShellBorderClasses, inputShellElevationClasses),
};

export const textareaCompoundBannerOverlapBottomClasses: Record<InputSize, string> = {
  sm: "-mt-5 pt-7",
  md: "-mt-6 pt-8",
  lg: "-mt-7 pt-9",
};

export const textareaCompoundBannerOverlapTopPadClasses: Record<InputSize, string> = {
  sm: "pb-7",
  md: "pb-8",
  lg: "pb-9",
};

export const textareaCompoundFieldOverlapTopClasses: Record<InputSize, string> = {
  sm: "-mt-5",
  md: "-mt-6",
  lg: "-mt-7",
};

export const textareaTrailingInsetPositionClasses: Record<InputSize, string> = {
  sm: "right-2.5 top-2",
  md: "right-3 top-2.5",
  lg: "right-3.5 top-3",
};

export const textareaTrailingInsetClasses =
  "pointer-events-none absolute flex items-center gap-1.5";

export function textareaCompoundInnerFieldClassesFor(
  size: InputSize,
  status: InputStatus,
  messagePosition: InputMessagePosition,
): string {
  return cn(
    "relative z-10 flex w-full border bg-surface shadow-sm",
    textareaSoloRadiusClasses[size],
    inputStatusShellClasses[status],
    inputCompoundShellFocusRingClasses[status],
    messagePosition === "top" && textareaCompoundFieldOverlapTopClasses[size],
    inputShellTransitionClasses,
  );
}

export function textareaStatusBannerClassesFor(
  status: InputStatus,
  size: InputSize,
  messagePosition: InputMessagePosition,
): string {
  if (messagePosition === "bottom") {
    return cn(
      "relative z-0 flex w-full items-center gap-2 px-3 pb-3 leading-snug",
      textareaCompoundBannerOverlapBottomClasses[size],
      "rounded-b-[1.375rem]",
      inputStatusBannerSurfaceClasses[status],
    );
  }

  return cn(
    "relative z-0 flex w-full items-center gap-2 px-3 pt-2.5 leading-snug",
    textareaCompoundBannerOverlapTopPadClasses[size],
    "rounded-t-[1.375rem]",
    inputStatusBannerSurfaceClasses[status],
  );
}

export const textareaBaseClasses = cn(inputBaseClasses, "block leading-normal");

export {
  inputAttachedFieldClasses,
  inputAttachedInputClasses,
  inputCompoundShellClassesFor,
  inputControlStackClasses,
  inputDisabledClasses,
  inputDisabledLabelClasses,
  inputFieldStackClasses,
  inputSoloFocusRingBaseClasses,
  inputSoloFocusRingColorClasses,
  inputStatusGapClasses,
  inputStatusShellClasses,
};
