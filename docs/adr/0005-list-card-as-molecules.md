# ADR-0005: List and Card as molecules

**Status:** Accepted (Card). List withdrawn from the catalog 2026-09-04.  
**Date:** 2026-08-29  
**Amends:** ADR-0002 (planned catalog — List, Card)

## Context

ADR-0002 placed **List** and **Card** in **Organisms** alongside Table, Tab, and MoreMenu — inherited from the pre-rebuild flat catalog when those components were generic, section-scale shells.

Farmer Market refresh clarified actual use:

- **List** — reusable market row pattern (name, street, miles, SNAP `Chip`). Apps compose many rows; not a page section.
- **Card** — modular 360° open surface for a single market. Embedded and reused, not a full template.

Brad Frost **organisms** are distinct page regions (header, product grid). **Molecules** are modular groups of atoms — reusable across layouts. List and Card fit the latter for WMDS scope.

**Find pill** (hero search) is composition (`Button` → `Input` → removable `Chip`), not a tier — spec as **Example** or thin **Search** molecule once Input ships. Page-level FM layout stays in **`Examples/`**.

## Decision

### Reclassify

| Component | Was | Now |
|-----------|-----|-----|
| **List** | Organism | **Molecule** |
| **Card** | Organism | **Molecule** |

Implement under `src/components/molecules/{Name}/`. Storybook: **`Molecules/{Name}`**. Exported from `src/index.ts`.

### Tier rule (WMDS)

Use **molecule** when the component is:

- Modular and reusable across pages
- Composes atoms (+ other molecules)
- A named pattern with typed props — not ad-hoc page wiring

Use **organism** when the component is:

- Section-scale — multiple sub-regions, toolbar + body, or overlay system
- Examples: **Table**, **Tab**, **MoreMenu**, **Carousel**, **Chart**

Use **Examples** when the component is:

- A template or page flow composing lower tiers (e.g. **FarmerMarket** hero + filters + list)

### Updated planned catalog

**Molecules:** Card, Chip, Field, List, Pagination, Search, Select

**Organisms:** Carousel, Chart, MoreMenu, Tab, Table

### Import rules (unchanged)

atoms ← molecules ← organisms ← examples

Molecules may compose atoms and other molecules (e.g. List row trailing `Chip`). Organisms compose molecules and atoms. Examples compose all lower tiers.

## Consequences

- `src/package.manifest.ts` and docs updated to match
- Rebuilt **List** / **Card** land in `molecules/`, not `organisms/`
- Legacy flat `src/components/List/` and `src/components/Card/` are not the canonical paths when rebuilt
- FM roadmap tier column reflects molecules for List and Card

## Related

- ADR-0002 — atomic design tiers
- `docs/farmermarket-component-roadmap.md` — FM harvest order
