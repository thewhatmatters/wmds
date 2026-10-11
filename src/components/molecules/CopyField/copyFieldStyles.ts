import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import {
  promptBarSendClasses,
  promptBarShellClasses,
  promptBarShellStartPadClasses,
} from "../PromptBar/promptBarStyles";

/** Label, pill, and the blocked-clipboard hint. */
export const copyFieldClasses = "flex w-full min-w-0 flex-col gap-2";

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
export const copyFieldButtonClasses = cn(promptBarSendClasses, "shrink-0");

/** Blocked-clipboard hint. Caption so it can wrap; hidden from layout until shown. */
export const copyFieldHintClasses = cn(typographyClass("caption"));
