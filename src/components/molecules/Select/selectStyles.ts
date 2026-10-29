import { focusRingTransitionClasses, motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";
import {
  inputDisabledClasses,
  inputSoloRadiusClasses,
  inputSizes,
  type InputSize,
} from "../../atoms/Input/inputShellStyles";

export const selectSizes = inputSizes;

export type SelectSize = InputSize;

export const selectFieldStackClasses = "flex w-full flex-col gap-1.5";

export const selectRootClasses = "relative w-full min-w-0";

/** Inset ring on shell — focus never paints outside the pill (no ring-offset jump). */
const selectShellFocusClasses = cn(
  "outline-none ring-2 ring-transparent ring-inset ring-offset-0",
  "focus-within:ring-focus-ring",
  "data-[open=true]:ring-focus-ring",
  focusRingTransitionClasses,
);

/** Outer pill — owns border, elevation, height, and focus ring (Search shell pattern). */
export const selectShellClasses: Record<SelectSize, string> = {
  sm: cn(
    "relative flex w-full min-w-0 items-center rounded-[var(--radius-control)] border border-border-control bg-surface shadow-raised",
    inputSoloRadiusClasses.sm,
    "h-8",
    selectShellFocusClasses,
  ),
  md: cn(
    "relative flex w-full min-w-0 items-center rounded-[var(--radius-control)] border border-border-control bg-surface shadow-raised",
    inputSoloRadiusClasses.md,
    "h-11",
    selectShellFocusClasses,
  ),
  lg: cn(
    "relative flex w-full min-w-0 items-center rounded-[var(--radius-control)] border border-border-control bg-surface shadow-raised",
    inputSoloRadiusClasses.lg,
    "min-h-12",
    selectShellFocusClasses,
  ),
};

export const selectShellDisabledClasses = "pointer-events-none opacity-50";

/** Inner trigger — transparent; shell owns chrome and focus ring. */
export const selectTriggerInnerClasses: Record<SelectSize, string> = {
  sm: cn(
    "flex h-full w-full min-w-0 cursor-pointer items-center justify-between gap-2 border-0 bg-transparent px-2.5 text-left text-xs leading-none font-sans font-normal tracking-normal text-fg",
    "pr-2.5 shadow-none outline-none focus:outline-none focus-visible:outline-none",
    inputDisabledClasses,
  ),
  md: cn(
    "flex h-full w-full min-w-0 cursor-pointer items-center justify-between gap-2 border-0 bg-transparent px-3 text-left text-sm leading-none font-sans font-normal tracking-normal text-fg",
    "pr-3 shadow-none outline-none focus:outline-none focus-visible:outline-none",
    inputDisabledClasses,
  ),
  lg: cn(
    "flex h-full w-full min-w-0 cursor-pointer items-center justify-between gap-2 border-0 bg-transparent px-4 text-left text-base leading-none font-sans font-normal tracking-normal text-fg",
    "pr-3.5 shadow-none outline-none focus:outline-none focus-visible:outline-none",
    inputDisabledClasses,
  ),
};

export const selectTriggerLabelClasses = "min-w-0 flex-1 truncate";

export const selectTriggerPlaceholderClasses = "text-disabled";

/** Trailing caret column — fixed square; chevron SVG fills the slot. */
export const selectTriggerCaretSlotClasses: Record<SelectSize, string> = {
  sm: "flex size-3.5 shrink-0 items-center justify-center text-muted",
  md: "flex size-4 shrink-0 items-center justify-center text-muted",
  lg: "flex size-4 shrink-0 items-center justify-center text-muted",
};

export const selectTriggerCaretRotateClasses = cn(
  "inline-flex [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
  motionTransition("fast"),
  "transition-transform",
);

export const selectTriggerCaretOpenClasses = "rotate-180";

export { dropdownMenuOffsetPx as selectMenuOffsetPx } from "../Dropdown/dropdownStyles";

export const selectDisabledLabelClasses = "opacity-50";

export const selectLabelClasses = typographyClass("ui-label");

export const selectDescriptionClasses = typographyClass("caption");

/**
 * Native mode (Dropdowns C8): the browser's own `<select>` fills the same shell. The phone opens its
 * picker, typing jumps to an option, and autofill works. 16px text on touch so iOS doesn't zoom.
 */
export const selectNativeClasses: Record<SelectSize, string> = {
  sm: "h-full w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent pl-2.5 pr-8 text-xs pointer-coarse:text-base leading-none font-sans text-fg outline-none focus:outline-none [&>option]:bg-surface [&>option]:text-fg",
  md: "h-full w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent pl-3 pr-9 text-sm pointer-coarse:text-base leading-none font-sans text-fg outline-none focus:outline-none [&>option]:bg-surface [&>option]:text-fg",
  lg: "h-full min-h-12 w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent pl-4 pr-10 text-base leading-none font-sans text-fg outline-none focus:outline-none [&>option]:bg-surface [&>option]:text-fg",
};

/** The chevron over the native select's right edge; clicks pass through to the select. */
export const selectNativeCaretClasses: Record<SelectSize, string> = {
  sm: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 [&>svg]:size-full [&>svg]:stroke-current",
  md: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 [&>svg]:size-full [&>svg]:stroke-current",
  lg: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 [&>svg]:size-full [&>svg]:stroke-current",
};
