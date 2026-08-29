# ADR-0001: WMDS layer architecture

**Status:** Accepted  
**Date:** 2026-08-29

## Context

WMDS uses Tailwind v4 **internally** for tokens and component CSS. Without explicit layer ownership, token values drift (motion in CSS vs JS), hover utilities break, Storybook CSS diverges from `dist/styles.css`, and Foundation leaks shared UI into Components.

## Decision

### Theme (`src/theme/`)

- **`colors.css`** — base semantic roles only
- **`stateColors.css`** — hover/active/ghost derivations via `color-mix`
- **`theme.css`** — Tailwind `@theme` bridge; imports colors + stateColors + sources
- **`sources.css`** — single Tailwind content manifest for Storybook and package CLI

### lib (`src/lib/`)

Shared behaviour behind component seams:

- **`motion.ts`** — CSS-var adapter for Tailwind + Motion transitions
- **`collapse.css`**, **`segmentedControl.tsx`**, **`shadows.ts`**, **`typography.ts`**, **`chartTheme.ts`**
- **`tableLayout/`** — pure layout math + `TableMeasurer` seam + hooks

Foundation stories demonstrate lib/Theme; Components import lib/, never Foundation.

### Foundation (`src/foundation/`)

Storybook token specimens and `Introduction.mdx` only. No exports consumed by Components.

### Components (`src/components/`)

Atomic tiers — see **ADR-0002**. Atoms, molecules, and organisms export from `src/index.ts`. Examples do not.

### Package manifest (`src/package.manifest.ts`)

Single list of lib exports, planned component exports, peer deps, and required `dist/styles.css` utilities. `scripts/validate-manifest.mjs` runs after build.

## Consequences

- Components rebuilding should use `hover:bg-primary-hover` etc. — utilities are Theme-owned
- Adding a new top-level `src/` layer requires a glob in `sources.css`
- Motion JS reads CSS custom properties at runtime; tests use documented fallbacks
- Table DOM measurement is injectable via `TableMeasurer` for unit tests

## Related

- ADR-0002 — atomic design tiers (atoms / molecules / organisms / examples)
- ADR-0004 — pattern-first consumer API (not utility-class-first)
