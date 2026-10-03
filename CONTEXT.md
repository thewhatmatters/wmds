# WMDS

WhatMatters Design System — **pattern-first** component library + Tailwind v4 theme (`src/theme/`) + Storybook catalog.

## Language

**Brand name:** always **WhatMatters** (joined, no space) in UI copy, docs, and specimens — not "What Matters".

**Theme**:
`colors.css` (base semantic roles) + `stateColors.css` (hover/active via `color-mix`) + `theme.css` (Tailwind `@theme` bridge) + `grid.css` (app-profile `--grid-*` + `grid-page` / `band`) + `sources.css` (Tailwind content manifest). Storybook Foundation stories are canonical — not Paper.

**Foundation**:
Storybook token specimens only (`src/foundation/*.stories.tsx`, `Introduction.mdx`). No component imports from Foundation.

**lib**:
Shared implementation behind component seams — `cn`, `motion`, `collapse.css`, `segmentedControl`, `shadows`, `typography`, `chartTheme`, `tableLayout`, `GridOverlay`. Exported sparingly from `src/index.ts`; see `src/package.manifest.ts`.

**Atoms** (`src/components/atoms/`):
Smallest UI units — Button, Input, Badge, etc. Import only `lib/` + Theme. Storybook: **`Components/{Name}`** (or **`Components/{Family}/{Name}`**). Exported.

**Molecules** (`src/components/molecules/`):
Modular composed units — Field, Card, Chip, Search, etc. May compose atoms and other molecules. Storybook: **`Components/{Name}`** (or **`Components/{Family}/{Name}`**). Exported.

**Organisms** (`src/components/organisms/`):
Section-scale UI — Dialog, Tab, MoreMenu, etc. Storybook: **`Components/{Name}`** (or **`Components/{Family}/{Name}`**). Exported.

**Planned:**
**Table**, **Carousel**, and **Pagination** are not built yet — `plannedExports` in `src/package.manifest.ts`. `src/lib/tableLayout/` is the groundwork kept for **Table**.

**Guides** (`src/guides/`):
Cross-component guidance — Storybook **`Guides/{Name}`**. Storybook-only compositions; never exported. Product pages and flows live in each product's app, not here.

**Pattern-first:**
Components and their Storybook **Pattern** stories are the consumer API — not ad-hoc utility composition. Tailwind powers component internals and page layout only. See **`docs/adr/0004-pattern-first-not-utility-first.md`**.

**Agents (this repo):**
Read **`AGENTS.md`** and **`.cursor/rules/`** before authoring. Storybook **Pattern** stories are the contract. Molecules must compose atoms — **`npm run validate:composition`** (mirrored by the hidden **Internal/Audits/Composition** fixture). **`openGaps`** and **`compositionTrackedOpenGaps`** must stay empty.

**Responsive:**
Mobile-first by default — unprefixed Tailwind = mobile; scale with `sm:` / `md:` / `lg:`. Grid columns step on that same scale (4 / 8 / 12). Every component must work on mobile, tablet, and desktop. See **`docs/adr/0003-responsive-mobile-first.md`** and **Foundations → Grid**.

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
Guides (cross-component guidance — Storybook only)
```

See `docs/adr/0001-layer-architecture.md`, `docs/adr/0002-atomic-design.md`, `docs/adr/0003-responsive-mobile-first.md`, `docs/adr/0004-pattern-first-not-utility-first.md`, `docs/adr/0005-list-card-as-molecules.md`, `docs/adr/0006-input-architecture.md`, and `docs/adr/0010-app-grid-spine.md`. **DESIGN.md → Grid** is the agent-facing grid contract.
