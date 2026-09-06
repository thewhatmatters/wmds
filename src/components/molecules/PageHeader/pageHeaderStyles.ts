import { clusterMinHeightClasses } from "../../../lib/clusterScale";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const pageHeaderVariants = ["app", "page", "toolbar"] as const;

export type PageHeaderVariant = (typeof pageHeaderVariants)[number];

/** 56px — app canvas band; pairs with accent **NavRail** logo square in shell examples. */
export const pageHeaderAppBandHeightClasses = "h-[56px] min-h-[56px] max-h-[56px]";

export const pageHeaderShellClasses: Record<PageHeaderVariant, string> = {
  app: cn(
    "box-border flex shrink-0 items-center justify-between gap-4",
    pageHeaderAppBandHeightClasses,
    "px-[var(--grid-margin)] shadow-[inset_0_-1px_0_0_var(--color-border)]",
  ),
  page: "flex items-center justify-between gap-4",
  toolbar: cn(
    "flex items-center justify-between gap-2",
    clusterMinHeightClasses.md,
  ),
};

export const pageHeaderStartClasses = "flex min-w-0 items-center gap-3";

export const pageHeaderEndClasses = "flex shrink-0 items-center gap-2";

export const pageHeaderTitleClasses: Record<PageHeaderVariant, string> = {
  app: cn(typographyClass("section-heading"), "text-fg"),
  page: cn(typographyClass("section-heading"), "text-fg"),
  toolbar: cn(typographyClass("ui-label"), "font-medium text-fg"),
};
