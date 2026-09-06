import { useCallback, useEffect, useRef, useState } from "react";

/** Matches **SideNav** `w-52` (13rem → 208px at default root font size). */
export const appShellSideNavWidthPx = 208;

export const appShellSideNavSnapThresholdPx = appShellSideNavWidthPx / 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Fades **SideNav** as the canvas slides over — 1 at rest, 0 when fully covered. */
export function sideNavCoverOpacity(reveal: number, maxReveal = appShellSideNavWidthPx) {
  return 1 - clamp(reveal, 0, maxReveal) / maxReveal;
}

export function useSideNavReveal(maxReveal = appShellSideNavWidthPx, enabled = true) {
  const [reveal, setReveal] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startReveal: number } | null>(null);

  useEffect(() => {
    if (enabled) {
      return;
    }
    setReveal(0);
    setIsDragging(false);
    dragRef.current = null;
  }, [enabled]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!enabled) {
        return;
      }
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { startX: event.clientX, startReveal: reveal };
      setIsDragging(true);
    },
    [enabled, reveal],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!enabled || dragRef.current == null) {
        return;
      }
      const delta = dragRef.current.startX - event.clientX;
      setReveal(clamp(dragRef.current.startReveal + delta, 0, maxReveal));
    },
    [enabled, maxReveal],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!enabled || dragRef.current == null) {
        return;
      }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setReveal((current) => (current >= appShellSideNavSnapThresholdPx ? maxReveal : 0));
      dragRef.current = null;
      setIsDragging(false);
    },
    [enabled, maxReveal],
  );

  const onDoubleClick = useCallback(() => {
    if (!enabled) {
      return;
    }
    setReveal((current) => (current >= maxReveal ? 0 : maxReveal));
  }, [enabled, maxReveal]);

  const isCollapsed = reveal >= maxReveal;

  useEffect(() => {
    if (!isDragging) {
      return;
    }
    const previous = document.body.style.cursor;
    document.body.style.cursor = "col-resize";
    return () => {
      document.body.style.cursor = previous;
    };
  }, [isDragging]);

  return {
    reveal,
    isDragging,
    isCollapsed,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDoubleClick,
    },
  };
}
