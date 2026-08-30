# Farmer Market refresh — component roadmap

**Consumer:** [farmermarket.us](https://farmermarket.us)  
**Strategy:** Target Farmer Market first. **Restyle** what is already in WMDS, then add **one missing primitive** and **one new composite**. Do not grow a second kit.

Designer harvest order (running list — update status as components ship):

| # | Component | WMDS tier | Farmer Market use | Status |
|---|-----------|-----------|-------------------|--------|
| 1 | **Chip** | Molecule | SNAP (already `wmds-chip`), Open today, Saturday, Dogs, Viewing pill | **Shipped** — multi-select filters, sizes sm/md/lg, removable + read-only |
| 2 | **Button** + **IconButton** | Atoms | Find, Use my location, GO, Get directions, Close, × clear | **Shipped** — restyle against FM as needed |
| 3 | **Input** | Atom | ZIP or city search — **the hole** (not in barrel yet) | Pending |
| 4 | **List** | Organism | Market rows — name, street, miles, SNAP booth | Pending |
| 5 | **Card** | Organism | 360° open card | Pending |

## New composite (spec next)

**Find pill** — single WMDS pattern, not a parallel component library:

1. **Collapsed** — compact trigger (likely Chip or Button)
2. **ZIP field** — expands to Input (ZIP or city)
3. **Committed** — shows value + clear (× IconButton)

Spec in Storybook as a **named pattern** (molecule or `Examples/` flow) once Input + Chip land. Reuse shipped atoms; no second kit.

## Notes for implementers

- **Chip before Find pill** — SNAP and filter tags share the same primitive.
- **Input is the blocker** for search / Find pill / ZIP entry.
- **List row anatomy** — leading content, primary line (name), secondary (street), trailing (miles, SNAP Chip).
- **Button + IconButton** — verify FM-specific copy and layouts in Storybook against live FM screens during restyle pass.

## Related

- `src/package.manifest.ts` — full WMDS catalog beyond FM scope
- `docs/adr/0004-pattern-first-not-utility-first.md` — ship patterns, not utility recipes
