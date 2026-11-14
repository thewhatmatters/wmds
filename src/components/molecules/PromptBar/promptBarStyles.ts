import { glassSurfaceFillClasses } from "../../../lib/glassSurface";
import { focusRingTransitionClasses } from "../../../lib/motion";

export const promptBarVariants = ["surface", "glass"] as const;

/**
 * `surface` — the solid pill (default).
 * `glass` — a frosted pane, for a bar that floats over a picture, a video or a canvas.
 */
export type PromptBarVariant = (typeof promptBarVariants)[number];

/**
 * One-line shell is a pill. IconButton `sm` is 2.25rem and the inset is 0.5rem,
 * so the outer height is 3.25rem and the radius is half of that (1.625rem).
 * The radius stays put when the field grows, and the circle keeps the same inset.
 * The shell owns the single focus ring (inset, so it does not stack a second edge).
 */
const promptBarShellBaseClasses =
  "flex w-full items-end gap-2 rounded-[1.625rem] border p-2 " +
  // Labels and placeholders F10: the pill's ring is the field's; the send button shows its own.
  // CopyField shares this shell with an <input>, so both field kinds light it.
  "has-[textarea:focus-visible]:outline-none has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-inset has-[textarea:focus-visible]:ring-focus-ring " +
  "has-[input:focus-visible]:outline-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-inset has-[input:focus-visible]:ring-focus-ring " +
  focusRingTransitionClasses;

/**
 * The pill's fill and edge. Glass is Card's glass (the same `--card-glass-tint` and
 * `--card-glass-blur` knobs) with Card's hairline edge: the 3:1 control border reads as a heavy
 * ring on a pane, and the bar is told apart by its fill, its placeholder and the send button.
 */
export const promptBarShellVariantClasses: Record<PromptBarVariant, string> = {
  surface: "border-border-control bg-surface",
  glass: `border-elevation-edge ${glassSurfaceFillClasses}`,
};

/**
 * On glass the placeholder steps up from the placeholder grey to the text colour at 80%: what
 * shows through the pane can be bright, and the grey would sink into it. At the default tints
 * it holds AA over any backdrop, white to black (promptBar.test.ts).
 */
export const promptBarGlassPlaceholderStrength = 0.8;
export const promptBarFieldVariantClasses: Record<PromptBarVariant, string> = {
  surface: "",
  glass: "placeholder:!text-[color-mix(in_srgb,var(--color-text-primary)_80%,transparent)]",
};

/** The solid shell. CopyField uses it as is. */
export const promptBarShellClasses = `${promptBarShellBaseClasses} ${promptBarShellVariantClasses.surface}`;

/** The shell for a variant. */
export function promptBarShellClassesFor(variant: PromptBarVariant): string {
  return `${promptBarShellBaseClasses} ${promptBarShellVariantClasses[variant]}`;
}

/**
 * Leading inset. The text starts 1.25rem in; with a `start` slot the slot takes the same
 * 0.5rem inset as the send circle, and the field keeps 0.25rem more air than the shell gap.
 */
export const promptBarShellStartPadClasses = {
  field: "pl-5",
  slot: "pl-2",
} as const;

/**
 * Leading slot — a brand mark or avatar at the send circle's size (2.25rem), pinned to the
 * last line like the send control. Its width is the content's, so a caller can fold the mark
 * away: at zero width the field starts 1.25rem in, the same as without a slot.
 */
export const promptBarStartSlotClasses = "mr-1 flex h-9 shrink-0 items-center justify-center";

/** Trailing slot — extra inset controls (for example a mic **IconButton** `sm`) before send. */
export const promptBarEndSlotClasses = "flex shrink-0 items-end gap-2";

/**
 * Empty is one line — min height matches the send circle, with padding that centers that line.
 * Grows with the text, stops at three lines (`max-h`), then scrolls.
 */
export const promptBarFieldClasses =
  "min-h-9 min-w-0 flex-1 overflow-y-auto py-2 type-body pointer-coarse:text-base [field-sizing:content] " +
  "max-h-[4.75rem]";

/**
 * The send circle shows its own ring, hugging it (no offset, which would sit on the pill border), and
 * takes a 44px tap area on touch screens (F10).
 */
export const promptBarSendClasses =
  "relative focus-visible:!ring-offset-0 pointer-coarse:after:absolute pointer-coarse:after:-inset-1 pointer-coarse:after:content-['']";

/** Enabled send — existing brand navy, not a new blue. */
export const promptBarSendReadyClasses = "!bg-brand !text-on-brand hover:!bg-brand active:!bg-brand";

/**
 * Empty send. Neutral fill and disabled ink — muted, not a faded navy.
 * `disabled:!opacity-100` keeps that pair; IconButton's opacity-50 would wash it out.
 */
export const promptBarSendMutedClasses = "!bg-neutral !text-disabled disabled:!opacity-100";
