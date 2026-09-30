import { focusRingTransitionClasses } from "../../../lib/motion";

/**
 * Wide prompt pill — taller than the compact Search shell (`h-11`)
 * so it can sit under a headline. Surface on the page background.
 * Border and focus ring match Search: the shell owns them.
 */
export const promptBarShellClasses =
  "flex w-full items-end gap-3 rounded-full border border-border-control bg-surface " +
  "py-3 pr-3 pl-6 " +
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2 focus-within:ring-offset-body " +
  focusRingTransitionClasses;

/**
 * One line, then a little extra if the text wraps (`field-sizing: content`, max three-ish lines).
 * Parent shell owns the border. `type-body` is the field size — not a new step.
 */
export const promptBarFieldClasses =
  "min-h-11 min-w-0 flex-1 overflow-y-auto py-3 type-body [field-sizing:content] max-h-24";

/**
 * Send control fill. IconButton has no brand role — `--color-primary` is slate, not navy.
 * `!` beats the role fill. Token is `--color-brand` (`#011272`) with `--color-on-brand`.
 * No new Button variant and no new color.
 */
export const promptBarSendClasses = "!bg-brand !text-on-brand hover:!bg-brand active:!bg-brand";
