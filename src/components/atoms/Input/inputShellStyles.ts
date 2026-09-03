import { motionTransition } from "../../../lib/motion";
import { cn } from "../../../lib/cn";

export const inputSizes = ["sm", "md", "lg"] as const;

export type InputSize = (typeof inputSizes)[number];

export const inputStatuses = ["error", "warning", "success"] as const;

export type InputStatus = (typeof inputStatuses)[number];

export const inputMessagePositions = ["top", "bottom"] as const;

export type InputMessagePosition = (typeof inputMessagePositions)[number];

/** Input shell — text + focus ring share one eased fade (`slow` ≈ 280ms). */
export const inputShellTransitionClasses =
  `transition-[color,background-color,box-shadow,border-color,outline-color] ${motionTransition("fast")}`;

export const inputBaseClasses =
  "w-full min-w-0 bg-surface font-sans font-normal tracking-normal text-fg " +
  "placeholder:text-disabled " +
  inputShellTransitionClasses;

/** Solo shell — ring sits on the input with page offset. */
export const inputSoloFocusRingBaseClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-body";

export const inputSoloFocusRingColorClasses = {
  default: "focus-visible:ring-focus-ring",
  error: "focus-visible:ring-error-focus-ring",
  warning: "focus-visible:ring-warning-focus-ring",
  success: "focus-visible:ring-success-focus-ring",
} as const;

/** Focus ring on compound validation shell ([Astryx ChatComposer](https://astryx.atmeta.com/components/ChatComposer)). */
export const inputCompoundShellFocusRingClasses: Record<InputStatus, string> = {
  error:
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-error-focus-ring focus-within:ring-offset-2 focus-within:ring-offset-body",
  warning:
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-warning-focus-ring focus-within:ring-offset-2 focus-within:ring-offset-body",
  success:
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-success-focus-ring focus-within:ring-offset-2 focus-within:ring-offset-body",
};

/** @deprecated Use {@link inputCompoundShellFocusRingClasses}. */
export const inputValidationShellFocusRingClasses = inputCompoundShellFocusRingClasses;

/** @deprecated Use {@link inputCompoundShellFocusRingClasses}. */
export const inputCompoundInnerFocusRingClasses = inputCompoundShellFocusRingClasses;

/** @deprecated Use {@link inputCompoundShellFocusRingClasses}. */
export const inputCompoundFocusRingClasses = inputCompoundShellFocusRingClasses;

export const inputSizeClasses: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-xs leading-none",
  md: "h-11 px-3 text-sm leading-none",
  lg: "min-h-12 px-4 text-base leading-none",
};

export const inputShellBorderClasses = "border border-border";

export const inputShellElevationClasses = "shadow-raised";

export const inputShellClasses: Record<InputSize, string> = {
  sm: cn(inputShellBorderClasses, inputShellElevationClasses),
  md: cn(inputShellBorderClasses, inputShellElevationClasses),
  lg: cn(inputShellBorderClasses, inputShellElevationClasses),
};

/** Solo shell — pill only. */
export const inputSoloRadiusClasses: Record<InputSize, string> = {
  sm: "rounded-full",
  md: "rounded-full",
  lg: "rounded-full",
};

export const inputStatusShellClasses: Record<InputStatus, string> = {
  error: "border-error",
  warning: "border-warning",
  success: "border-success",
};

/** Compound outer radius — capsule around the pill + message band. */
export const inputCompoundOuterRadiusClasses: Record<InputSize, string> = {
  sm: "rounded-2xl",
  md: "rounded-[1.375rem]",
  lg: "rounded-[1.5rem]",
};

/** Banner tucks under the pill equator (~half field height). */
export const inputCompoundBannerOverlapBottomClasses: Record<InputSize, string> = {
  sm: "-mt-4 pt-6",
  md: "-mt-[1.375rem] pt-8",
  lg: "-mt-6 pt-8",
};

export const inputCompoundBannerOverlapTopPadClasses: Record<InputSize, string> = {
  sm: "pb-6",
  md: "pb-8",
  lg: "pb-8",
};

export const inputCompoundFieldOverlapTopClasses: Record<InputSize, string> = {
  sm: "-mt-4",
  md: "-mt-[1.375rem]",
  lg: "-mt-6",
};

/** @deprecated Use {@link inputCompoundBannerOverlapBottomClasses}. */
export const inputCompoundBannerOverlapClasses = inputCompoundBannerOverlapBottomClasses.md;

/** @deprecated Use {@link inputCompoundBannerOverlapTopPadClasses}. */
export const inputCompoundBannerOverlapTopClasses = inputCompoundBannerOverlapTopPadClasses.md;

/** Compound stack — field floats above banner; focus ring stays on the field only. */
export function inputCompoundShellClassesFor(_size?: InputSize, _status?: InputStatus): string {
  return cn("relative flex w-full flex-col", inputShellTransitionClasses);
}

/** Inner field — full pill radius on all four corners; owns focus ring when message is set. */
export function inputCompoundInnerFieldClassesFor(
  size: InputSize,
  status: InputStatus,
  messagePosition: InputMessagePosition,
): string {
  return cn(
    "relative z-10 flex w-full items-center border bg-surface shadow-sm",
    inputSoloRadiusClasses[size],
    inputStatusShellClasses[status],
    inputCompoundShellFocusRingClasses[status],
    messagePosition === "top" && inputCompoundFieldOverlapTopClasses[size],
    inputShellTransitionClasses,
  );
}

/** Tinted status band — layered behind the field; overlap keeps the field's bottom radius visible. */
export function inputStatusBannerClassesFor(
  status: InputStatus,
  size: InputSize,
  messagePosition: InputMessagePosition,
): string {
  if (messagePosition === "bottom") {
    return cn(
      "relative z-0 flex w-full items-center gap-2 px-3 pb-3 leading-snug",
      inputCompoundBannerOverlapBottomClasses[size],
      "rounded-b-[1.375rem]",
      inputStatusBannerSurfaceClasses[status],
    );
  }

  return cn(
    "relative z-0 flex w-full items-center gap-2 px-3 pt-2.5 leading-snug",
    inputCompoundBannerOverlapTopPadClasses[size],
    "rounded-t-[1.375rem]",
    inputStatusBannerSurfaceClasses[status],
  );
}

const inputStatusBannerSurfaceClasses: Record<InputStatus, string> = {
  error: "bg-error-muted text-error",
  warning: "bg-warning-muted text-warning",
  success: "bg-success-muted text-success",
};

/** @deprecated Use {@link inputStatusBannerClassesFor}. */
export const inputStatusBannerClasses: Record<InputStatus, string> = {
  error: cn("flex items-center gap-2 px-3 py-2.5 leading-snug", inputStatusBannerSurfaceClasses.error),
  warning: cn("flex items-center gap-2 px-3 py-2.5 leading-snug", inputStatusBannerSurfaceClasses.warning),
  success: cn("flex items-center gap-2 px-3 py-2.5 leading-snug", inputStatusBannerSurfaceClasses.success),
};

export const inputStatusBannerIconClasses: Record<InputStatus, string> = {
  error: "size-4 shrink-0 stroke-current",
  warning: "size-4 shrink-0 stroke-current",
  success: "size-4 shrink-0 stroke-current",
};

/** @deprecated Use {@link inputCompoundShellClassesFor}. */
export function inputValidationShellClassesFor(size: InputSize, status: InputStatus): string {
  return inputCompoundShellClassesFor(size, status);
}

/** @deprecated Use {@link inputCompoundShellClassesFor}. */
export function inputCompoundOuterClassesFor(size: InputSize): string {
  return inputCompoundShellClassesFor(size, "error");
}

/** @deprecated Nested tray removed. */
export const inputCompoundOuterPaddingClasses: Record<InputSize, string> = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

/** @deprecated Use {@link inputCompoundInnerFieldClassesFor}. */
export const inputCompoundInnerClasses =
  "relative flex w-full items-center rounded-full border bg-surface";

/** @deprecated Use {@link inputStatusShellClasses}. */
export const inputCompoundInnerBorderClasses: Record<InputStatus, string> = inputStatusShellClasses;

/** @deprecated Status copy lives in {@link inputStatusBannerClasses}. */
export const inputCompoundFooterClasses: Record<InputStatus, string> = {
  error: "text-xs leading-snug text-error",
  warning: "text-xs leading-snug text-warning",
  success: "text-xs leading-snug text-success",
};

/** @deprecated Flat compound — use {@link inputCompoundOuterClassesFor}. */
export const inputCompoundWrapperRadiusClasses: Record<InputSize, string> = {
  sm: "rounded-t-[1rem] rounded-b-lg",
  md: "rounded-t-[1.375rem] rounded-b-2xl",
  lg: "rounded-t-[1.5rem] rounded-b-2xl",
};

/** @deprecated Flat compound — use {@link inputCompoundOuterClassesFor}. */
export function inputCompoundWrapperClassesFor(size: InputSize): string {
  return `overflow-hidden ${inputCompoundWrapperRadiusClasses[size]} ${inputShellTransitionClasses}`;
}

export const inputIconGapClasses: Record<InputSize, string> = {
  sm: "pl-8",
  md: "pl-10",
  lg: "pl-11",
};

export const inputStatusGapClasses: Record<InputSize, string> = {
  sm: "pr-8",
  md: "pr-10",
  lg: "pr-11",
};

/** Right inset when trailing {@link Badge} sits inside the shell (e.g. Required). */
export const inputEndBadgeGapClasses: Record<InputSize, string> = {
  sm: "pr-[4.5rem]",
  md: "pr-20",
  lg: "pr-24",
};

/** Right inset when both end badge and status/loading show. */
export const inputEndBadgeAndStatusGapClasses: Record<InputSize, string> = {
  sm: "pr-[6.5rem]",
  md: "pr-28",
  lg: "pr-32",
};

export const inputTrailingInsetPositionClasses: Record<InputSize, string> = {
  sm: "right-2.5",
  md: "right-3",
  lg: "right-3.5",
};

export const inputTrailingInsetClasses =
  "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5";

export const inputEndBadgeWrapperClasses = "pointer-events-none shrink-0";

export const inputIconPositionClasses: Record<InputSize, string> = {
  sm: "left-2.5",
  md: "left-3",
  lg: "left-3.5",
};

export const inputIconSizeClasses: Record<InputSize, string> = {
  sm: "size-3.5 shrink-0 stroke-current text-muted",
  md: "size-4 shrink-0 stroke-current text-muted",
  lg: "size-4 shrink-0 stroke-current text-muted",
};

export const inputStatusIconSizeClasses: Record<InputSize, string> = {
  sm: "size-4 shrink-0 stroke-current",
  md: "size-4 shrink-0 stroke-current",
  lg: "size-5 shrink-0 stroke-current",
};

export const inputSpinnerSizeClasses: Record<InputSize, string> = {
  sm: "size-3.5 shrink-0",
  md: "size-4 shrink-0",
  lg: "size-4 shrink-0",
};

export const inputStatusIconClasses: Record<InputStatus, string> = {
  error: "text-error",
  warning: "text-warning",
  success: "text-success",
};

export const inputStatusFooterClasses: Record<InputStatus, string> = inputCompoundFooterClasses;

/** Single shell when input + validation footer attach — border on wrapper only (no shadow-raised stack). */
export const inputCompoundWrapperClasses: Record<InputSize, string> = {
  sm: inputCompoundOuterClassesFor("sm"),
  md: inputCompoundOuterClassesFor("md"),
  lg: inputCompoundOuterClassesFor("lg"),
};

export const inputCompoundStatusBorderClasses: Record<InputStatus, string> = inputCompoundInnerBorderClasses;

/** Input inside validation shell — shell owns border, bg, and focus ring. */
export const inputAttachedFieldClasses =
  "w-full min-w-0 bg-transparent font-sans font-normal tracking-normal text-fg placeholder:text-disabled " +
  inputShellTransitionClasses;

export const inputAttachedInputClasses =
  "rounded-none border-0 shadow-none focus-visible:outline-none focus-visible:ring-0";

/** Input inside Search / inline row — parent owns shell and focus ring. */
export const inputInlineClasses =
  "rounded-none border-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0";

/** @deprecated Split shells removed — use {@link inputCompoundWrapperClasses}. */
export const inputAttachedShellClasses = "border-b-0";

export const inputDisabledClasses = "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

export const inputFieldStackClasses = "flex w-full flex-col gap-1.5";

export const inputControlStackClasses = "flex w-full flex-col gap-1.5";

export const inputDisabledLabelClasses = "opacity-50";
