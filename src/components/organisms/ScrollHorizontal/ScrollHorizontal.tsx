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
  scrollHorizontalLeadFrame,
  scrollHorizontalNominalExpandMetrics,
  scrollHorizontalNominalMetrics,
  scrollHorizontalParseGap,
  scrollHorizontalPeerOpacity,
  scrollHorizontalPhaseProgress,
  scrollHorizontalReadFrame,
  scrollHorizontalReadMetrics,
  scrollHorizontalReadTranslateX,
  scrollHorizontalRestLeft,
  scrollHorizontalTranslateX,
} from "./scrollHorizontalMath";
import { ScrollHorizontalIntro } from "./ScrollHorizontalIntro";
import { ScrollHorizontalIntroContext } from "./scrollHorizontalIntroContext";
import {
  scrollHorizontalExpandFillClasses,
  scrollHorizontalExpandLayerClasses,
  scrollHorizontalExpandedSectionClasses,
  scrollHorizontalExpandedSlotClasses,
  scrollHorizontalHeadingClasses,
  scrollHorizontalIntroPanelClasses,
  scrollHorizontalIntroStickyClasses,
  scrollHorizontalIntroTrackClasses,
  scrollHorizontalIntroWindowClasses,
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
   * Ignored when `intro` is set — the intro eyebrow names the section instead.
   */
  heading?: ReactNode;
  /**
   * First panel of the track: a left-aligned statement, then the tiles.
   * Pass **ScrollHorizontal.Intro**. Scroll translates the panel off to the left.
   * Reduced motion renders it as a block above the native row. Replaces `heading`.
   */
  intro?: ReactNode;
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
 * The section box ends on that tile. Block padding after the section paints
 * the page background between the tile and a following footer.
 *
 * `prefers-reduced-motion` and `MotionConfig` `reducedMotion="always"` skip
 * the transform: the track height is auto, the window is not sticky, and the
 * row scrolls natively on the inline axis. With `expandLast`, the last tile
 * follows as a static `h-svh` section. `heading` is `sr-only` on the pinned
 * window and visible above that scroller.
 *
 * `intro` (**ScrollHorizontal.Intro**) is the first panel. Its left edge is the
 * page-grid content start (the same inset as `grid-page`), clear of the site
 * nav, with the tiles to its right. Vertical scroll carries that panel off the
 * left edge with the tiles. The eyebrow names the section. Reduced motion
 * stacks the same panel above the native row and keeps the inset.
 *
 * The server render and the hydration render both use the motion shell
 * (`data-reduce="false"`). The OS query is read in `useLayoutEffect`, before
 * paint. `motion-reduce:` classes cover that first paint without a markup mismatch.
 */
function ScrollHorizontalRoot({
  items,
  heading,
  intro,
  expandLast = false,
  expanded,
  className,
}: ScrollHorizontalProps) {
  const headingId = useId();
  const introLabelId = useId();
  const hasIntro = intro != null && intro !== false;
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
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
      const track = trackRef.current;
      if (hasIntro && track && sticky) {
        // Gap lives on the card row. The translate lives on the track.
        // Reading either element for both puts the clip on the pre-intro pitch.
        const metrics = scrollHorizontalReadFrame(
          sticky,
          item,
          row,
          window.innerWidth,
          window.innerHeight,
        );
        const shift = scrollHorizontalReadTranslateX(getComputedStyle(track).transform);
        const stickyRect = sticky.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const cardLeft = itemRect.left - shift - stickyRect.left;
        const rowGap = scrollHorizontalParseGap(getComputedStyle(row).columnGap);
        const pitch =
          metrics.cardWidth + (rowGap > 0 ? rowGap : metrics.pitch - metrics.cardWidth);
        const last = row.querySelector("li:last-child");
        const steps = Math.max(0, items.length - 1);
        const lastRest =
          last instanceof HTMLElement
            ? scrollHorizontalRestLeft(last, sticky, track)
            : cardLeft + steps * pitch;
        const lead = scrollHorizontalLeadFrame({ ...metrics, cardLeft, pitch }, lastRest, items.length);
        distance.set(lead.distance);
        frame.set(lead.frame);
        return;
      }

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
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [distance, frame, hasIntro, items.length]);

  const fadePeers = expandLast && !reduceMotion;
  const labelledBy = hasIntro ? introLabelId : heading ? headingId : undefined;

  const cards = items.map((item, index) => {
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
  });

  return (
    <section
      ref={rootRef}
      data-scroll-horizontal=""
      data-expand-last={expandLast ? "true" : "false"}
      data-reduce={reduceMotion ? "true" : "false"}
      data-has-intro={hasIntro ? "true" : "false"}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Projects"}
      className={cn(
        expandLast ? scrollHorizontalRootExpandClasses : scrollHorizontalRootClasses,
        className,
      )}
    >
      <div
        ref={stickyRef}
        className={cn(scrollHorizontalStickyClasses, hasIntro && scrollHorizontalIntroStickyClasses)}
      >
        {heading && !hasIntro ? (
          <div id={headingId} className={scrollHorizontalHeadingClasses}>
            {heading}
          </div>
        ) : null}
        {hasIntro ? (
          <motion.div
            ref={trackRef}
            data-scroll-horizontal-track=""
            className={scrollHorizontalIntroTrackClasses}
            style={reduceMotion ? undefined : { x }}
          >
            <motion.div
              data-scroll-horizontal-intro=""
              className={scrollHorizontalIntroPanelClasses}
              style={fadePeers ? { opacity: peerOpacity } : undefined}
            >
              <ScrollHorizontalIntroContext.Provider value={introLabelId}>
                {intro}
              </ScrollHorizontalIntroContext.Provider>
            </motion.div>
            <div className={scrollHorizontalIntroWindowClasses}>
              <ul ref={rowRef} className={scrollHorizontalRowClasses}>
                {cards}
              </ul>
            </div>
          </motion.div>
        ) : (
          <div className={scrollHorizontalWindowClasses}>
            <motion.ul
              ref={rowRef}
              className={scrollHorizontalRowClasses}
              style={reduceMotion ? undefined : { x }}
            >
              {cards}
            </motion.ul>
          </div>
        )}
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
          {expanded ? <div className={cn(scrollHorizontalExpandFillClasses, "z-10")}>{expanded}</div> : null}
        </div>
      ) : null}
    </section>
  );
}

export const ScrollHorizontal = Object.assign(ScrollHorizontalRoot, {
  Intro: ScrollHorizontalIntro,
});

export type { ScrollHorizontalIntroAction, ScrollHorizontalIntroProps } from "./ScrollHorizontalIntro";
