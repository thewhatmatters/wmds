import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const emptyStateKinds = ["first-use", "no-results", "done"] as const;
export type EmptyStateKind = (typeof emptyStateKinds)[number];

/** Takes the list’s place only: centred, compact, so the action shows without scrolling at 390 (Z9). */
export const emptyStateClasses = "flex w-full flex-col items-center gap-2 px-4 py-8 text-center";
/** 24px, only when it names the thing (Z9). No illustrations. */
export const emptyStateIconClasses = "mb-1 inline-flex text-muted [&>svg]:size-6 [&>svg]:shrink-0 [&>svg]:stroke-current";
export const emptyStateTitleClasses = cn(typographyClass("subheading"), "text-fg");
export const emptyStateDescriptionClasses = cn(typographyClass("caption"), "max-w-[40ch] text-pretty text-muted");
export const emptyStateActionsClasses = "mt-2 flex flex-wrap items-center justify-center gap-3";
