# ADR-0002: Atomic design component tiers

**Status:** Accepted  
**Date:** 2026-08-29

## Context

WMDS is rebuilding components from Foundation up. [Brad Frost's atomic design](https://atomicdesign.bradfrost.com/) gives a composition hierarchy: atoms → molecules → organisms → templates/pages. We need explicit tiers before the first component lands so Storybook, exports, and import rules stay consistent.

## Decision

### Tier folders

| Tier | Path | Package export | Storybook title |
|------|------|----------------|-----------------|
| Atoms | `src/components/atoms/{Name}/` | Yes | `Atoms/{Name}` |
| Molecules | `src/components/molecules/{Name}/` | Yes | `Molecules/{Name}` |
| Organisms | `src/components/organisms/{Name}/` | Yes | `Organisms/{Name}` |
| Templates / pages | `src/examples/{Name}/` | No | `Examples/{Name}` |

### Dependency rules

1. **Atoms** — import only `lib/`, Theme utilities, and npm peers (`motion`, `lucide-react`). No other WMDS components.
2. **Molecules** — compose atoms (+ `lib/`). No organisms or examples.
3. **Organisms** — compose molecules and atoms. No examples.
4. **Examples** — compose organisms (and lower tiers). Never imported by components.

Foundation and Theme are sub-component layers (tokens, specimens) — not atomic tiers.

### Planned catalog (initial taxonomy)

**Atoms:** Badge, Button, IconButton, Input, TextArea, StatusDot, StatusRing

**Molecules:** Chip, Field, Pagination, Search, Select

**Organisms:** Card, Carousel, Chart, List, MoreMenu, Tab, Table

Reclassify only via ADR update — don't bikeshed per PR.

### Storybook sidebar

`Introduction → Foundation → Atoms → Molecules → Organisms → Examples` (alphabetical within each).

### File convention per component

```
src/components/{tier}/{Name}/
  {Name}.tsx
  {Name}.stories.tsx
  {name}Styles.ts      # optional — Tailwind class strings
  *.css                # optional — side-effect import in component
  *.test.ts            # optional — colocated unit tests
```

## Consequences

- New components must declare tier in `package.manifest.ts` and use matching Storybook title prefix
- Flat `src/components/{Name}/` is deprecated — do not add new flat paths
- Examples remain Storybook-only; they map to templates/pages in atomic vocabulary

## Related

- ADR-0001 — Theme → lib → Components → Examples layer stack
- ADR-0003 — responsive, mobile-first rules per tier
