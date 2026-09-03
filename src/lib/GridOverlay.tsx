import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import {
  gridOverlayKeyShouldToggle,
  readGridColumnCount,
  setDocumentGridOn,
} from "./gridOverlay";

export interface GridOverlayProps {
  /**
   * Start with guides visible when uncontrolled. Press `g` to toggle.
   * Same contract as `tailwindcss-react-grid-overlay` — bound to `--grid-*`.
   */
  visibleByDefault?: boolean;
  /** Controlled visibility. Pair with `onVisibleChange`. */
  visible?: boolean;
  /** Called after `g` or when the consumer toggles. */
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
}

/**
 * Column + baseline + margin overlay that lives **inside** `grid-page`.
 * Do not mount this on `document.body` — that is the classic misaligned overlay.
 */
export function GridOverlay({
  visibleByDefault = false,
  visible,
  onVisibleChange,
  className,
}: GridOverlayProps) {
  const [uncontrolledOn, setUncontrolledOn] = useState(visibleByDefault);
  const on = visible ?? uncontrolledOn;
  const [cols, setCols] = useState(12);
  const rootRef = useRef<HTMLDivElement>(null);

  const setOn = useCallback(
    (next: boolean) => {
      if (visible === undefined) setUncontrolledOn(next);
      onVisibleChange?.(next);
    },
    [visible, onVisibleChange],
  );

  useEffect(() => {
    const syncCols = () => {
      const host = rootRef.current?.parentElement ?? document.documentElement;
      setCols(readGridColumnCount(host));
    };
    syncCols();
    window.addEventListener("resize", syncCols);
    return () => window.removeEventListener("resize", syncCols);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!gridOverlayKeyShouldToggle(event)) return;
      event.preventDefault();
      setOn(!on);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, setOn]);

  useEffect(() => {
    setDocumentGridOn(on);
    return () => setDocumentGridOn(false);
  }, [on]);

  return (
    <div
      ref={rootRef}
      className={cn("grid-guides", on && "is-on", className)}
      aria-hidden
    >
      <div className="grid-guides-baseline" />
      <div className="grid-guides-cols">
        {Array.from({ length: cols }, (_, index) => (
          <div key={index} className="grid-guides-col">
            <span className="grid-guides-col-label">{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="grid-guides-margin grid-guides-margin-start" />
      <div className="grid-guides-margin grid-guides-margin-end" />
    </div>
  );
}
