import { cn } from "../../../lib/cn";
import { cardBaseClasses, cardLayoutShellClasses } from "../../molecules/Card/cardStyles";
import { overlayPanelFooterShellClasses } from "../Dialog/dialogStyles";
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

/** Fixed edge stack — no scrim; pointer-events pass through outside the shell. */
export const panelRootClasses: Record<PanelSide, string> = {
  end: "fixed inset-y-0 right-0 z-[100] flex pointer-events-none",
  start: "fixed inset-y-0 left-0 z-[100] flex pointer-events-none",
};

export const panelShellClasses = cn(
  cardBaseClasses,
  cardLayoutShellClasses,
  "pointer-events-auto h-full max-h-full min-h-0 bg-surface shadow-md",
);

/** Cross-axis size — width on side panels (same tokens as **Sheet** `end` / `start`). */
export function panelSizeClasses(side: PanelSide, size: PanelSize): string {
  return sheetPanelSizeClasses[side][size];
}

export { sheetPanelPlacementClasses as panelPlacementClasses };

/** Panel footer — hairline + shell bottom inset (no **Card** wrapper). */
export const panelFooterClasses = overlayPanelFooterShellClasses;

export { overlayPanelBodyScrollClasses as panelBodyScrollClasses } from "../Dialog/dialogStyles";

export function panelMotionVariants(side: PanelSide) {
  return sheetPanelMotionVariants(side);
}

export function panelMotionTransition(side: PanelSide) {
  return sheetPanelMotionTransition(side);
}
