# ADR-0023: Exported AppShell organism

## Status

Accepted

## Context

The app-shell patterns were complete in Storybook, but their layout components remained under `src/examples/AppShell/`. Examples are intentionally excluded from the package, so consuming apps could import **NavRail** and **PageHeader** but could not adopt the canonical shell composition.

Applications need one package contract for desktop and mobile chrome without importing demo routes, sample navigation data, or page content.

## Decision

Ship **AppShell** as an organism under `src/components/organisms/AppShell/` and export it from the package.

### API

- **AppShell** — desktop composition:
  - `items`, `activeId`, `onSelect`
  - optional `footerItems`, `secondaryNav`, `brand`, `brandLabel`, `itemSurface`
  - children own **PageHeader** and route content
- **AppShell.Body** — scrollable canvas body with canonical page-grid inset
- **AppShell.Mobile** — mobile composition using the same primary and secondary navigation data
- `secondaryNav` carries `sections`, `activeId`, `onSelect`, and an optional accessible label

The shell does not own routing, route definitions, page state, or breakpoint detection. The consuming app selects desktop or mobile composition at its established app breakpoint.

### Composition

- Desktop: **NavRail** + optional **NavList** + inset canvas
- Mobile: **Button** / **IconButton** expandable dock + **Tab.Group** secondary navigation
- **PageHeader** remains an explicit child so each route owns its title and end actions
- Demo navigation data and pages remain in `src/examples/AppShell/`

The raw desktop drag separator is a documented shell exception: it is a WAI-ARIA separator with pointer-value semantics, not an action button.

## Consequences

- Consuming apps can replace interim `NavRail` + `PageHeader` wiring with `AppShell` from `@whatmatters/wmds`
- **Examples/App shell** consumes the package organism instead of maintaining duplicate shell implementations
- The mobile dock is no longer example-only; it is encapsulated by **AppShell.Mobile**
- Storybook contract: **Organisms/AppShell**

## References

- ADR-0018 (**PageHeader**)
- ADR-0019 (**NavList**)
- ADR-0020 (**NavRail**)
- ADR-0021 (mobile nav dock)
- ADR-0022 (**Tab**)
