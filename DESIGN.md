# WMDS design notes

Storybook and `src/theme/` are canonical. This file is the agent-facing layout contract — not a second token source.

## Grid

Müller-Brockmann **app** profile (`use-grid-system --profile=app`): **column-line + 8px baseline**, relaxed rows (no modular field lock). Load-bearing — not a decorative overlay.

### Probe (do not silently “fix”)

| Fact | Value |
|------|--------|
| Tailwind | **v4** CSS-first (`src/theme/theme.css`) |
| `--spacing` | **0.25rem (4px)** — Tailwind default, **not overridden** |
| Baseline | 8px = even multiple of `--spacing` (`--grid-baseline`) |
| Leading | `--leading-base` = 3 × baseline (24px) |

Do **not** set `--spacing` to 8px on this live project. Re-scaling the spacing scale would shift every existing atom.

### Tokens (`src/theme/grid.css`)

| Token | Role |
|-------|------|
| `--grid-cols` | 4 → 8 (`md`) → 12 (`lg`) |
| `--grid-gutter` | 16px mobile / 24px `md+` (baseline multiples) |
| `--grid-margin` | same as gutter |
| `--grid-baseline` | `calc(var(--spacing) * 2)` |
| `--grid-max` | 80rem (1280px) |
| `--grid-pad` / `--grid-row-gap` | `--leading-base` (relaxed rows) |
| `--leading-base` | 24px — also the `leading-base` utility |

Guide tints (`--grid-guide-*`) mix **existing** `--color-primary` / `--color-info`. Keep WhatMatters brand colors.

### Utilities

- **`grid-page`** — centered wrap, padding = margin, column tracks from `--grid-cols`.
- **`band`** — `grid-column: 1 / -1` + **subgrid** (fallback: repeat `--grid-cols`).
- Place children on **column lines** (`col-start-*`, `col-span-*`, `col-end-*`).

### Overlay

`GridOverlay` is a **child of `grid-page`**. Press **g** (ignored while typing). Draws numbered columns, baseline (major every `--leading-base`, minor every `--grid-baseline`), and margin lines — same content box as the grid.

Do not mount a full-viewport overlay. That is the “slapped on top / misaligned” failure.

### Consumers

Apps import `@whatmatters/wmds/styles.css` and copy `grid-page` + `band` + optional `GridOverlay`. **No new layout atoms in Pitchkit.** Design still owns look. See **`CONSUMING.md`**.
