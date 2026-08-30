# Farmer Market refresh — component roadmap

**Consumer:** [farmermarket.us](https://farmermarket.us)  
**Strategy:** Target Farmer Market first. **Restyle** what is already in WMDS, then add **one missing primitive** and **one new composite**. Do not grow a second kit.

Designer harvest order (running list — update status as components ship):

| # | Component | WMDS tier | Farmer Market use | Status |
|---|-----------|-----------|-------------------|--------|
| 1 | **Chip** | Molecule | SNAP (already `wmds-chip`), Open today, Saturday, Dogs, Viewing pill | **Shipped** — multi-select filters, sizes sm/md/lg, removable + read-only |
| 2 | **Button** + **IconButton** | Atoms | Find, Use my location, GO, Get directions, Close, × clear | **Shipped** — restyle against FM as needed |
| 3 | **Input** | Atom | ZIP or city search | **Shipped** — bare default, optional label; see ADR-0006 |
| 4 | **List** | Molecule | Market rows — name, street, miles, SNAP booth | **Shipped** — stacked/split rows, dividers, selectable |
| 5 | **Card** | Molecule | 360° open card / panel inset detail | **Shipped** — flush default, Header/Body/Footer |
| 6 | **Application shell** | Organism | Page chrome — header, nav slots, main content well | Pending |

## Application shell (organism — post-List)

Reusable **page frame** for Farmer Market and other WhatMatters apps — not page-specific wiring in Examples.

| Region | FM use | Notes |
|--------|--------|--------|
| **Header** | Brand + page title (`page-heading`) | Mobile-first; sticky optional |
| **Main** | Browse flow slot (`children`) | `bg-body`; max-width container at `md:`+ |
| **Nav** (later) | Bottom tab or sidebar | Defer until FM routes beyond browse |

**Ship after List** — shell wraps list + detail; **`Examples/FarmerMarket`** promotes into shell once the organism exists.

**Tier:** Organism (`Organisms/ApplicationShell`) — section-scale chrome with typed slots, not utilities in apps. See **ADR-0002**.

**Typography:** `page-heading` role reserved for shell titles (`src/lib/typography.ts`).

## Input spec (ADR-0006)

Astryx-style **Text Input** visuals; ShadCN-style **optional label** — bare input is the default.

| FM use | Pattern | Props |
|--------|---------|--------|
| Find pill (active) | **Bare** | `placeholder="ZIP or city"`, `aria-label="Location"`, optional `icon={<MapPin />}` |
| Settings / forms (later) | **With label** | `label`, `description`; validation via `status` + `message` |
| Inline search row (later) | **Search** molecule | `Input` + `Button` — Astryx horizontal pattern |

**Ship first:** bare + icon + sizes (`sm` \| `md` \| `lg`). **`Field`** molecule deferred until horizontal/labeled forms need it.

Reference: [Astryx Text Input](https://astryx.atmeta.com/components/TextInput) · **`docs/adr/0006-input-architecture.md`**

## Find pill (Example — not a new tier)

Hero search is **composition**, not a standalone atom:

1. **Collapsed** — `Button` (primary pill, "Find")
2. **Active** — `Input` (ZIP or city) inside expanding shell
3. **Committed** — removable `Chip` (value + ×)

Spec in **`Examples/FarmerMarket`** (page flow) or thin **`Search`** molecule once Input ships. Motion: `layoutId` morph on expand/collapse.

## Notes for implementers

- **Chip before Find pill** — SNAP and filter tags share the same primitive.
- **Input is the blocker** for search / Find pill / ZIP entry. Architecture: **ADR-0006** — individual components, optional `label` on `Input`, shared `inputShellStyles.ts`.
- **List row anatomy** — leading content, primary line (name), secondary (street), trailing (miles, SNAP Chip).
- **Application shell** — organism after List; FM Example nests browse flow inside shell main slot.
- **List + Card are molecules** — modular, reusable across layouts; page composition lives in Examples. See **ADR-0005**.
- **Button + IconButton** — verify FM-specific copy and layouts in Storybook against live FM screens during restyle pass.

## Related

- `src/package.manifest.ts` — full WMDS catalog beyond FM scope
- `docs/adr/0004-pattern-first-not-utility-first.md` — ship patterns, not utility recipes
- `docs/adr/0005-list-card-as-molecules.md` — List and Card tier decision
- `docs/adr/0006-input-architecture.md` — Input, Field, Search architecture
