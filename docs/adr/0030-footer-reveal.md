# ADR-0030 — Footer reveal

**Status:** Accepted  
**Date:** 2026-09-26

## Context

Marketing pages need a footer that sits under the page and uncovers as the reader reaches the end of the cover. The cover is at least one viewport tall. The footer sticks to the bottom of the viewport behind that cover and scrubs in across its own height.

## Decision

Ship **FooterReveal** as an organism under **Components/Layout**:

- Compounds **FooterReveal.Content** then **FooterReveal.Footer**. The root owns scroll progress and publishes it with `useFooterRevealProgress`.
- Root: `isolation: isolate`, `overflow-x: clip`, `overflow-y: visible`. Content: `z-index: 1`, `min-height: 100dvh`, page background (`bg-body`). Footer: `position: sticky; bottom: 0; z-index: -1`.
- Scrub, tied to `useScroll({ target: content, offset: ["end end", "end start"] })`: opacity 0→1, scale 0.9→1 (origin `50% 100%`), blur 6px→0. The input range ends at `footerRevealAt` = clamp(footerHeight / viewportHeight, 0.05, 0.95), measured with `ResizeObserver` and window `resize` in `useLayoutEffect`.
- `will-change` is `opacity` on the fade layer and `transform, filter` on the scale layer only while progress is strictly inside that range.
- `prefers-reduced-motion`: opacity 1, scale 1, blur 0, `will-change: auto`. No scrub.
- Field color is **`footerRevealFieldClasses`** (`bg-primary` / `text-primary-foreground`). Links on that field use **`footerRevealFieldLinkClasses`**. No new color token — primary / on-primary already describe a brand plane and its ink. **TextLink** stays prose on the page background.
- The scrollbar stays visible. `grid.css` already sets `scrollbar-gutter: stable` on `html`; that gutter can show the page background beside the field. Horizontal overflow is clipped on the isolate root so a full-bleed field does not open a second scrollbar. The sticky shell does not use a bare `footer` class name.
- `"use client"` on the module, and the library bundle banner, so Next App Router consumers can import it from a Server Component tree.

## Non-goals

- A second marketing footer organism. Footer contents are children of **FooterReveal.Footer**.
- Hiding or restyling the viewport scrollbar.
- Scroll-linked animation inside an arbitrary overflow container (the scrollport is the viewport).

## Consequences

Consuming apps paste **Components/Layout/FooterReveal → Pattern — marketing page**. Place **SiteNav** and `grid-page` in **Content**. Pass **`footerRevealFieldClasses`** on **Footer**.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0010 (grid, stable scrollbar gutter), ADR-0026 (intent taxonomy), ADR-0028 (SiteNav)
