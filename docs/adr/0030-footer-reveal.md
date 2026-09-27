# ADR-0030 — Footer reveal

**Status:** Accepted  
**Date:** 2026-09-26

## Context

Marketing pages need a footer that sits under the page and uncovers as the reader reaches the end of the cover. The cover is at least one viewport tall. The footer sticks to the bottom of the viewport behind that cover and scrubs in across its own height.

## Decision

Ship **FooterReveal** as an organism under **Components/Layout**:

- Compounds **FooterReveal.Content** then **FooterReveal.Footer**. The root owns scroll progress and publishes it with `useFooterRevealProgress`.
- Root: `isolation: isolate`, overflow visible on both axes. Content: `z-index: 1`, `min-height: 100dvh`, page background (`bg-body`), overflow visible. An `overflow-x: clip` ancestor would keep **GridOverlay** column guides inside `main`. Footer: `position: sticky; bottom: 0; z-index: -1`. The footer field clips the inline axis; the brand panel clips the wordmark.
- Scrub, tied to `useScroll({ target: content, offset: ["end end", "end start"] })` and `useTransform`: opacity 0→1, scale 0.9→1 (origin `50% 100%`), blur 12px→0. The input range ends at `footerRevealAt` = clamp(footerHeight / viewportHeight, 0.05, 0.95), measured with `ResizeObserver` and window `resize` in `useLayoutEffect`.
- `will-change` is `opacity` on the fade layer and `transform, filter` on the scale layer only while progress is strictly inside that range.
- `prefers-reduced-motion`: opacity 1, scale 1, blur 0, `will-change: auto`. No scrub. The server snapshot is the same sharp state (`useSyncExternalStore`, server snapshot `true`). Motion's `useReducedMotion()` is `null` during SSR; treating that as motion allowed leaves `blur(12px)` in the HTML.
- Field color is **`footerRevealFieldClasses`** (`bg-brand` / `text-on-brand`). `--color-brand` is `#011272` in both themes. White on that navy reports **15.8:1**. Dark mode keeps the field navy; ink stays `--color-on-brand` (white) because dark `--color-background-surface` (`#262626`) is about **1:1** on navy. Links on that field use **`footerRevealFieldLinkClasses`** (solid underline, on-brand ink). **TextLink** stays prose on the page background. The wordmark uses **`--color-brand-soft`** (40% white on the navy, about **3.4:1**). A 20% white mix (about **1.7:1**) vanishes into the field.
- **FooterReveal.Brand** is the marketing footer: centered display headline, **Button** `role="inverse"` (`bg-on-brand` / `text-brand`; hover `--color-on-brand-hover`), an underlined `socialLinks` row, and a decorative wordmark. The CTA is a `<button type="button">` driven by `onCtaClick` (it opens the project modal; there is no default route). `ctaHref`, when passed, renders that same chrome as an anchor. `https` social links open in a new tab with `rel="noopener"`. The wordmark is `aria-hidden`, sized with a `vw` clamp, shifted off the inline edge, and cropped by the panel so it does not widen the page.
- The scrollbar stays visible. `grid.css` already sets `scrollbar-gutter: stable` on `html`; that gutter can show the page background beside the field. The wordmark is clipped by the brand panel and the footer field, not by the isolate root, so it does not widen the page. The sticky shell does not use a bare `footer` class name.
- `"use client"` on the module, and the library bundle banner, so Next App Router consumers can import it from a Server Component tree.

## Non-goals

- A second marketing footer organism. **FooterReveal.Brand** is a compound of this one. Other footer contents stay children of **FooterReveal.Footer**.
- Hiding or restyling the viewport scrollbar.
- Scroll-linked animation inside an arbitrary overflow container (the scrollport is the viewport).

## Consequences

Consuming apps paste **Components/Layout/FooterReveal → Pattern — marketing page**. Place **SiteNav** and `grid-page` (or the marketing hero) in **Content**. Pass **`footerRevealFieldClasses`** on **Footer** and compose **FooterReveal.Brand** for the brand plane. **Pattern — marketing hero** puts the hero above that footer.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0010 (grid, stable scrollbar gutter), ADR-0026 (intent taxonomy), ADR-0028 (SiteNav)
