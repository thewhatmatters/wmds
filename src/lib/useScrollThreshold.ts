import { useEffect, useState, type RefObject } from "react";

export interface UseScrollThresholdOptions {
  /**
   * Scroll container to observe. Defaults to the window / document scroller.
   * Pass a ref when the page scrolls inside an element (e.g. a demo frame).
   */
  container?: RefObject<HTMLElement | null>;
  /**
   * Pixels of slack before flipping back below the threshold — prevents flicker
   * when the scroll position hovers around `threshold`. Default: `8`.
   */
  hysteresis?: number;
  /** Skip listening (e.g. when a controlled state is supplied). Default: `false`. */
  disabled?: boolean;
}

function readScrollTop(container?: HTMLElement | null): number {
  if (container) return container.scrollTop;
  if (typeof window === "undefined") return 0;
  return window.scrollY ?? document.documentElement.scrollTop ?? 0;
}

/**
 * `true` once the scroller has moved `threshold`px or more down the page.
 * Passive `scroll` listener throttled to one read per frame; SSR-safe (starts `false`).
 * Used by **SiteNav** to reveal the compact pill after scroll past half the viewport
 * (or an explicit `collapseAt` px override).
 */
export function useScrollThreshold(
  threshold: number,
  { container, hysteresis = 8, disabled = false }: UseScrollThresholdOptions = {},
): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    const target: HTMLElement | Window = container?.current ?? window;
    let frame = 0;

    const evaluate = () => {
      frame = 0;
      const top = readScrollTop(container?.current);
      setPassed((previous) => {
        if (previous) return top > Math.max(0, threshold - hysteresis);
        return top >= threshold;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(evaluate);
    };

    evaluate();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold, hysteresis, disabled, container]);

  return passed;
}
