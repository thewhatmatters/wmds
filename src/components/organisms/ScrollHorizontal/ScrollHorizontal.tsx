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
  scrollHorizontalExpandAmount,
  scrollHorizontalExpandClip,
  scrollHorizontalExpandedOpacity,
  scrollHorizontalHorizontalEnd,
  scrollHorizontalItemColor,
  scrollHorizontalNominalExpandMetrics,
  scrollHorizontalNominalMetrics,
  scrollHorizontalPeerOpacity,
  scrollHorizontalPhaseProgress,
  scrollHorizontalReadFrame,
  scrollHorizontalReadMetrics,
  scrollHorizontalTranslateX,
} from "./scrollHorizontalMath";
import {
  scrollHorizontalExpandLayerClasses,
  scrollHorizontalExpandedSectionClasses,
  scrollHorizontalExpandedSlotClasses,
  scrollHorizontalHeadingClasses,
  scrollHorizontalItemClasses,
  scrollHorizontalLabelClasses,
  scrollHorizontalRootClasses,
  scrollHorizontalRootExpandClasses,
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
  /**
   * Optional section name. `sr-only` while the window is pinned (it stays the
   * accessible name). Visible above the row when motion is reduced.
   */
  heading?: ReactNode;
  /**
   * After the last card is centered, keep the window pinned and grow that card
   * until it fills the viewport. Default off — the track releases on the last card.
   */
  expandLast?: boolean;
  /**
   * Content for the full-bleed last tile. Mounted on the motion layer and, for
   * reduced motion, in the static section. One of those hosts is hidden.
   */
  expanded?: ReactNode;
  className?: ScrollHorizontalLayoutClassName;
}

/**
 * Horizontal gallery driven by vertical scroll. The track is 300svh. A sticky
 * svh window, one card wide and centered, holds the row. Scroll progress maps
 * to translateX from the first card centered to the last.
 *
 * `expandLast` lengthens the track to 400svh. The horizontal travel still uses
 * the first two pinned viewports. The third grows the last tile with a
 * clip-path on a full-viewport layer, from the centered card to inset 0, and
 * takes the radius to 0. The window then releases, so that tile scrolls away.
 *
 * `prefers-reduced-motion` and `MotionConfig` `reducedMotion="always"` skip
 * the transform: the track height is auto, the window is not sticky, and the
 * row scrolls natively on the inline axis. With `expandLast`, the last tile
 * follows as a static `h-svh` section. `heading` is `sr-only` on the pinned
 * window and visible above that scroller.
 *
 * The server render and the hydration render both use the motion shell
 * (`data-reduce="false"`). The OS query is read in `useLayoutEffect`, before
 * paint. `motion-reduce:` classes cover that first paint without a markup mismatch.
 */
export function ScrollHorizontal({
  items,
  heading,
  expandLast = false,
  expanded,
  className,
}: ScrollHorizontalProps) {
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const distance = useMotionValue(0);
  const frame = useMotionValue(scrollHorizontalNominalExpandMetrics(1440, 900));
  // Server and the hydration render both allow motion. Reading matchMedia
  // during render would disagree with a reduced-motion client.
  const [prefersReduced, setPrefersReduced] = useState(false);
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = prefersReduced || reducedMotionConfig === "always";
  const horizontalEnd = scrollHorizontalHorizontalEnd(expandLast);
  const lastIndex = Math.max(0, items.length - 1);
  const lastItem = items[lastIndex];
  const lastColor = lastItem ? scrollHorizontalItemColor(lastItem.color, lastIndex) : "transparent";

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(() =>
    scrollHorizontalTranslateX(
      scrollHorizontalPhaseProgress(scrollYProgress.get(), horizontalEnd),
      distance.get(),
      false,
    ),
  );

  const clipPath = useTransform(() => {
    if (!expandLast) return "inset(0px)";
    const progress = scrollYProgress.get();
    return scrollHorizontalExpandClip(
      scrollHorizontalPhaseProgress(progress, horizontalEnd),
      scrollHorizontalExpandAmount(progress, horizontalEnd),
      frame.get(),
      items.length,
    );
  });

  const peerOpacity = useTransform(() =>
    scrollHorizontalPeerOpacity(
      expandLast ? scrollHorizontalExpandAmount(scrollYProgress.get(), horizontalEnd) : 0,
    ),
  );

  const expandedOpacity = useTransform(() =>
    scrollHorizontalExpandedOpacity(
      expandLast ? scrollHorizontalExpandAmount(scrollYProgress.get(), horizontalEnd) : 0,
    ),
  );

  const slotPointerEvents = useTransform(expandedOpacity, (opacity) =>
    opacity > 0.9 ? "auto" : "none",
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
    const sticky = stickyRef.current;
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
      if (sticky) {
        frame.set(
          scrollHorizontalReadFrame(sticky, item, row, window.innerWidth, window.innerHeight),
        );
      }
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(item);
    observer.observe(row);
    if (sticky) observer.observe(sticky);
    return () => observer.disconnect();
  }, [distance, frame, items.length]);

  const fadePeers = expandLast && !reduceMotion;

  return (
    <section
      ref={rootRef}
      data-scroll-horizontal=""
      data-expand-last={expandLast ? "true" : "false"}
      data-reduce={reduceMotion ? "true" : "false"}
      aria-labelledby={heading ? headingId : undefined}
      aria-label={heading ? undefined : "Projects"}
      className={cn(
        expandLast ? scrollHorizontalRootExpandClasses : scrollHorizontalRootClasses,
        className,
      )}
    >
      <div ref={stickyRef} className={scrollHorizontalStickyClasses}>
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
            {items.map((item, index) => {
              const color = scrollHorizontalItemColor(item.color, index);
              const isPeer = fadePeers && index !== lastIndex;
              if (isPeer) {
                return (
                  <motion.li
                    key={item.id}
                    ref={index === 0 ? itemRef : undefined}
                    className={scrollHorizontalItemClasses}
                    style={
                      {
                        "--scroll-horizontal-color": color,
                        opacity: peerOpacity,
                      } as unknown as CSSProperties
                    }
                  >
                    <span className={scrollHorizontalLabelClasses}>{item.label}</span>
                  </motion.li>
                );
              }
              return (
                <li
                  key={item.id}
                  ref={index === 0 ? itemRef : undefined}
                  className={scrollHorizontalItemClasses}
                  style={
                    {
                      "--scroll-horizontal-color": color,
                    } as CSSProperties
                  }
                >
                  <span className={scrollHorizontalLabelClasses}>{item.label}</span>
                </li>
              );
            })}
          </motion.ul>
        </div>
        {expandLast && lastItem ? (
          <motion.div
            aria-hidden="true"
            data-scroll-horizontal-expanded=""
            className={scrollHorizontalExpandLayerClasses}
            style={{
              backgroundColor: lastColor,
              clipPath: reduceMotion ? "none" : clipPath,
            }}
          />
        ) : null}
        {expandLast && expanded ? (
          <motion.div
            data-scroll-horizontal-slot=""
            className={scrollHorizontalExpandedSlotClasses}
            style={reduceMotion ? undefined : { opacity: expandedOpacity, pointerEvents: slotPointerEvents }}
          >
            {expanded}
          </motion.div>
        ) : null}
      </div>
      {expandLast && lastItem ? (
        <div
          data-scroll-horizontal-expanded=""
          className={scrollHorizontalExpandedSectionClasses}
          style={
            {
              "--scroll-horizontal-color": lastColor,
              backgroundColor: "var(--scroll-horizontal-color)",
            } as CSSProperties
          }
        >
          <span className={scrollHorizontalLabelClasses}>{lastItem.label}</span>
          {expanded ? <div className="absolute inset-0 z-10">{expanded}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
