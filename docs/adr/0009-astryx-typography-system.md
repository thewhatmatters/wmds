# ADR-0009: Astryx-aligned typography system

**Status:** Accepted  
**Date:** 2026-08-30

## Context

WMDS typography used Tailwind default sizes with semantic roles expressed as hardcoded utility strings (`text-sm font-medium …`) in `typography.ts`. Sizes were not geometric; line-heights were ad hoc (`leading-none` in atoms vs readable leading in body copy).

[Astryx Typography](https://astryx.atmeta.com/docs/typography) uses:

1. **Geometric ramp** — `--font-size-*` from base × ratio (14px × 1.2 default)
2. **Semantic triplets** — `--text-{style}-{size,weight,leading}`
3. **`type-*` utilities** — components express intent, not raw font-size
4. **Font roles** — body, heading, code families

## Decision

### Source of truth

- **`src/theme/typography.css`** — geometric scale, weights, semantic tokens, `@utility type-*` composites
- **`src/theme/fonts.css`** — `--font-family-body`, `--font-family-heading`, `--font-family-code` (Geist today)
- **`src/lib/typography.ts`** — WMDS **`TypographyRole`** → `type-*` mapping via `typographyClass()`

### WMDS role → Astryx type

| WMDS role | Astryx type | Utility |
|-----------|-------------|---------|
| `display` | display-1 | `type-display-1` |
| `page-heading` | heading-1 | `type-heading-1` |
| `section-heading` | heading-2 | `type-heading-2` |
| `subheading` | heading-4 | `type-heading-4` |
| `body` | body | `type-body` |
| `ui-label` | label | `type-label` |
| `caption` | supporting | `type-supporting` |
| `overline` | supporting + uppercase | `type-supporting` + tracking |

### Control vs document typography

Fixed-height atoms (Button, Chip, Input, Badge) still use **`text-sm` + `leading-none`** until Phase 4. New token:

- **`type-control`** / `--text-control-*` — tight leading for shell centering

Document copy uses full Astryx leading (4px-grid-aligned ratios in tokens).

### Tailwind `text-*` bridge (temporary)

Legacy utilities remapped so atoms do not shift before Phase 4:

| Utility | Maps to | Size |
|---------|---------|------|
| `text-xs` | `--font-size-sm` | 12px |
| `text-sm` | `--font-size-base` | 14px |
| `text-base` | `1rem` | 16px |

Semantic work uses **`type-*`**, not `text-sm`.

### Letter spacing

WMDS keeps three tracking rules (`tight`, `normal`, `wider`) applied via roles — Astryx extension for Geist/WhatMatters.

## Consequences

- **Phase 1–3 (this ADR):** tokens, `typographyClass()`, Foundation story
- **Phase 4:** migrate Button/Chip/Input/Badge to `type-control`
- **Optional later:** `Text` / `Heading` atoms with `type` prop (Astryx parity)
- Adjust **`--type-scale-base`** / **`--type-scale-ratio`** to shift the entire ramp — do not tweak individual heading sizes

## Related

- [Astryx Typography](https://astryx.atmeta.com/docs/typography)
- ADR-0007, ADR-0008 — same token methodology for color and motion
