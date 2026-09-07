import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const floatingActionButtonVerticalPath = "M 0 0 L 0 -286";

export const floatingActionButtonRootClasses =
  "pointer-events-none z-50 size-12";

export const floatingActionButtonInnerClasses = "relative size-full";

export const floatingActionButtonBackdropClasses =
  "pointer-events-auto fixed inset-0 bg-overlay";

export const floatingActionButtonPathOriginClasses =
  "pointer-events-none absolute left-1/2 top-1/2 size-0";

export const floatingActionButtonItemClasses =
  "pointer-events-auto absolute left-0 top-0 z-10 will-change-[offset-distance,opacity,transform] [offset-anchor:center] [offset-rotate:0deg]";

export const floatingActionButtonLabelClasses = cn(
  typographyClass("ui-label"),
  "pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1 text-fg shadow-raised",
);

export const floatingActionButtonTriggerClasses =
  "pointer-events-auto relative z-20 will-change-transform";
