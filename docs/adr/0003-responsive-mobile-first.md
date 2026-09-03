# ADR-0003: Responsive, mobile-first by default

**Status:** Accepted  
**Date:** 2026-08-29

## Context

WhatMatters products must work on **mobile, tablet, and desktop**. WMDS components and examples ship before app shells exist — responsive behaviour must be designed in from the first atom, not patched later.

## Decision

### Mobile-first

- **Unprefixed Tailwind utilities = mobile (default).** Scale up with `sm:`, `md:`, `lg:` — never the reverse (`max-*` only when truly necessary).
- **Design and review at mobile width first** in Storybook, then tablet and desktop.
- **No component ships** without a responsive story note or layout that survives 320px–1280px+.

### Breakpoints

Use **Tailwind v4 defaults** unless an ADR adds custom `--breakpoint-*` in `@theme`:

| Tier | Utility prefix | Min width | Typical device |
|------|----------------|-----------|----------------|
| Mobile (default) | _(none)_ | 0 | Phone |
| Large phone / small tablet | `sm:` | 640px | Large phone, small tablet |
| Tablet | `md:` | 768px | Tablet portrait |
| Desktop | `lg:` | 1024px | Laptop / desktop |
| Wide | `xl:` | 1280px | Wide desktop |
| Ultra-wide | `2xl:` | 1536px | Large monitors |

Reference: **`src/lib/viewports.ts`** (`gridScale`) and **Foundation → Grid**. Breakpoints and `--grid-cols` are one contract (4 / 8 / 12 at default / `md` / `lg`).

### Rules for all tiers

**Atoms**
- Touch targets ≥ **44×44px** on mobile (buttons, icon buttons, checkbox hit areas).
- Text inputs full-width on mobile unless explicitly inline.
- No hover-only affordances — `:hover` enhancements OK, core action must work on touch.

**Molecules**
- Stack vertically by default; row layouts at `sm:` or `md:` when space allows.
- Search/filter rows wrap or stack on narrow viewports.

**Organisms**
- **Table:** horizontal scroll within a bounded container on mobile, or documented card fallback — never clip without scroll.
- **Tab / Chip rails:** horizontal scroll (`overflow-x-auto`) when items overflow.
- **Card / List:** full-width on mobile; multi-column only at `md:`+.

**Examples (templates / pages)**
- Must demonstrate at least **mobile + desktop** layout in Storybook (viewport toolbar or dedicated story variants).

### Storybook

- Canonical viewports: **Mobile (390px)**, **Tablet (768px)**, **Desktop (1280px)** — configured in `.storybook/preview.tsx`.
- Default canvas: full width; engineers switch viewport when reviewing.
- Organism and Example stories should set `parameters.layout: "padded"` and avoid fixed outer widths that hide overflow bugs.

### What we avoid

- Fixed `px` container widths without `max-w-*` + horizontal padding.
- Desktop-only Storybook screenshots as acceptance criteria.
- Separate “mobile components” — one component, responsive utilities.

## Consequences

- Component PRs / rebuild stories checked at mobile viewport before merge.
- Breakpoint changes require ADR + Foundation story update.
- `lib/viewports.ts` is the naming source for docs and Storybook — not ad hoc pixel values in stories.

## Related

- ADR-0002 — atomic tiers (responsive rules apply per tier)
- ADR-0001 — Theme uses Tailwind defaults for breakpoints
