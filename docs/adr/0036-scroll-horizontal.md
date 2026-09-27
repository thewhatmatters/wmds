# ADR-0036 — Scroll horizontal gallery

**Status:** Accepted  
**Date:** 2026-09-27

## Context

The marketing page needs a project gallery directly under the hero. Vertical scroll should move a horizontal row from the first card centered to the last card centered, then release into the rest of the page. A second carousel organism is the wrong fit: this is one full-bleed scroll track, not a paged control.

The card geometry in the reference is 400×500 with a 12px radius and a 30px gap, and 280×350 with a 15px gap below 600px. WMDS already has the pieces those numbers snap to. `--radius-xl` (`rounded-xl`) is 0.75rem (12px). The spacing baseline is 8px (`--spacing` stays 4px). 30px is equidistant from 28px (`gap-7`) and 32px (`gap-8`); 32px is the one on the baseline. 15px is 1px from 16px (`gap-4`). The compact cutoff at 600px is the `sm` breakpoint (640px). Sticky height uses `svh`, the same unit as the hero, instead of `vh`.

## Decision

Ship **ScrollHorizontal** as an organism under **Components/Layout**:

- `items`: `{ id, label, color? }[]`. Each card is a solid fill. `label` is the accessible name (`sr-only`), not visible copy. `color` is a CSS color; pass a semantic token (`var(--color-*)`). Omit `color` to cycle `--color-brand`, `--color-brand-soft`, `--color-primary`, `--color-info-muted`, and `--color-accent`.
- `heading`: optional section name. `sr-only` while the window is pinned, so it does not sit under the floating site nav. Visible above the row when motion is reduced. `className` is layout only, on the root.
- The root is a `300svh` track (`shrink-0`, so a flex parent does not collapse it). `useScroll({ target, offset: ['start start', 'end end'] })` drives `useTransform`. A sticky `h-svh` viewport clips the inline axis. Inside it, a centered window is one card wide (400px, 280px below `sm`), so progress 0 shows the first card centered.
- Travel is `(items.length - 1) * (itemWidth + gap)` via `scrollHorizontalDistance`. A layout effect measures the first card and the row's `column-gap`. Until that measurement is non-zero, the pitch falls back to `scrollHorizontalNominalMetrics(viewportWidth)`.
- From `sm`: 400×500, `gap-8`. Below `sm`: 280×350, `gap-4`. Radius `rounded-xl`. The fill is `background-color: var(--scroll-horizontal-color)`.
- The five marketing placeholders set that cycle explicitly: brand navy (`#011272`, `--color-brand`), `--color-brand-soft`, `--color-primary`, `--color-info-muted`, and `--color-accent`.
- `scrollHorizontalShell(true)` is the reduced branch: container height `auto`, not sticky, `overflow-x: auto`, translate 0. Tailwind `motion-reduce:` applies that shell for the OS preference without a server/client markup split. `data-reduce="true"` repeats it for `MotionConfig` `reducedMotion="always"`. Vertical padding is `py-12` (48px, nearest baseline step to 50px). The scroller uses `scroll-fade-x`.
- SSR and hydration render `data-reduce="false"`. `useState` starts at false. `useLayoutEffect` reads `matchMedia` and updates before paint, the same order **RiveHand** uses so the entrance pose does not hydrate into a different transform. `scrollHorizontalTranslateX(..., true)` is 0.

`"use client"` on the module.

## Update — expand the last tile

**Date:** 2026-09-27

The marketing heroes need the last placeholder to become a full-viewport section without a jump after the horizontal phase. Speeding the horizontal travel up inside the existing `300svh` track would change the gallery. The track grows instead.

- `expandLast` defaults to false. The `300svh` shell is unchanged.
- When it is on, the track is `400svh` (`shrink-0`). Pinned scroll is 3 viewports. The first 2 match today's horizontal phase (`scrollHorizontalHorizontalEnd` is `2/3`). The last viewport is the grow.
- The last tile is a layer absolutely filling the sticky `h-svh` window. `clip-path: inset(...)` starts on the centered card (12px radius) and ends at `inset(0)` with radius 0. The layer's box is the window, so the end frame is edge to edge without animating layout width or height. Earlier tiles fade across the first part of the grow.
- The sticky window then releases. The full-bleed tile scrolls away with it. The section box ends on that tile. **FooterReveal** is unchanged; the tile is inside the cover, so the footer still reveals as that cover leaves.
- **FooterReveal → Pattern — marketing hero** mounts **GridOverlay** in a following \`grid-page\` with \`!py-0\`. Default \`grid-page\` block padding is \`--grid-pad\` (24px top and bottom). On that guide-only host the padding is a 48px page-background strip between the tile and the footer. Reduced motion's static \`h-svh\` section meets the footer the same way.
- `expanded` is an optional slot for that section. It is mounted on the motion layer and in the reduced-motion section. CSS hides the one that does not apply (`motion-reduce` and `data-reduce`).
- Reduced motion keeps the native horizontal scroller, then renders the last tile as a static `h-svh` section with radius 0 and the same `sr-only` label. The heading is visible above that scroller.
- On the motion shell the heading stays in the tree as the section's accessible name and is `sr-only`. It is not painted at the top of the pinned window.
- **Components/Layout/HeroTileStack → Pattern — marketing hero** and **Components/Layout/FooterReveal → Pattern — marketing hero** pass `expandLast`. **Pattern — project gallery** does not.

## Update — gallery intro

**Date:** 2026-09-27

The gallery can open on a statement instead of a centered first card.

- `intro` is optional. Pass **ScrollHorizontal.Intro** (`eyebrow`, `statement`, optional `action`). It is the first panel of the track. `heading` is not rendered when `intro` is set.
- The eyebrow is a **Badge** `eyebrow` (mono, uppercase, `--font-size-xs`, accent fill). It is the section's accessible name (`aria-labelledby`). The statement is an `h2` on `type-display-2` at `--font-weight-normal`, with `--text-display-1-leading`. That is the largest display step that wraps to about four or five lines in the left columns. No new size token.
- The action was first **Button** `role="outline"` `size="sm"` `mono` with `endIcon`. See the later update: it is now `role="secondary"`.
- The panel width follows the page grid: every column below `md`, 4 of 8 from `md`, 6 of 12 from `lg`. At 1440px that is about 42% of the viewport. Padding-left is the grid content edge. Top padding is `--site-nav-height` plus `1rem` (`--spacing * 4`), the compact site nav pin, so the eyebrow clears the pill.
- Travel parks the last card on the viewport center, same end frame as a gallery with no intro, so `expandLast` still grows from that card to `inset(0)`. Without `intro`, distance and clip are unchanged.
- Reduced motion keeps one intro node and stacks it above the native horizontal scroller. The track is not pinned.
- **Pattern — marketing hero** on both organisms stays on the sr-only heading. The gallery statement copy is the later update.

## Update — statement sequence

**Date:** 2026-09-27

The gallery statement animates with **TextSequence** (ADR-0037).

- **ScrollHorizontal.Intro** renders `statement` inside the real `h2` through **TextSequence** with `emphasis="none"` and `trigger="inView"`. The type step stays `type-display-2` at normal weight. Intro owns the sequence. Callers pass text and **TextSequence.Shape** marks. They do not wrap `statement` in another **TextSequence**.
- The entrance runs once, when the statement intersects the viewport (threshold 0.35). It does not run on page load while the panel is below the fold.
- Marks are about 1.15em tall and do not grow the line box. `info-muted` stays available on the shape. Placement and tones are the later update.
- The `h2` keeps its heading role. Once the split runs, its accessible name is the plain sentence (shapes omitted). Shapes stay `aria-hidden`.
- `prefers-reduced-motion` leaves the sentence and the shapes at rest. No split, no pop.
- `expandLast` and the flush footer handoff are unchanged. **SiteNav**, the hero `h1`, and the Rive hands are unchanged. The action is the later update.
- **FooterReveal → Pattern — marketing hero with sequenced gallery** shows the hero subtext sequence and this statement together.

## Update — statement copy and secondary action

**Date:** 2026-09-27

- The statement is “Every screen is a first impression and we make yours the one they remember.” **TextSequence.Shape** sits after those words: asterisk (`brand`) after screen, pill (`brand-soft`) after impression, diamond (`accent`) after yours.
- The `h2` accessible name is that plain sentence.
- The action is **Button** `role="secondary"`, label Start a project, sentence case, with no `className`. Secondary has no icon slot, so there is no trailing arrow.
- **Pattern — gallery intro**, **HeroTileStack → Marketing hero with gallery intro**, **FooterReveal → Marketing hero with gallery intro**, and **FooterReveal → Pattern — marketing hero with sequenced gallery** use this copy and this action.

## Non-goals

- Motion+.
- A paged **Carousel**, drag snap, or autoplay.
- New color or radius tokens.
- Click targets on the cards.
- Card photography, visible captions, and a bottom gradient. Tiles are placeholders.
- Changing **SiteNav**, the hero, or **FooterReveal** internals for this phase.

## Consequences

Consuming apps paste **Components/Layout/ScrollHorizontal → Pattern — project gallery**. **Components/Layout/HeroTileStack → Pattern — marketing hero** and **Components/Layout/FooterReveal → Pattern — marketing hero** place the gallery directly under the hero with `expandLast`, then the rest of the page. The five tiles are solid token-color placeholders. **SiteNav** is unchanged. **FooterReveal** still reveals after the cover, including the full-bleed tile. The marketing hero's guide \`grid-page\` uses \`!py-0\` so that tile meets the footer with no page-background strip.

## References

- ADR-0002 (organism tier), ADR-0003 (mobile-first `sm`), ADR-0004 (pattern-first), ADR-0008 (motion), ADR-0026 (Layout), ADR-0032 (marketing hero)
