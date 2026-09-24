import { useEffect, useRef, useState, type RefObject } from "react";
import { useScrollThreshold } from "../../../lib/useScrollThreshold";
import {
  siteNavDefaultCollapseRatio,
  type SiteNavPlacement,
  type SiteNavState,
} from "./siteNavStyles";

export interface UseSiteNavCollapseOptions {
  collapseAt?: number;
  scrollContainer?: RefObject<HTMLElement | null>;
  controlledState?: SiteNavState;
  placement: SiteNavPlacement;
  onStateChange?: (state: SiteNavState) => void;
}

/**
 * Owns expanded → compact for SiteNav: half-scrollport (or explicit px), hysteresis,
 * and controlled-state override. Scroll listening is off for static `inline` specimens.
 */
export function useSiteNavCollapse({
  collapseAt,
  scrollContainer,
  controlledState,
  placement,
  onStateChange,
}: UseSiteNavCollapseOptions): { state: SiteNavState; compact: boolean } {
  const thresholdPx = useCollapseThresholdPx(collapseAt, scrollContainer);
  const scrolled = useScrollThreshold(thresholdPx, {
    container: scrollContainer,
    disabled: controlledState != null || (placement === "inline" && scrollContainer == null),
  });
  const state: SiteNavState = controlledState ?? (scrolled ? "compact" : "expanded");

  const previousState = useRef(state);
  useEffect(() => {
    if (previousState.current !== state) {
      previousState.current = state;
      onStateChange?.(state);
    }
  }, [state, onStateChange]);

  return { state, compact: state === "compact" };
}

/**
 * Explicit `collapseAt` px, or half the scrollport height.
 * Until measured, returns `Infinity` so the pill does not flash on mount.
 */
function useCollapseThresholdPx(
  collapseAt: number | undefined,
  container?: RefObject<HTMLElement | null>,
): number {
  const [measured, setMeasured] = useState<number | null>(null);

  useEffect(() => {
    if (collapseAt != null) return;

    const measure = () => {
      const root = container?.current;
      const height =
        root?.clientHeight ??
        (typeof window !== "undefined" ? window.innerHeight : 0);
      setMeasured(Math.round(height * siteNavDefaultCollapseRatio));
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    const root = container?.current;
    let observer: ResizeObserver | undefined;
    if (root != null && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(root);
    }
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [collapseAt, container]);

  if (collapseAt != null) return collapseAt;
  return measured ?? Number.POSITIVE_INFINITY;
}
