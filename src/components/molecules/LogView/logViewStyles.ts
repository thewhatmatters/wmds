import { typographyClass } from "../../../lib/typography";

export const logViewRootClasses =
  "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface";

export const logViewToolbarClasses =
  "flex h-9 shrink-0 items-center gap-2 border-b border-border px-3";

export const logViewCountClasses = `${typographyClass("caption")} tabular-nums text-muted`;

export const logViewActionsClasses = "ml-auto flex items-center gap-2";

export const logViewScrollerClasses = "min-h-40 flex-1 overflow-auto scroll-fade-y";

export const logViewLineClasses = "flex gap-3 px-3";

export const logViewNumberClasses =
  "type-code w-8 shrink-0 text-end text-muted tabular-nums";

export const logViewTextClasses = "type-code min-w-0 flex-1 whitespace-pre-wrap break-all";

export const logViewEmptyClasses = `${typographyClass("caption")} px-3 py-4 text-muted`;

export const logViewSkeletonClasses = "m-3";
