# ADR-0036 — Scroll horizontal gallery

**Status:** Accepted  
**Date:** 2026-09-27

## Context

The marketing page needs a project gallery directly under the hero. Vertical scroll should move a horizontal row from the first card centered to the last card centered, then release into the rest of the page. A second carousel organism is the wrong fit: this is one full-bleed scroll track, not a paged control.

The card geometry in the reference is 400×500 with a 12px radius and a 30px gap, and 280×350 with a 15px gap below 600px. WMDS already has the pieces those numbers snap to. `--radius-xl` (`rounded-xl`) is 0.75rem (12px). The spacing baseline is 8px (`--spacing` stays 4px). 30px is equidistant from 28px (`gap-7`) and 32px (`gap-8`); 32px is the one on the baseline. 15px is 1px from 16px (`gap-4`). The compact cutoff at 600px is the `sm` breakpoint (640px). Sticky height uses `svh`, the same unit as the hero, instead of `vh`.

## Decision

Ship **ScrollHorizontal** as an organism under **Components/Layout**:

- `items`: `{ id, label, color? }[]`. Each card is a solid fill. `label` is the accessible name (`sr-only`), not visible copy. `color` is a CSS color; pass a semantic token (`var(--color-*)`). Omit `color` to cycle `--color-brand`, `--color-brand-soft`, `--color-primary`, `--color-info-muted`, and `--color-accent`.
- `heading`: optional slot, pinned over the row. `className` is layout only, on the root.
- The root is a `300svh` track. `useScroll({ target, offset: ['start start', 'end end'] })` drives `useTransform`. A sticky `h-svh` viewport clips the inline axis. Inside it, a centered window is one card wide (400px, 280px below `sm`), so progress 0 shows the first card centered.
- Travel is `(items.length - 1) * (itemWidth + gap)` via `scrollHorizontalDistance`. A layout effect measures the first card and the row's `column-gap`. Until that measurement is non-zero, the pitch falls back to `scrollHorizontalNominalMetrics(viewportWidth)`.
- From `sm`: 400×500, `gap-8`. Below `sm`: 280×350, `gap-4`. Radius `rounded-xl`. The fill is `background-color: var(--scroll-horizontal-color)`.
- The five marketing placeholders set that cycle explicitly: brand navy (`#011272`, `--color-brand`), `--color-brand-soft`, `--color-primary`, `--color-info-muted`, and `--color-accent`.
- `scrollHorizontalShell(true)` is the reduced branch: container height `auto`, not sticky, `overflow-x: auto`, translate 0. Tailwind `motion-reduce:` applies that shell for the OS preference without a server/client markup split. `data-reduce="true"` repeats it for `MotionConfig` `reducedMotion="always"`. Vertical padding is `py-12` (48px, nearest baseline step to 50px). The scroller uses `scroll-fade-x`.
- SSR and hydration render `data-reduce="false"`. `useState` starts at false. `useLayoutEffect` reads `matchMedia` and updates before paint, the same order **RiveHand** uses so the entrance pose does not hydrate into a different transform. `scrollHorizontalTranslateX(..., true)` is 0.

`"use client"` on the module.

## Non-goals

- Motion+.
- A paged **Carousel**, drag snap, or autoplay.
- New color or radius tokens.
- Click targets on the cards.
- Card photography, visible captions, and a bottom gradient. Tiles are placeholders.

## Consequences

Consuming apps paste **Components/Layout/ScrollHorizontal → Pattern — project gallery**. **Components/Layout/HeroTileStack → Pattern — marketing hero** and **Components/Layout/FooterReveal → Pattern — marketing hero** place the gallery directly under the hero, then the rest of the page. The five tiles are solid token-color placeholders. **SiteNav** is unchanged.

## References

- ADR-0002 (organism tier), ADR-0003 (mobile-first `sm`), ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0026 (Layout), ADR-0032 (marketing hero)
