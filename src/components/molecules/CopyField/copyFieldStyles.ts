import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

/** Labelled read-only value with the copy button on the input's trailing edge. */
export const copyFieldClasses = "flex w-full min-w-0 flex-col gap-2";

/** The input grows; the button stays on the trailing edge, aligned to the field. */
export const copyFieldRowClasses = "flex w-full min-w-0 items-end gap-2";

export const copyFieldControlClasses = "min-w-0 flex-1";

/** Layout only — the button keeps its own size. */
export const copyFieldButtonClasses = "shrink-0";

/** Blocked-clipboard hint. Caption so it can wrap; hidden from layout until shown. */
export const copyFieldHintClasses = cn(typographyClass("caption"));
