# ADR-0030 — Footer reveal

**Status:** Accepted  
**Date:** 2026-09-26

## Context

Marketing pages need a footer that sits under the page and uncovers as the reader reaches the end of the cover. The cover is at least one viewport tall. The footer sticks to the bottom of the viewport behind that cover and scrubs in across its own height.

## Decision

Ship **FooterReveal** as an organism under **Components/Layout**:

- Compounds **FooterReveal.Content** then **FooterReveal.Footer**. The root owns scroll progress and publishes it with `useFooterRevealProgress`.
- Root: `isolation: isolate`, overflow visible on both axes. Content: `z-index: 1`, `min-height: 100dvh`, page background (`bg-body`), overflow visible. An `overflow-x: clip` ancestor would keep **GridOverlay** column guides inside `main`. Those page guides cover the hero and stop at the footer's in-flow top. The footer field paints the same tracks (`footer-reveal-guides`, visible with `html.grid-on`) at `z-index: 0`, under the field content at `z-index: 1`, so the stripes stay on the navy and behind the headline and CTA. Footer: `position: sticky; bottom: 0; z-index: -1`. The footer field clips the inline axis; the brand panel clips the wordmark's bottom bleed.
- Scrub, tied to `useScroll({ target: content, offset: ["end end", "end start"] })` and `useTransform`: opacity 0→1, scale 0.9→1 (origin `50% 100%`), blur 12px→0. The input range ends at `footerRevealAt` = clamp(footerHeight / viewportHeight, 0.05, 0.95), measured with `ResizeObserver` and window `resize` in `useLayoutEffect`.
- `will-change` is `opacity` on the fade layer and `transform, filter` on the scale layer only while progress is strictly inside that range.
- `prefers-reduced-motion`: opacity 1, scale 1, blur 0, `will-change: auto`. No scrub. The server snapshot is the same sharp state (`useSyncExternalStore`, server snapshot `true`). Motion's `useReducedMotion()` is `null` during SSR; treating that as motion allowed leaves `blur(12px)` in the HTML.
- Field color is **`footerRevealFieldClasses`** (`bg-brand` / `text-on-brand`). `--color-brand` is `#011272` in both themes. White on that navy reports **15.8:1**. Dark mode keeps the field navy; ink stays `--color-on-brand` (white) because dark `--color-background-surface` (`#262626`) is about **1:1** on navy. Links on that field use **`footerRevealFieldLinkClasses`** (solid underline, on-brand ink). **TextLink** stays prose on the page background. The wordmark uses **`--color-brand-soft`** (40% white on the navy, about **3.4:1**). A 20% white mix (about **1.7:1**) vanishes into the field.
- **FooterReveal.Brand** is the marketing footer: centered display headline, **Button** `role="inverse"` (`bg-on-brand` / `text-brand`; hover `--color-on-brand-hover`), an underlined `socialLinks` row, and a decorative wordmark. The CTA is a `<button type="button">` driven by `onCtaClick` (it opens the project modal; there is no default route). `ctaHref`, when passed, renders that same chrome as an anchor. `https` social links open in a new tab with `rel="noopener"`. The wordmark is `aria-hidden`. Its font-size is `100cqi / --footer-wordmark-em`, where the em count is the measured advance width of the word, so the whole word spans the footer edge to edge at every viewport width. It stays on the bottom edge (cropped vertically by the brand panel) and does not widen the page.
- **FooterReveal.Ruled** is a second compound on the same organism, not a second footer organism. It is a ruled grid on the page background: **`footerRevealRuledFieldClasses`** (`bg-body` / `text-brand`). Rules are 1px `border-brand`. Horizontal rules (`border-t` on the first band, `border-b` on every band) span the footer field. The vertical edges (`border-x`) sit on the outer column edges, inset by `--grid-margin` from the page grid box. Content, internal dividers, and the wordmark stay inside that border. Content is props: copyright, blurb, mark, links (Services, Resources, About), email, services, socials, wordmark, and credit. Below `md` the bands stack; the nav stays one list; social cells stay one row. The wordmark reuses the measured `100cqi / --footer-wordmark-em` fit. There is no cropped WM row. The credit bar keeps the small `WM` mark and `Created by WhatMatters 2024–2026`. Plus glyphs are decorative and show from `md`. Social cells are icon-only anchors (`ButtonIcon`) with accessible names and a brand focus ring. `https` links open in a new tab. Lucide has no brand marks for X, Dribbble, Instagram, or LinkedIn; the defaults use X, CircleDot, Camera, and Briefcase. Sparkle is Lucide's sparkle. In the dark theme the field repaints to `--color-on-brand` because brand navy on the dark body is under 3:1. **FooterReveal.Brand** is unchanged. Paste **Pattern — ruled grid footer**. **Pattern — marketing hero ruled grid** places it under the existing hero. The gallery still meets the footer (`grid-page` with `!py-0`).
- The scrollbar stays visible. `grid.css` already sets `scrollbar-gutter: stable` on `html`; that gutter can show the page background beside the field. The wordmark is clipped by the brand panel and the footer field, not by the isolate root, so a too-wide measure cannot widen the page. The sticky shell does not use a bare `footer` class name.
- `"use client"` on the module, and the library bundle banner, so Next App Router consumers can import it from a Server Component tree.

## Update — no cropped WM row

**Date:** 2026-09-28

**FooterReveal.Ruled** no longer has a crop row. The oversized `WM` letterforms were taller than a short viewport, so the footer ran past the bottom edge and the credit was cut off. The bands are identity, links, contact, social cells, the fitted WhatMatters wordmark, then the credit bar. The credit bar keeps the small `WM` mark and the full line `Created by WhatMatters 2024–2026`. Horizontal rules still span the footer field. Vertical edges still sit on the outer column edges. **FooterReveal.Brand** still crops its own wordmark at the bottom of the navy panel.

## Update — footer nav matches the site nav

**Date:** 2026-09-29

**FooterReveal.Ruled** nav is one list, in order: Services, Resources, About. Rules, randy@whatmatters.so, and the corner plus marks stay.

## Update — centered stack, fitted wordmark

**Date:** 2026-09-29

**FooterReveal.Ruled** follows a centered stack on the cream field (`bg-body` / `text-brand`, `#011272`). The nav is Services, Resources, About, centered, each a **TextLink**. The list sets Geist sans (the heading and body face) so the links inherit it: `--font-size-4xl` below `sm`, `4rem` from `sm`. No type token is 4rem. Those three links set `!text-brand` (`#011272`) because **TextLink**'s `text-fg` would otherwise win. **TextLink** keeps its solid underline, medium weight, and focus ring. They are sentence case, not mono and not uppercase. The WhatMatters wordmark is fitted to the footer width (`100cqi` divided by the measured advance width) with a 12px inset so side-bearing ink stays inside the viewport at 390, 1440, and 2560. The frame does not use `overflow: hidden` and the word does not translate off the bottom edge. The quiet row is the WM mark with WhatMatters © 2026, randy@whatmatters.so, and Created by WhatMatters 2024–2026. Below `md` that row stacks. The two-column rules, the social cells, the services line, and the blurb are gone. **FooterReveal.Brand** still crops its own wordmark on the navy field. The reveal scrub is unchanged.

## Update — ruled field is at least one viewport

**Date:** 2026-09-30

**FooterReveal.Ruled** is at least `100vh` on every mount. The floor is `min-h-[100vh]` on **`footerRevealRuledFieldClasses`** and **`footerRevealRuledRootClasses`**, not a page override. Content taller than the viewport grows the field. The nav, the fitted wordmark, and the quiet meta row stay visible. **FooterReveal.Brand** is unchanged.

## Non-goals

- A second marketing footer organism. **FooterReveal.Brand** and **FooterReveal.Ruled** are compounds of this one. Other footer contents stay children of **FooterReveal.Footer**.
- Hiding or restyling the viewport scrollbar.
- Scroll-linked animation inside an arbitrary overflow container (the scrollport is the viewport).

## Consequences

Consuming apps paste **Components/Layout/FooterReveal → Pattern — marketing page**. Place **SiteNav** and `grid-page` (or the marketing hero) in **Content**. Pass **`footerRevealFieldClasses`** on **Footer** and compose **FooterReveal.Brand** for the brand plane. **Pattern — marketing hero** puts the hero above that footer.

## References

- ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0010 (grid, stable scrollbar gutter), ADR-0026 (intent taxonomy), ADR-0028 (SiteNav)
