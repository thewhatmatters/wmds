"use client";

import { MotionConfigContext, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import {
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  scrollHorizontalDistance,
  scrollHorizontalItemColor,
  scrollHorizontalNominalMetrics,
  scrollHorizontalReadMetrics,
  scrollHorizontalTranslateX,
} from "./scrollHorizontalMath";
import {
  scrollHorizontalHeadingClasses,
  scrollHorizontalItemClasses,
  scrollHorizontalLabelClasses,
  scrollHorizontalRootClasses,
  scrollHorizontalRowClasses,
  scrollHorizontalStickyClasses,
  scrollHorizontalWindowClasses,
} from "./scrollHorizontalStyles";

/** Layout-only — width and margin. Do not restyle the cards here. */
export type ScrollHorizontalLayoutClassName = string;

export interface ScrollHorizontalItem {
  id: string;
  /** Accessible name. Rendered for assistive tech only (`sr-only`). */
  label: string;
  /**
   * CSS color for the solid tile. Pass a semantic token, for example
   * `var(--color-brand)`. Omit to cycle the placeholder palette.
   */
  color?: string;
}

export interface ScrollHorizontalProps {
  items: ScrollHorizontalItem[];
  /** Optional title. Stays pinned over the row while the gallery scrolls. */
  heading?: ReactNode;
  className?: ScrollHorizontalLayoutClassName;
}

/**
 * Horizontal gallery driven by vertical scroll. The track is 300svh. A sticky
 * svh window, one card wide and centered, holds the row. Scroll progress maps
 * to translateX from the first card centered to the last.
 *
 * `prefers-reduced-motion` and `MotionConfig` `reducedMotion="always"` skip
 * the transform: the track height is auto, the window is not sticky, and the
 * row scrolls natively on the inline axis.
 *
 * The server render and the hydration render both use the motion shell
 * (`data-reduce="false"`). The OS query is read in `useLayoutEffect`, before
 * paint. `motion-reduce:` classes cover that first paint without a markup mismatch.
 */
export function ScrollHorizontal({ items, heading, className }: ScrollHorizontalProps) {
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const distance = useMotionValue(0);
  // Server and the hydration render both allow motion. Reading matchMedia
  // during render would disagree with a reduced-motion client.
  const [prefersReduced, setPrefersReduced] = useState(false);
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = prefersReduced || reducedMotionConfig === "always";

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(() =>
    scrollHorizontalTranslateX(scrollYProgress.get(), distance.get(), false),
  );

  useLayoutEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const item = itemRef.current;
    const row = rowRef.current;
    if (!item || !row) {
      distance.set(0);
      return;
    }

    const measure = () => {
      const measured = scrollHorizontalReadMetrics(item, row);
      const nominal = scrollHorizontalNominalMetrics(window.innerWidth);
      const itemWidth = measured.itemWidth > 0 ? measured.itemWidth : nominal.itemWidth;
      const gap = measured.itemWidth > 0 ? measured.gap : nominal.gap;
      distance.set(scrollHorizontalDistance(items.length, itemWidth, gap));
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(item);
    observer.observe(row);
    return () => observer.disconnect();
  }, [distance, items.length]);

  return (
    <section
      ref={rootRef}
      data-scroll-horizontal=""
      data-reduce={reduceMotion ? "true" : "false"}
      aria-labelledby={heading ? headingId : undefined}
      aria-label={heading ? undefined : "Projects"}
      className={cn(scrollHorizontalRootClasses, className)}
    >
      <div className={scrollHorizontalStickyClasses}>
        {heading ? (
          <div id={headingId} className={scrollHorizontalHeadingClasses}>
            {heading}
          </div>
        ) : null}
        <div className={scrollHorizontalWindowClasses}>
          <motion.ul
            ref={rowRef}
            className={scrollHorizontalRowClasses}
            style={reduceMotion ? undefined : { x }}
          >
            {items.map((item, index) => (
              <li
                key={item.id}
                ref={index === 0 ? itemRef : undefined}
                className={scrollHorizontalItemClasses}
                style={
                  {
                    "--scroll-horizontal-color": scrollHorizontalItemColor(item.color, index),
                  } as CSSProperties
                }
              >
                <span className={scrollHorizontalLabelClasses}>{item.label}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
