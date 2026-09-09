import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";

export const toastPositions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type ToastPosition = (typeof toastPositions)[number];

const toastViewportBaseClasses =
  "pointer-events-none fixed z-[70] grid w-[min(24rem,calc(100vw-2rem))]";

export const toastViewportPositionClasses: Record<ToastPosition, string> = {
  "top-left": cn(
    toastViewportBaseClasses,
    "left-4 top-[max(1rem,env(safe-area-inset-top))] pb-6",
  ),
  "top-center": cn(
    toastViewportBaseClasses,
    "left-1/2 top-[max(1rem,env(safe-area-inset-top))] -translate-x-1/2 pb-6",
  ),
  "top-right": cn(
    toastViewportBaseClasses,
    "right-4 top-[max(1rem,env(safe-area-inset-top))] pb-6",
  ),
  "bottom-left": cn(
    toastViewportBaseClasses,
    "bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 pt-6",
  ),
  "bottom-center": cn(
    toastViewportBaseClasses,
    "bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 pt-6",
  ),
  "bottom-right": cn(
    toastViewportBaseClasses,
    "bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 pt-6",
  ),
};

export const toastItemClasses =
  "col-start-1 row-start-1 w-full min-w-0 rounded-[var(--radius-card-shell)] border border-border bg-popover p-3 shadow-lg";

export const toastItemContentRowClasses =
  "flex min-w-0 items-start gap-3";

export const toastStatusClasses = "mt-0.5 shrink-0";

export const toastContentClasses = "min-w-0 flex-1";

export const toastTitleClasses = `${typographyClass("ui-label")} text-fg`;

export const toastDescriptionClasses =
  `${typographyClass("caption")} mt-0.5 text-muted`;

export const toastActionsClasses =
  "flex shrink-0 items-center gap-1 self-center";
