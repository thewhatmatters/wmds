import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";
import { cardLayoutSectionInsetXClasses, cardTitleClasses } from "../../molecules/Card/cardStyles";

export const dialogSizes = ["sm", "md", "lg"] as const;

export type DialogSize = (typeof dialogSizes)[number];

/** Full-viewport stack — backdrop + centered panel. */
export const dialogOverlayRootClasses = "fixed inset-0 z-[100] flex items-center justify-center p-4";

/** Scrim — `--color-overlay` token. */
export const dialogBackdropClasses = cn(
  "absolute inset-0 bg-overlay",
  "transition-opacity",
  motionTransition("medium"),
);

/** Centered panel width — layout-only on the Card shell. */
export const dialogPanelSizeClasses: Record<DialogSize, string> = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-lg",
  lg: "w-full max-w-2xl",
};

/** Dialog body copy — typography only; horizontal inset comes from section stack / header. */
export const dialogBodyCopyClasses = cn(typographyClass("body"), "text-fg");

/** Muted copy in the dialog body slot — shared by **Dialog** and **AlertDialog**. */
export const dialogBodyMutedClasses = cn(dialogBodyCopyClasses, "text-muted");

/** AlertDialog title — **Card** subheading scale; brief confirm, not page section. */
export const alertDialogTitleClasses = cardTitleClasses;

/** @deprecated Prefer {@link dialogBodyCopyClasses} inside {@link overlayPanelBodyScrollClasses}. */
export const dialogBodyClasses = cn(dialogBodyCopyClasses, "px-4");

/** Dialog / AlertDialog footer — full-width row, actions end-aligned. */
export const dialogFooterClasses = cn(
  cardLayoutSectionInsetXClasses,
  "flex w-full items-center justify-end gap-2",
);

/** AlertDialog footer — same alignment as {@link dialogFooterClasses}. */
export const alertDialogFooterClasses = dialogFooterClasses;

/** End-aligned action cluster in footer. */
export const dialogFooterActionsClasses = "flex shrink-0 items-center justify-end gap-2";

/**
 * Overlay chrome — header and footer stay visible; only the body slot scrolls.
 * Flex + overflow hidden (not `position: fixed`) — footer pins to the panel bottom.
 */
export const overlayPanelChromeClasses = "flex min-h-0 flex-col overflow-hidden";

/** Viewport cap for centered **Dialog** / **AlertDialog** panels. */
export const overlayPanelMaxHeightClasses = "max-h-[min(85vh,100%)]";

export const overlayPanelHeaderClasses = "shrink-0";

/** Full-width section hairline — sibling of inset header/footer rows (**Sheet** / **Panel**). */
export const overlayPanelHairlineClasses = "m-0 w-full shrink-0 border-0 border-border p-0";

export const overlayPanelHeaderHairlineClasses = cn(overlayPanelHairlineClasses, "border-b");

export const overlayPanelFooterHairlineClasses = cn(overlayPanelHairlineClasses, "border-t");

/** @deprecated Prefer {@link overlayPanelHeaderHairlineClasses} below padded **Card.Header**. */
export const overlayPanelHeaderDelineatedShellClasses = cn(
  overlayPanelHeaderClasses,
  "border-b border-border",
);

/** Header inner pad when a scroll body or footer follows. */
export const overlayPanelHeaderDelineatedInnerClasses = "pb-3";

/** @deprecated Use {@link overlayPanelHeaderDelineatedShellClasses} + inner pad on **Card.Header**. */
export const overlayPanelHeaderDelineatedClasses = cn(
  overlayPanelHeaderDelineatedShellClasses,
  overlayPanelHeaderDelineatedInnerClasses,
);

/** Title row + optional leading slot — mirrors **Card.Header** `start` cluster. */
export const overlayPanelHeaderStartClusterClasses =
  "flex min-w-0 flex-1 items-start gap-3";

/** Leading icon or **Badge** — 20px Lucide scale. */
export const overlayPanelHeaderStartSlotClasses =
  "flex shrink-0 items-center pt-0.5 text-muted [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:stroke-current";

/** Muted description under the title (in header). */
export const dialogDescriptionClasses = cn(dialogBodyCopyClasses, "pt-1 text-muted");

/** Shared vertical stack — header, body, footer with section gaps. */
export const overlayPanelStackClasses = "flex min-h-0 flex-col gap-3";

export const overlayPanelSectionStackClasses = cn(overlayPanelStackClasses, "h-full");

export const overlayPanelBodyScrollClasses = cn(
  dialogBodyCopyClasses,
  cardLayoutSectionInsetXClasses,
  "min-h-0 flex-1 overflow-y-auto overscroll-contain",
);

export const overlayPanelFooterClasses = cn(dialogFooterClasses, "shrink-0");

/** Borderless **Dialog** / **AlertDialog** shell — 16px section rhythm (roomier than **Sheet** chrome). */
export const dialogPanelShellClasses = "gap-4";

/** Dialog body scroll — horizontal inset + light vertical pad for copy blocks. */
export const overlayPanelDialogBodyScrollClasses = cn(
  overlayPanelBodyScrollClasses,
  "py-1",
);

/** Dialog footer — top inset without hairlines. */
export const overlayPanelDialogFooterClasses = cn(overlayPanelFooterClasses, "pt-2");

/** Footer shell when a scroll body precedes the footer. */
export const overlayPanelFooterDelineatedShellClasses = "shrink-0 w-full";

/** Footer inner pad when a scroll body precedes the footer. */
export const overlayPanelFooterDelineatedInnerClasses = cn(
  dialogFooterClasses,
  "pt-3 pb-4",
);

/** @deprecated Use {@link overlayPanelFooterHairlineClasses} + inner row. */
export const overlayPanelFooterDelineatedClasses = cn(
  overlayPanelFooterDelineatedShellClasses,
  "border-t border-border pt-3",
);

/** @deprecated Use delineated shell + inner classes on **Sheet** / **Panel** footers. */
export const overlayPanelFooterShellClasses = cn(
  overlayPanelFooterDelineatedClasses,
  "pb-4",
);
