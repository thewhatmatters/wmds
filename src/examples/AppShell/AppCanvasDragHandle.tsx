import type { MouseEventHandler, PointerEventHandler } from "react";
import { cn } from "../../lib/cn";
import { appShellSideNavWidthPx } from "./useSideNavReveal";
import {
  appCanvasDragHandleBarClasses,
  appCanvasDragHandleButtonClasses,
} from "./appShellStyles";

export interface AppCanvasDragHandleProps {
  reveal: number;
  isDragging: boolean;
  isCollapsed: boolean;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onPointerMove: PointerEventHandler<HTMLButtonElement>;
  onPointerUp: PointerEventHandler<HTMLButtonElement>;
  onPointerCancel: PointerEventHandler<HTMLButtonElement>;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Vertical pill on the canvas leading edge — drag start to slide over **SideNav**.
 * Double-click toggles fully open / fully covered.
 */
export function AppCanvasDragHandle({
  reveal,
  isDragging,
  isCollapsed,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onDoubleClick,
}: AppCanvasDragHandleProps) {
  return (
    <button
      type="button"
      data-app-shell-drag-handle=""
      className={cn(appCanvasDragHandleButtonClasses, isDragging && "cursor-col-resize!")}
      style={{ cursor: "col-resize" }}
      aria-label={isCollapsed ? "Show section navigation" : "Hide section navigation"}
      aria-valuemin={0}
      aria-valuemax={appShellSideNavWidthPx}
      aria-valuenow={Math.round(reveal)}
      aria-orientation="vertical"
      role="separator"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDoubleClick={onDoubleClick}
    >
      <span aria-hidden className={appCanvasDragHandleBarClasses} />
    </button>
  );
}
