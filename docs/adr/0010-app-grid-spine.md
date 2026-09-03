# ADR-0010: Müller-Brockmann app grid spine

**Status:** Accepted  
**Date:** 2026-09-03

## Context

WMDS had a 4px Tailwind `--spacing` scale and no load-bearing page grid. Apps (Pitchkit and others) would otherwise invent ad-hoc columns, or treat a decorative overlay as the system.

WHA-304 asks for a **use-grid-system `--profile=app`** spine: column-line + 8px baseline, relaxed rows — tokens and utilities in WMDS, not new layout atoms in consuming apps.

## Decision

- **`--spacing` stays 0.25rem (4px).** Do not re-scale it. Baseline is an even multiple: `--grid-baseline: calc(var(--spacing) * 2)` (8px). `--leading-base` is 3 × baseline (24px).
- **Source of truth:** `src/theme/grid.css`, imported from `theme.css` so Storybook and `@whatmatters/wmds/styles.css` share one stack.
- **Utilities:** `grid-page` (wrap + columns) and `band` (subgrid; `@supports` fallback repeats `--grid-cols`).
- **Overlay:** `GridOverlay` is a child of `grid-page`. Press **g**. Same `--grid-*` tokens. Do not mount a viewport overlay (`tailwindcss-react-grid-overlay` as published paints the window — that is the misalignment bug).
- **Not a product atom.** No Pitchkit layout lock. Design still owns look. Consumers copy `grid-page` / `band` / overlay from WMDS.

## Consequences

- Page layout in apps uses `grid-page` + `band` + column-line placement (`col-start` / `col-span`), not a new WMDS Grid molecule.
- Guide tints derive from existing primary/info roles — no parallel Swiss accent palette.
- Probe record: `docs/grid-probe.json`. Agent-facing contract: **DESIGN.md → Grid**.

## Related

- ADR-0001 — Theme owns tokens; lib owns the overlay helper
- ADR-0003 — mobile-first 4 / 8 / 12 columns
- ADR-0004 — pattern-first; this spine is layout infrastructure, not utility soup for widgets
- [WHA-304](https://linear.app/whatmatters/issue/WHA-304/wmds-muller-brockmann-app-grid-spine-use-grid-system)
