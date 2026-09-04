# Farmer Market refresh — component roadmap

**Consumer:** [farmermarket.us](https://farmermarket.us)  
**Strategy:** Target Farmer Market first. **Restyle** what is already in WMDS, then add **one missing primitive** and **one new composite**. Do not grow a second kit.

Designer harvest order (running list — update status as components ship):

| # | Component | WMDS tier | Farmer Market use | Status |
|---|-----------|-----------|-------------------|--------|
| 1 | **Chip** | Molecule | SNAP (already `wmds-chip`), Open today, Saturday, Dogs, Viewing pill | **Shipped** — multi-select filters, sizes sm/md/lg, removable + read-only |
| 2 | **Button** + **IconButton** | Atoms | Find, Use my location, GO, Get directions, Close, × clear | **Shipped** — restyle against FM as needed |
| 3 | **Input** | Atom | ZIP or city search | **Shipped** — bare default, optional label; see ADR-0006 |
| 4 | **List** | — | Market rows — name, street, miles, SNAP booth | **Withdrawn** — not a keeper; app-owned rows for now |
| 5 | **Card** | Molecule | Market detail — shell + inset **Body** slot (TaskRows in FM) | **Shipped** — Header / Body slot / Footer |
| 6 | **Content rail** | — | Map + market list pane | **Withdrawn** — app-owned layout; no rail primitive |
| 7 | **TaskRows** | Molecule | Map overlay detail — Get directions, services offered | **Shipped** — `MarketDetailCard` in **Examples/FarmerMarket** |

## Map overlay (FM)

Engineers own map library placement. WMDS ships **`MarketDetailCard`** (`Examples/FarmerMarket`) — mount in the map overlay slot. Pattern: **Molecules/TaskRows → Pattern — FM market detail**.


Map + list pane in a viewport-height flex row — see **Examples/FarmerMarket**. Header, list pane, and app nav are owned by the consuming app.

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
- **List pane** — map + list browse is app-owned layout. See **Examples/FarmerMarket**.
- **Card is a molecule** — modular, reusable across layouts; page composition lives in Examples. See **ADR-0005**.
- **Button + IconButton** — verify FM-specific copy and layouts in Storybook against live FM screens during restyle pass.

## Related

- `src/package.manifest.ts` — full WMDS catalog beyond FM scope
- `docs/adr/0004-pattern-first-not-utility-first.md` — ship patterns, not utility recipes
- `docs/adr/0005-list-card-as-molecules.md` — List and Card tier decision
- `docs/adr/0006-input-architecture.md` — Input, Field, Search architecture
