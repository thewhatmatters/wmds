import type { Variants } from "motion/react";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { cardBaseClasses, cardLayoutShellClasses } from "../../molecules/Card/cardStyles";
import { dialogBackdropClasses, overlayPanelFooterShellClasses } from "../Dialog/dialogStyles";

export const sheetSides = ["bottom", "end", "start"] as const;

export type SheetSide = (typeof sheetSides)[number];

export const sheetSizes = ["sm", "md", "lg"] as const;

export type SheetSize = (typeof sheetSizes)[number];

/**
 * Viewport inset on the **opposite** edge from entry — mobile only (`16px`).
 * Entry side + top/bottom stay flush; scrim peeks on the trailing edge only.
 */
export const sheetOverlayInsetClasses: Record<SheetSide, string> = {
  bottom: "pt-4 md:pt-0",
  end: "pl-4 md:pl-0",
  start: "pr-4 md:pr-0",
};

/** Full-viewport stack — scrim + edge-attached panel. */
export const sheetOverlayRootClasses: Record<SheetSide, string> = {
  bottom: cn(
    "fixed inset-0 z-[100] flex flex-col justify-end",
    sheetOverlayInsetClasses.bottom,
  ),
  end: cn(
    "fixed inset-0 z-[100] flex flex-row justify-end",
    sheetOverlayInsetClasses.end,
  ),
  start: cn(
    "fixed inset-0 z-[100] flex flex-row justify-start",
    sheetOverlayInsetClasses.start,
  ),
};

export { dialogBackdropClasses as sheetBackdropClasses };

/** Cross-axis size — width on side sheets, max-height on bottom. */
export const sheetPanelSizeClasses: Record<SheetSide, Record<SheetSize, string>> = {
  bottom: {
    sm: "max-h-[min(40vh,100%)]",
    md: "max-h-[min(60vh,100%)]",
    lg: "max-h-[min(85vh,100%)]",
  },
  end: {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
  },
  start: {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
  },
};

export const sheetPanelBaseClasses = [
  cardBaseClasses,
  cardLayoutShellClasses,
  "max-h-full min-h-0 bg-surface shadow-md",
].join(" ");

/** Edge-attached shell — radius on the inner edge only (not floating). */
export const sheetPanelPlacementClasses: Record<SheetSide, string> = {
  bottom: "w-full rounded-t-2xl",
  end: "h-full w-full rounded-l-2xl",
  start: "h-full w-full rounded-r-2xl",
};

/** Sheet footer — same chrome as overlay footer shell (**Sheet** has no **Card** bottom pad). */
export const sheetPanelFooterClasses = overlayPanelFooterShellClasses;

/** Scrollable body region between header and footer. */
export { overlayPanelBodyScrollClasses as sheetBodyScrollClasses } from "../Dialog/dialogStyles";

/** Motion panel variants — medium tier slide from edge. */
export function sheetPanelMotionVariants(side: SheetSide): Variants {
  switch (side) {
    case "end":
      return {
        hidden: { x: "100%" },
        visible: { x: 0 },
        exit: { x: "100%" },
      };
    case "start":
      return {
        hidden: { x: "-100%" },
        visible: { x: 0 },
        exit: { x: "-100%" },
      };
    default:
      return {
        hidden: { y: "100%" },
        visible: { y: 0 },
        exit: { y: "100%" },
      };
  }
}

export function sheetPanelMotionTransition(side: SheetSide) {
  return motionTransitionProp(side === "bottom" ? "medium" : "medium-max");
}
