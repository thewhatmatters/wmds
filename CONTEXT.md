# WMDS

WhatMatters Design System — **pattern-first** component library + Tailwind v4 theme (`src/theme/`) + Storybook catalog.

## Language

**Brand name:** always **WhatMatters** (joined, no space) in UI copy, docs, and specimens — not "What Matters".

**Theme**:
`colors.css` (base semantic roles) + `stateColors.css` (hover/active via `color-mix`) + `theme.css` (Tailwind `@theme` bridge) + `sources.css` (Tailwind content manifest). Storybook Foundation stories are canonical — not Paper.

**Foundation**:
Storybook token specimens only (`src/foundation/*.stories.tsx`, `Introduction.mdx`). No component imports from Foundation.

**lib**:
Shared implementation behind component seams — `cn`, `motion`, `collapse.css`, `segmentedControl`, `shadows`, `typography`, `chartTheme`, `tableLayout`. Exported sparingly from `src/index.ts`; see `src/package.manifest.ts`.

**Atoms** (`src/components/atoms/`):
Smallest UI units — Button, Input, Badge, etc. Import only `lib/` + Theme. Storybook: **`Atoms/{Name}`**. Exported.

**Molecules** (`src/components/molecules/`):
Simple groups of atoms — Field, Search, Select, etc. Storybook: **`Molecules/{Name}`**. Exported.

**Organisms** (`src/components/organisms/`):
Distinct UI sections — Table, Tab, Card, etc. Storybook: **`Organisms/{Name}`**. Exported.

**Examples** (`src/examples/`):
Templates and pages — Storybook-only compositions. Storybook: **`Examples/{Name}`**. Never exported.

**Pattern-first:**
Components and Storybook Examples are the consumer API — not ad-hoc utility composition. Tailwind powers component internals and page layout only. See **`docs/adr/0004-pattern-first-not-utility-first.md`**.

**Responsive:**
Mobile-first by default — unprefixed Tailwind = mobile; scale with `sm:` / `md:` / `lg:`. Every component must work on mobile, tablet, and desktop. See **`docs/adr/0003-responsive-mobile-first.md`** and **Foundation → Breakpoints**.

## Dark mode

`[data-theme="dark"]` on `<html>` or ancestor — same utility names, swapped values in `colors.css` and `stateColors.css`.

## Architecture layers

```
Theme (CSS tokens, derivations, Tailwind bridge, source manifest)
  ↓
lib (motion adapter, table measurer, typography roles, shared helpers)
  ↓
Atoms → Molecules → Organisms (components — strict import direction)
  ↓
Examples (templates / pages)
```

See `docs/adr/0001-layer-architecture.md`, `docs/adr/0002-atomic-design.md`, `docs/adr/0003-responsive-mobile-first.md`, and `docs/adr/0004-pattern-first-not-utility-first.md`.
