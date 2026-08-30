# ADR-0007: Astryx-aligned color system

**Status:** Accepted  
**Date:** 2026-08-30

## Context

WMDS neutrals were too close in lightness (`bg` ≈ `surface`), light-mode hierarchy was inverted (surface darker than page), borders were heavy opaque grays, and status tints used Tailwind opacity modifiers (`bg-destructive/10`) instead of semantic roles.

[Astryx Color](https://astryx.atmeta.com/docs/color) provides a proven semantic model: surface hierarchy, alpha borders, overlay hovers, and `*-muted` status tints.

## Decision

### Source of truth

- **`src/theme/colors.css`** — Astryx-aligned CSS custom properties (`--color-background-body`, `--color-text-primary`, `--color-error-muted`, etc.).
- **`src/theme/stateColors.css`** — interaction states; ghost/secondary hovers use Astryx overlay tokens.
- **`src/theme/theme.css`** — Tailwind `@theme` bridge to utilities (`bg-body`, `text-fg`, `bg-error-muted`). Tailwind is the delivery layer, not the palette.

### Surface hierarchy

| Role | Utility | Astryx token |
|------|---------|--------------|
| Page floor | `bg-body` | `--color-background-body` |
| Raised panel / input | `bg-surface` | `--color-background-surface` |
| Content well | `bg-card` | `--color-background-card` |
| Popover | `bg-popover` | `--color-background-popover` |

Light: gray body → white surface/card. Dark: body darkest → surface lighter.

### Text & borders

| Utility | Token |
|---------|-------|
| `text-fg` | `--color-text-primary` |
| `text-muted` | `--color-text-secondary` |
| `text-disabled` | `--color-text-disabled` |
| `border-border` | alpha hairline |
| `border-border-emphasized` | section dividers |

### Status

Use solid + muted pairs — **no Tailwind `/10` opacity on semantic colors**:

| Solid | Muted tint | Foreground |
|-------|------------|------------|
| `bg-error` | `bg-error-muted` | `text-on-error` |
| `bg-success` | `bg-success-muted` | `text-on-success` |
| `bg-warning` | `bg-warning-muted` | `text-on-warning` |
| `bg-info` | `bg-info-muted` | `text-on-info` |

`destructive` remains a **Button role name**; color tokens prefer `error`.

### Brand vs accent

- **`primary` / `on-primary`** — WhatMatters brand actions (separate from Astryx neutral accent).
- **`accent` / `accent-muted` / `on-accent`** — neutral UI chrome per Astryx.

### Legacy aliases

`theme.css` keeps short-term aliases (`bg-bg` → body, `destructive` → error) for gradual migration. New code uses `body`, `error`, `on-error`.

## Consequences

- Components reference semantic utilities in `*Styles.ts` — not raw hex or opacity hacks.
- Foundation → Colors documents the full ladder and status-muted specimens.
- New semantic roles require ADR update + Foundation story before landing in `colors.css`.

## References

- [Astryx Color](https://astryx.atmeta.com/docs/color)
- ADR-0004 (pattern-first)
