# ADR-0043: Carousel

**Status:** Accepted
**Date:** 2026-10-07

## Context

The WhatMatters site's About page has a strip of work images. With no carousel in WMDS, the site built it from a native scroll-snap list with `scroll-fade-x` and an outlined **Card** per image: no progress indicator, and no drag on desktop. **ScrollHorizontal** does not fit — it is a sticky gallery driven by vertical scroll. **Carousel** has been in `plannedExports` since ADR-0002.

The reference is Motion's carousel with a progress scrubber: a row of image tiles dragged sideways, with a slim track under it whose filled part shows how far along the row is and can be dragged. That example is built on the paid Motion+ Carousel component, so its source is not used. WMDS builds its own on the open `motion` package, already a peer dependency.

## Decision

Ship **Carousel** as an organism (the tier ADR-0005 gave it): one component with **Carousel.Item** children, and the scrubber as a prop.

- **The row is a native scroller, not a dragged transform.** Touch swipes, trackpad and shift-wheel scrolling, focus scrolling an item into view, right-to-left, and `scroll-fade-x` all come from the browser. On top of it, Motion values drive what the browser does not give a mouse: the pointer drag, the glide after it (`inertia`), the soft stop at each end (the track shifts by half the overscroll and springs back), and animated moves for the keys and the scrubber (`motionTransitionProp("medium")`). `useMotionValue` holds the driven position, `useMotionValueEvent` writes it to `scrollLeft`, `useTransform` turns an overscroll into the track's shift. A dragged transform, as in the reference, would have meant rebuilding every one of the native behaviours.
- **Snap is CSS scroll snap, switched off while the row is being moved.** `snap` (default on) sets mandatory snap to each item's leading edge, which is what a touch or trackpad scroll settles on. While a pointer or an animation moves the row, snap is off — a browser re-snaps every programmatic scroll, which would fight each step — and the glide's target is rounded to the nearest item edge instead.
- **One component, scrubber as a prop.** `progress` is `center` (default), `start`, `full`, or `none`. A separate `Carousel.Progress` part was not adopted: the scrubber has one place (under the row) and three widths, and a prop keeps pasted code to the row and its items (pattern-first, ADR-0004). The shorter tracks are full width on phones.
- **The scrubber is hidden from assistive tech and is not a tab stop.** The row is a labelled region and the tab stop; Left and Right move one item, Home and End go to the ends, and each item is a group named by its place ("2 of 4"). A `role="slider"` under it would be a second tab stop for the same position, announcing a percentage beside items that already say where they are. Pointer users get the scrubber; a press on its track moves the row without a drag (WCAG 2.5.7). Its hit area is 44px tall around a 4px track.
- **No previous and next buttons in this version.** The reference has none, and the row, the keys, and the scrubber cover every input. They can be added later as a prop without changing the rest.
- **Item width is a share of the row.** `itemWidth` is a percentage — one number or `{ base, sm, md, lg }` — written as custom properties and resolved with container query units against the component's own width, so it is the same on the server and does not change when `bleed` widens the scroller. The gap is the grid gutter.
- **`bleed` is measured.** The row's offsets from the page edges are measured and written as custom properties; the scroller's negative margins and the track's padding use them, so items still start on the grid and nothing scrolls the page sideways (`100vw` would, where scrollbars take space).
- **The scrubber keeps its space when every item fits.** It turns invisible, not absent, so the page under it does not move when the row starts or stops overflowing — after hydration, a resize, or an image load. `progress="none"` removes it.
- **Reduced motion.** No glide, no overscroll shift, no animated settle: a drag, a key, or a press on the track moves the row at once.

## Consequences

A strip of tiles is one component and a paste of **Pattern — image carousel**. The site's hand-built strip goes. Motion's inertia is used with its default physics — there is no WMDS token for a glide — while every timed move reads the motion tokens. Where scroll-driven animations are not supported, `scroll-fade-x` is static; the component clears the fade on an edge that has nothing clipped.

## References

- ADR-0002, ADR-0004, ADR-0005, ADR-0008, ADR-0036
