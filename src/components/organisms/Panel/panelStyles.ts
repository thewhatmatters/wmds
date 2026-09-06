import { cn } from "../../../lib/cn";
import { cardBaseClasses, cardLayoutShellClasses } from "../../molecules/Card/cardStyles";
import { dialogBackdropClasses } from "../Dialog/dialogStyles";
import {
  sheetPanelMotionTransition,
  sheetPanelMotionVariants,
  sheetPanelPlacementClasses,
  sheetPanelSizeClasses,
} from "../Sheet/sheetStyles";

export const panelSides = ["end", "start"] as const;

export type PanelSide = (typeof panelSides)[number];

export const panelSizes = ["sm", "md", "lg"] as const;

export type PanelSize = (typeof panelSizes)[number];

/** Full-viewport stack — visual scrim + edge panel; outside clicks pass through. */
export const panelOverlayRootClasses: Record<PanelSide, string> = {
  end: "fixed inset-0 z-[100] flex flex-row justify-end pointer-events-none",
  start: "fixed inset-0 z-[100] flex flex-row justify-start pointer-events-none",
};

/** Non-blocking dim — inherits pointer-events-none from root; page stays interactive. */
export const panelBackdropClasses = cn(dialogBackdropClasses, "pointer-events-none");

export const panelShellClasses = cn(
  cardBaseClasses,
  cardLayoutShellClasses,
  "pointer-events-auto relative z-[1] h-full max-h-full min-h-0 bg-surface shadow-md",
);

/** Cross-axis size — width on side panels (same tokens as **Sheet** `end` / `start`). */
export function panelSizeClasses(side: PanelSide, size: PanelSize): string {
  return sheetPanelSizeClasses[side][size];
}

export { sheetPanelPlacementClasses as panelPlacementClasses };

export { overlayPanelBodyScrollClasses as panelBodyScrollClasses } from "../Dialog/dialogStyles";

export function panelMotionVariants(side: PanelSide) {
  return sheetPanelMotionVariants(side);
}

export function panelMotionTransition(side: PanelSide) {
  return sheetPanelMotionTransition(side);
}
