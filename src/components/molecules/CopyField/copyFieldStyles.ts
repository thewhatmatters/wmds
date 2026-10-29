import { cn } from "../../../lib/cn";
import {
  promptBarSendClasses,
  promptBarShellClasses,
  promptBarShellStartPadClasses,
} from "../PromptBar/promptBarStyles";

/** Label, pill, and the blocked-clipboard hint. */
export const copyFieldClasses = "flex w-full min-w-0 flex-col gap-2";

/**
 * Same type step as an Input label (`type-label`). Color is inherited, not `text-fg`,
 * so a parent `text-on-brand` paints the label on a navy field.
 */
export const copyFieldLabelClasses = "type-label";

/**
 * PromptBar's pill. The shell owns the border, radius, and the one inset focus ring.
 * `pl-5` is the same leading inset as a PromptBar with no start slot.
 */
export const copyFieldShellClasses = cn(promptBarShellClasses, promptBarShellStartPadClasses.field);

/**
 * Value track inside the shell. `min-w-0` + `truncate` keep a long key in the track
 * so it never runs under the button, including at 390px.
 */
export const copyFieldValueClasses = "h-9 min-h-9 w-full min-w-0 flex-1 truncate px-0 py-0";

/**
 * Trailing seat — PromptBar's send control. `shrink-0` holds the button's width.
 * The shell owns the focus ring, so the button drops its own.
 */
// The status button clips its morph with overflow-hidden, which would also clip the touch layer.
export const copyFieldButtonClasses = cn(promptBarSendClasses, "shrink-0 pointer-coarse:overflow-visible");

/**
 * Blocked-clipboard hint. Supporting type, color inherited (same reason as the label).
 * Hidden from layout until shown.
 */
export const copyFieldHintClasses = "type-supporting";
