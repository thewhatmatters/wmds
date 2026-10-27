import { useEffect, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode, type RefObject } from "react";
import { cn } from "../../../lib/cn";
import {
  inlinePillClasses,
  inlinePillMediaClasses,
  inlinePillNoMediaClasses,
  inlinePillPopInKeyframes,
  inlinePillPopInMaxSpread,
} from "./inlinePillStyles";

export { inlinePillPopInKeyframes } from "./inlinePillStyles";

/** Layout-only — margin or placement; not for colour, size or typography overrides. */
export type InlinePillLayoutClassName = string;

export interface InlinePillProps {
  /** The word or words in the pill: one or two short words. They stay part of the sentence. */
  children: ReactNode;
  /**
   * A small picture on the pill's left: an `<img alt="">`, a 3D render or an SVG. Decorative (the word
   * carries the meaning), so it's hidden from screen readers. Leave it out for a text-only pill.
   */
  media?: ReactNode;
  /** Layout-only: margin or placement. */
  className?: InlinePillLayoutClassName;
}

/**
 * A pill that sits inside running text and scales with it: a key word in a headline or a sentence, with
 * an optional picture on its left. Not a control — for a filter or a removable token use `Chip`; for a
 * status or category label use `Badge`.
 */
export function InlinePill({ children, media, className }: InlinePillProps): ReactElement {
  return (
    <span className={cn(inlinePillClasses, media == null && inlinePillNoMediaClasses, className)} data-inline-pill="">
      {media != null ? (
        <span aria-hidden className={inlinePillMediaClasses} data-inline-pill-media="">
          {media}
        </span>
      ) : null}
      {children}
    </span>
  );
}

/** `still`: no pop-in (off, reduced motion, or no IntersectionObserver). `pending`: hidden until in view. */
export type InlinePillsPopInState = "still" | "pending" | "done";

export interface InlinePillsPopIn<T extends HTMLElement> {
  /** Put on the element that holds the pills (the heading or its section). */
  ref: RefObject<T | null>;
  /** Spread onto the same element: `data-inline-pills`, which hides the pictures while pending. */
  "data-inline-pills": InlinePillsPopInState;
}

function msToken(name: string, fallback: number) {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Pops in the pictures of every `InlinePill` inside an element, one after another, the first time the
 * element is 40% in view. Uses the Web Animations API with the WMDS motion tokens
 * (`--duration-medium-max`, `--motion-beat`, `--ease-standard`), animates only transform and opacity,
 * and does nothing under `prefers-reduced-motion` or without IntersectionObserver.
 *
 * ```tsx
 * const popIn = useInlinePillsPopIn<HTMLHeadingElement>();
 * <h2 {...popIn}>We build <InlinePill media={…}>websites</InlinePill> …</h2>
 * ```
 */
export function useInlinePillsPopIn<T extends HTMLElement>(enabled = true): InlinePillsPopIn<T> {
  const ref = useRef<T>(null);
  const [state, setState] = useState<InlinePillsPopInState>("still");

  // Hide before the first paint, so the pictures don't flash in and then animate.
  useLayoutEffect(() => {
    if (enabled && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) setState("pending");
    else setState("still");
  }, [enabled]);

  useEffect(() => {
    const root = ref.current;
    if (state !== "pending" || !root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const media = [...root.querySelectorAll<HTMLElement>("[data-inline-pill-media]")];
        const duration = msToken("--duration-medium-max", 550);
        const stagger = Math.min(msToken("--motion-beat", 160), inlinePillPopInMaxSpread / Math.max(1, media.length - 1));
        const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-standard").trim() || "cubic-bezier(0.24, 1, 0.4, 1)";
        // fill: "backwards" holds each picture hidden through its delay, once the pending state lifts.
        media.forEach((element, i) =>
          element.animate(inlinePillPopInKeyframes, { duration, delay: 120 + i * stagger, easing, fill: "backwards" }),
        );
        setState("done");
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [state]);

  return { ref, "data-inline-pills": state };
}
