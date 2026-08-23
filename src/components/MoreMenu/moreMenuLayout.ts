import type { MoreMenuAlignment, MoreMenuPlacement } from "./types";

export const MENU_GAP_PX = 4;
export const VIEWPORT_PADDING_PX = 8;

export interface MenuBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface ResolvedMenuPosition {
  top: number;
  left: number;
  placement: MoreMenuPlacement;
  alignment: MoreMenuAlignment;
}

export function resolveMenuPosition(
  triggerRect: MenuBounds,
  menuRect: MenuBounds,
  viewport: ViewportSize,
  preferredPlacement: MoreMenuPlacement,
  preferredAlignment: MoreMenuAlignment,
): ResolvedMenuPosition {
  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;

  const spaceBelow = viewportHeight - triggerRect.bottom - VIEWPORT_PADDING_PX;
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING_PX;

  let placement = preferredPlacement;
  if (
    placement === "below" &&
    menuRect.height + MENU_GAP_PX > spaceBelow &&
    spaceAbove > spaceBelow
  ) {
    placement = "above";
  } else if (
    placement === "above" &&
    menuRect.height + MENU_GAP_PX > spaceAbove &&
    spaceBelow > spaceAbove
  ) {
    placement = "below";
  }

  const menuWidth = menuRect.width;
  const alignStartLeft = triggerRect.left;
  const alignEndLeft = triggerRect.right - menuWidth;
  const startOverflow = alignStartLeft + menuWidth + VIEWPORT_PADDING_PX - viewportWidth;
  const endOverflow = VIEWPORT_PADDING_PX - alignEndLeft;

  let alignment = preferredAlignment;
  if (alignment === "end" && endOverflow > 0 && startOverflow <= 0) {
    alignment = "start";
  } else if (alignment === "start" && startOverflow > 0 && endOverflow <= 0) {
    alignment = "end";
  }

  let top =
    placement === "below"
      ? triggerRect.bottom + MENU_GAP_PX
      : triggerRect.top - menuRect.height - MENU_GAP_PX;

  let left = alignment === "start" ? alignStartLeft : alignEndLeft;

  left = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(left, viewportWidth - menuWidth - VIEWPORT_PADDING_PX),
  );
  top = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(top, viewportHeight - menuRect.height - VIEWPORT_PADDING_PX),
  );

  return { top, left, placement, alignment };
}
