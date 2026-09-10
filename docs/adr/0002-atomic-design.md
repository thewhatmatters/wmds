# ADR-0002: Atomic design component tiers

**Status:** Accepted  
**Date:** 2026-08-29

## Context

WMDS is rebuilding components from Foundation up. [Brad Frost's atomic design](https://atomicdesign.bradfrost.com/) gives a composition hierarchy: atoms → molecules → organisms → templates/pages. We need explicit tiers before the first component lands so filesystem placement, exports, and import rules stay consistent.

## Decision

### Tier folders

| Tier | Path | Package export |
|------|------|----------------|
| Atoms | `src/components/atoms/{Name}/` | Yes |
| Molecules | `src/components/molecules/{Name}/` | Yes |
| Organisms | `src/components/organisms/{Name}/` | Yes |
| Templates / pages | `src/examples/{Name}/` | No |

### Dependency rules

1. **Atoms** — import only `lib/`, Theme utilities, and npm peers (`motion`, `lucide-react`). No other WMDS components.
2. **Molecules** — compose atoms and other molecules (+ `lib/`). No organisms or examples.
3. **Organisms** — compose molecules and atoms. No examples.
4. **Examples** — compose organisms (and lower tiers). Never imported by components.

Foundation and Theme are sub-component layers (tokens, specimens) — not atomic tiers.

### Planned catalog (initial taxonomy)

**Atoms:** Badge, Button, IconButton, Input, TextArea, Status

**Molecules:** Card, Chip, Field, List, Pagination, Search, Select

**Organisms:** Carousel, Chart, MoreMenu, Tab, Table

Reclassify only via ADR update — don't bikeshed per PR. **Card** is a molecule — see **ADR-0005**. **List** was later withdrawn from the catalog.

### Storybook sidebar

Superseded on **2026-09-10** by **ADR-0026**. Storybook now uses an intent-based public taxonomy (`Start Here → Foundations → Components → Patterns → Examples`) while this ADR continues to govern filesystem placement, package tiers, and one-way imports.

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

- New components must declare their atomic tier in `package.manifest.ts`; their Storybook title uses the functional category defined by ADR-0026
- Flat `src/components/{Name}/` is deprecated — do not add new flat paths
- Examples remain Storybook-only; they map to templates/pages in atomic vocabulary

## Related

- ADR-0001 — Theme → lib → Components → Examples layer stack
- ADR-0003 — responsive, mobile-first rules per tier
- ADR-0005 — List and Card reclassified as molecules
- ADR-0006 — Input architecture (optional labels, individual components)
- ADR-0026 — intent-based Storybook catalog taxonomy
