# ADR-0019: NavList molecule + Button nav layout

**Status:** Accepted  
**Date:** 2026-09-06

## Context

Settings-style secondary navigation (section overlines, icon + label + count, selected pill) is a recurring product pattern distinct from **Card.Header**, **TaskRows** detail lines, and primary **NavRail** icons.

## Decision

### Atom extension

- **Button** gains **`layout="nav"`** + **`selected`** — full-width inset row, quiet secondary selected fill, `aria-current="page"` when selected. Rows do not add borders inside their parent surface.
- Mutually exclusive with `status`, `icon`, and `count` (children compose icon/label/count in **NavList**).

### Molecule

- **NavList** in `src/components/molecules/NavList/`
- **API:** `sections` + `activeId` + `onSelect` **or** **NavList.Section** + **NavList.Item**
- **`labelAlign`:** `brand` (56px band — pairs with **PageHeader** `variant="app"`) | `section` (padded overline)
- First section in `sections` mode defaults to **`labelAlign="brand"`** when labeled
- Composes **Button** `layout="nav"`, **ButtonIcon**, Lucide icons in items

### Non-goals (v1)

- ~~Primary **NavRail** organism (still example tier)~~ — shipped ADR-0020
- Motion thumb / sliding indicator on items
- Nested tree nav / expand-collapse sections

## Consequences

- **Positive:** Consumers can use exported **NavList** without hand-rolled navigation rows.
- **Positive:** **Button** `layout="nav"` is documented and reusable only through **NavList** in product docs.

## References

- **Molecules/NavList → Pattern — side nav (settings)**
- ADR-0018 (**PageHeader** band height), ADR-0011 (cluster), ADR-0002 (composition)
