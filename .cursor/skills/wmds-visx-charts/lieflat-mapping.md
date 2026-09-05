# Lieflat Charts → WMDS mapping

**Reference:** [lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) (`catalog.md`, `report-catalog.md`, gallery HTML).

**Contract:** Lieflat chooses **what** to build (data shape, reading time, editorial vs dashboard tone). **WMDS + visx** builds **how** (React patterns, tokens, Storybook). Never copy Lieflat ECharts/Chart.js/HTML into WMDS (ADR-0012).

## Agent workflow

1. **Classify data shape** — use Lieflat `SKILL.md` §0–§4 (same order: Lupi Editorial → Lupi Basics → Glance only when dashboard/<10s or Lupi fails).
2. **Look up ID** in the tables below — note **WMDS status** and **example data**.
3. **If Shipped / Partial** — open the Storybook path; compose **Card** + **Chart.***; use loading model (**Skeleton** → **Chart.Loading** → marks).
4. **If Backlog** — use Lieflat gallery card as **visual spec**; implement with visx packages listed; add Pattern story + ADR note before export.
5. **If Reference / Out of scope** — do not port unless product explicitly requests; document why in PR.

## Tone mapping

| Lieflat family | Reader time | Lieflat grammar | WMDS today | Target variant |
|----------------|-------------|-----------------|------------|----------------|
| **Glance** | <10s | Chunky marks, pre-aggregated, big numbers | KPI Card + **SegmentedBar**, hero % | `chartMargins.compact`, thick strokes |
| **Lupi Basics** | ~30s | Familiar silhouettes + countable units | **Chart.Cartesian** area/line | `chartMargins.hero`, hairline grid |
| **Lupi Editorial** | 30s+ | Unit decomposition, annotations, poster | Examples only (backlog) | custom marks + Card narrative |
| **Interactive / Big** | explore | Force, chord, thread | Out of scope v1 | `@visx/network`, `@visx/sankey` if product needs |
| **Maps** | ~30s | Choropleth | Out of scope v1 | app-level GeoJSON, not WMDS core |

## Visual grammar (Lieflat → WMDS tokens)

| Lieflat rule | WMDS equivalent |
|--------------|-----------------|
| Paper/ink ladder, no drop shadows | `--color-bg`, `--color-fg`, `--color-muted`, `--color-border` |
| Hairline 0.5–0.7px grid | `chartUiTokens.grid`, `@visx/grid` `strokeWidth={1}` |
| Chunky 2px+ bars | SegmentedBar / future `Chart.Bar` `segmentHeight` |
| Capsule bar ends | `@visx/shape` `Bar` `radius` top/bottom |
| Tabular value column | `chartTooltipValueClasses` (`justify-between`, `tabular-nums`) |
| quarticOut enter, stagger | `motion.css` tiers; `animate="initial"` on Cartesian / SegmentedBar |
| `prefers-reduced-motion` | Storybook `MotionConfig reducedMotion="user"` |
| Conclusion title, not chart type name | `cardTitleClasses` + KPI copy in **Card.Header** |
| Source line | **Card.Footer** or caption under legend |

---

## Glance · 20 charts (dashboard / <10s)

| ID | Lieflat name | Example data | WMDS status | WMDS pattern | visx / WMDS | Storybook / Example |
|----|--------------|--------------|-------------|--------------|-------------|---------------------|
| **G3** | Chunky Bars | `{ items: [{ id: "pro", label: "Pro", value: 420 }, …] }` ≤6 categories | **Backlog P1** | `Chart.Bar` vertical ranked | `@visx/shape` Bar, `scaleBand` | — |
| **G4** | Dot Waffle | `{ parts: [{ key: "organic", pct: 42 }, …], total: 100 }` | **Backlog P2** | `Chart.Waffle` or unit grid in **Card.Body** | hand SVG + `scaleLinear` | — |
| **G5** | Pictorial Bar | `{ years: [{ year: 2024, count: 1200, iconUnit: 100 }] }` | **Backlog P3** | `Chart.PictorialBar` | `@visx/shape` Bar + symbol repeat | — |
| **G6** | Circular Graph (small) | `{ nodes: [{ id, label }], edges: [{ source, target }] }` ≤12 nodes | **Reference** | — | `@visx/network` | — |
| **G7** | Tree LR | `{ name: "Platform", children: [{ name: "API", children: [...] }] }` | **Backlog P3** | App diagram or `Chart.Tree` | `@visx/hierarchy` | — |
| **G8** | Rainfall Dual Area | `{ points: [{ date, spend, signups }] }` two series, causal | **Partial** | **Chart.Cartesian** multi-series | `@visx/shape` AreaClosed ×2 | **Organisms/Chart → Pattern — area (multi series + legend)** |
| **G9** | Scatter Morph | `{ items: [{ id, x, y, z }] }` same entities, 3 dims | **Reference** | Motion morph between views | `@visx/shape` Circle + Motion | — |
| **G10** | Diverging Bar | `{ items: [{ label: "EMEA", delta: -12 }, { label: "APAC", delta: 8 }] }` | **Backlog P1** | `Chart.DivergingBar` | `@visx/shape` Bar, `scaleLinear` domain symmetric | — |
| **G11** | Force Graph (small) | `{ nodes, links }` center + satellites ≤15 | **Reference** | — | `@visx/network` | — |
| **G12** | Stagger Wave | `{ items: [{ label: "Market", value: 84 }, …] }` 30–60 bars | **Backlog P2** | `Chart.Bar` + stagger enter | `@visx/shape` Bar + Motion | — |
| **G13** | Big Slice (custom pie) | `{ slices: [{ label, share, intensity }] }` angle×radius | **Reference** | Prefer **G4/L14** unit logic in WMDS | `@visx/shape` Pie custom | — |
| **G14** | Single Axis (punch card) | `{ cells: [{ dow: 1, hour: 9, value: 4 }, …] }` 7×24 | **Backlog P1** | `Chart.Heatmap` punch | `@visx/heatmap` | — |
| **G15** | Jitter Strip | `{ groups: [{ key: "p1", values: [120, 98, …] }] }` | **Backlog P2** | `Chart.JitterPlot` | `@visx/shape` Circle, `scaleBand` | — |
| **G16** | Bar Race | `{ frames: [{ t, ranks: [{ id, value }] }] }` | **Out of scope** | Marketing/video — not dashboard DS | — | — |
| **G17** | Dynamic Stream | `{ stream: [{ t, value }] }` realtime | **Out of scope** | Live ops — app concern | — | — |
| **G18** | Draw-in + Counter | `{ series: [{ date, cumulative }], headline: 1280000 }` | **Partial** | KPI hero + **Chart.Cartesian** line | LinePath + `chartKpiHero*` | **Pattern — occupancy KPI in Card** (scalar not cumulative) |
| **G19** | Violin | `{ groups: [{ key, samples: number[] }] }` | **Backlog P3** | `Chart.Violin` | `@visx/stats` / KDE path | — |
| **G20** | Matrix Heat (Glance) | `{ rows: ["v1","v2"], cols: ["featA","featB"], values: [[1,2],[3,4]] }` | **Backlog P2** | `Chart.MatrixHeat` | `@visx/heatmap` | — |
| **G21** | Rank Strip | `{ periods: [{ label: "Q1", order: ["a","b","c"] }] }` | **Backlog P3** | Static rank table + spark bars | `@visx/shape` Bar | — |
| **G22** | Aggregate Sankey | `{ nodes: [{ id }], links: [{ source, target, value }] }` | **Backlog P2** | `Chart.Sankey` | `@visx/sankey` | — |

**Glance compose example (shipped partial — dual area):**

```tsx
const config = chartSeriesConfigFromKeys([
  { key: "spend", label: "Spend" },
  { key: "signups", label: "Signups" },
]);
<Card shape="rounded" bodyTerminal className="max-w-lg">
  <Card.Header start={<h2 className={cardTitleClasses}>Campaigns rain down</h2>} />
  <Card.Body>
    <div className={`flex flex-col gap-3 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}>
      <Chart.Cartesian data={points} config={config} periodKind="day" minHeight={220} animate="initial" />
      <Chart.Legend config={config} />
    </div>
  </Card.Body>
</Card>
```

---

## Lupi Editorial · 19 charts (~30s+ reading)

| ID | Lieflat name | Example data | WMDS status | WMDS pattern | visx / notes | Storybook |
|----|--------------|--------------|-------------|--------------|--------------|-----------|
| **L1** | Launch Fan | `{ entities: [{ name, bornAt, size }] }` | **Backlog P3** | `Chart.LaunchFan` radial timeline | custom path + `scaleTime` radial | — |
| **L2** | Dot Cascade | `{ units: [{ label, count }] }` unit chart, ranked | **Backlog P2** | `Chart.UnitColumn` | SVG circles grid | — |
| **L3** | Barcode Lollipop | `{ days: [{ date, value }] }` ~90 daily ticks | **Partial** | **Chart.Cartesian** compact / sparkline | `scaleTime`, thin lollipop | **Pattern — area** (area not lollipop yet) |
| **L4** | Arc Matrix | `{ rows, cols, matrix: number[][] }` ≤100 | **Backlog P3** | `Chart.ArcMatrix` | custom | — |
| **L5** | Radial Convergence | `{ items: [{ text, themeId }] }` many→few | **Backlog P3** | Poster layout in **Examples** | radial bundles | — |
| **L6** | Cluster Field | `{ nodes, edges }` poster network | **Reference** | **Examples** only | static `@visx/network` | — |
| **L7** | Brand Spectrum | `{ brand: 0.62, competitors: [{ name, pos: 0.4 }] }` bipolar | **Backlog P3** | `Chart.Spectrum` | `scaleLinear` [-1,1] | — |
| **L8** | Dotty Matrix | `{ squads: [{ id, grid: boolean[][] }] }` decorative | **Reference** | Examples / marketing | — | — |
| **L9** | Bubble Almanac | `{ years: [{ year, categories: [{ key, value, status }] }] }` | **Backlog P3** | `Chart.Almanac` | nested layout | — |
| **L10** | Radial Patchwork | `{ events: [{ at: Date, magnitude }] }` 24h polar | **Backlog P3** | `Chart.RadialPatchwork` | polar `scaleTime` | — |
| **L11** | Trend Lineage | `{ features: [{ name, segments: [{ start, end, kind }] }] }` | **Backlog P3** | `Chart.Lineage` | `@visx/shape` LinePath segments | — |
| **L12** | Type Colonnade | `{ owner: string, repos: string[] }[]` | **Backlog P3** | **TaskRows** + column viz in **Examples** | text + marks | — |
| **L13** | Hourglass Stream | `{ stages: [{ label, count }] }` funnel | **Backlog P2** | `Chart.Funnel` | `@visx/shape` trapezoids | — |
| **L14** | Hundred Field | `{ parts: [{ key, pct: 49 }] }` ≤6, sum≈100 | **Backlog P2** | `Chart.UnitGrid` 100 dots | SVG grid | — |
| **L15** | Ballot Tally | `{ options: [{ label, pct: 27.4 }] }` independent % | **Backlog P2** | `Chart.BallotTally` | unit ticks per option | — |
| **L16** | Matrix Heat | `{ xLabels, yLabels, values[][] }` ≤100, annotated | **Backlog P2** | `Chart.MatrixHeat` editorial | `@visx/heatmap` + labels | — |
| **L17** | Calendar Heat | `{ days: [{ date: "2026-01-04", value: 3 }] }` full year | **Backlog P2** | `Chart.CalendarHeat` | `@visx/heatmap` + week layout | — |
| **L19** | Ridgeline | `{ groups: [{ key, values: number[] }] }` 3–8 | **Backlog P3** | `Chart.Ridgeline` | KDE + offset paths | — |
| **L20** | Parallel Coordinates | `{ entities: [{ id, dims: { a:1, b:2, c:3 } }] }` | **Backlog P3** | `Chart.Parallel` | `@visx/shape` LinePath | — |

**Lupi editorial compose note:** Use **Card** with `bodyTerminal`, inset well, conclusion **Header** title, **Footer** source. Loading: **Skeleton** mirrors well + legend row; not mark-level state.

---

## Lupi Basics · 17 charts (sparse data, familiar silhouettes)

| ID | Lieflat name | Example data | WMDS status | WMDS pattern | visx packages | Storybook |
|----|--------------|--------------|-------------|--------------|---------------|-----------|
| **F1** | Rung Bars | `{ items: [{ label: "Pro", units: 42 }] }` ≤8 | **Backlog P1** | `Chart.Bar` countable vertical | `@visx/shape` Bar, `scaleBand` | — |
| **F2** | Hairline Line | `{ points: [{ date, value }] }` ≤30 days | **Partial** | **Chart.Cartesian** line (area optional) | `LinePath`, `scaleTime` | **Pattern — area (single series)** |
| **F3** | Hairline Area | `{ points: [{ date, value }] }` 30–60 days | **Shipped** | **Chart.Cartesian.Area** | `AreaClosed`, `curveMonotoneX` | **Pattern — area**, **occupancy history in Card** |
| **F4** | Tick Donut | `{ segments: [{ key, pct: 35 }] }` ≤6, sum 100 | **Backlog P2** | `Chart.Donut` unit ticks | `@visx/shape` Pie + custom ticks | — |
| **F5** | Tick Rows | `{ items: [{ label, units: 12 }] }` horizontal rank | **Backlog P1** | `Chart.Bar` horizontal | `@visx/shape` Bar, `scaleBand` vertical | — |
| **F6** | Paired Rungs | `{ items: [{ label, a: 10, b: 14 }] }` two series | **Backlog P2** | `Chart.GroupedBar` | `@visx/shape` BarGroup | — |
| **F7** | Stacked Rungs | `{ items: [{ label, parts: { east: 4, west: 2 } }] }` | **Backlog P2** | `Chart.StackedBar` | `@visx/shape` BarStack | — |
| **F8** | Plumb Scatter | `{ points: [{ x: 12, y: 4.2, label? }] }` ≤20 | **Backlog P2** | `Chart.Scatter` | `@visx/shape` Circle, `scaleLinear` ×2 | — |
| **F9** | Rung Waterfall | `{ steps: [{ label, delta: +12 }, { label, delta: -8, subtotal? }] }` | **Backlog P2** | `Chart.Waterfall` | `@visx/shape` Bar stacked offsets | — |
| **F10** | Dot Heat | `{ dow, hour, value }[]` 7×24 | **Backlog P1** | `Chart.Heatmap` | `@visx/heatmap` | — |
| **F11** | Tick Gauge | `{ value: 72, max: 100 }` | **Partial** | **Chart.SegmentedBar** + hero % | spring fill `animate="initial"` | **Pattern — occupancy KPI in Card** |
| **F12** | Dumbbell Queue | `{ items: [{ label, before: 10, after: 16 }] }` | **Backlog P1** | `Chart.Dumbbell` | `@visx/shape` Line + Circle | — |
| **F13** | Nested Treemap | `{ name, children: [{ name, value }] }` 2 levels | **Backlog P2** | `Chart.Treemap` | `@visx/hierarchy` | — |
| **F14** | Rung Histogram | `{ bins: [{ label: "0-1h", count: 42 }] }` | **Backlog P2** | `Chart.Histogram` | `@visx/shape` Bar | — |
| **F15** | Tick Box | `{ groups: [{ key, min, q1, median, q3, max, outliers[] }] }` | **Backlog P3** | `Chart.BoxPlot` | `@visx/stats` BoxPlot | — |
| **F16** | Stream Ribbon | `{ points: [{ date, a, b, c }] }` stacked over time | **Backlog P2** | `Chart.Stream` / stacked area | `@visx/shape` AreaStack | — |
| **F17** | Candlestick | `{ bars: [{ date, open, high, low, close }] }` | **Backlog P3** | `Chart.Candlestick` | `@visx/shape` custom OHLC | — |

**Shipped Basics example (F3 occupancy history):**

```tsx
const config = chartSeriesConfigFromKeys([
  { key: "occupied", label: "Occupied units" },
  { key: "available", label: "Available units" },
]);
const data = buildOccupancyAreaSeries(30); // { date, occupied, available }[]

<Chart.Cartesian
  data={data}
  config={config}
  periodKind="month"
  minHeight={220}
  animate="initial"
  aria-label="Occupied and available units over the selected period"
/>
```

**Shipped Basics example (F11 capacity gauge):**

```tsx
<Chart.SegmentedBar value={144} max={200} tone="primary" fill="velocity" animate="initial" />
```

---

## Maps · 2 (explicit user request only)

| ID | Lieflat name | Example data | WMDS status | Notes |
|----|--------------|--------------|-------------|-------|
| **M1** | US Choropleth | `{ states: [{ id: "CA", value: 1200 }] }` | **Out of scope v1** | App-level GeoJSON + ECharts/maplibre; not WMDS Chart organism |
| **M2** | World Choropleth | `{ countries: [{ id: "US", value: 900 }] }` | **Out of scope v1** | Same |

If product requires maps: new **Examples** tier, not `Organisms/Chart` export, unless ADR amends scope.

---

## Interactive big · 3 (full-page exploration)

| ID | Lieflat file | Example data | WMDS status | visx if ported |
|----|--------------|--------------|-------------|----------------|
| **B1** | `big-circular.html` | `{ nodes: ~60, edges }` chord-like | **Reference** | `@visx/network` + custom chord |
| **B2** | `big-force.html` | `{ nodes: ~180, edges }` | **Reference** | `@visx/network` force layout |
| **B3** | `big-threads.html` | `{ paths: [{ stages: [a,b,c], value }] }` | **Backlog P3** | `@visx/sankey` multi-stage |

Lieflat live demos: [Force Graph template](https://larashero3-dotcom.github.io/lieflat-charts/templates/big-force.html).

---

## Report templates · 12 (Lieflat HTML → WMDS Examples)

Reports are **Examples/** compositions (not package exports): **Card** grids + **Chart** patterns + **Select** period + typography tokens.

| ID | Lieflat report | Typical charts (from catalog) | WMDS Example target | Status |
|----|----------------|------------------------------|---------------------|--------|
| **R01** | Survey One-Pager | G3, L14, F2 | `Examples/SurveyOnePager` | **Backlog** |
| **R02** | Annual Milestones | L1, F3, G18 | `Examples/AnnualMilestones` | **Backlog** |
| **R03** | Year in Data | L3, L17, G12 | `Examples/YearInData` | **Backlog** |
| **R04** | Monthly Ops | G10, F3, G14, KPI | `Examples/MonthlyOps` — reuse occupancy KPI + history | **Partial** (Card patterns exist) |
| **R05** | Impact Story | L13, L14 | `Examples/ImpactStory` | **Backlog** |
| **R06** | Eight-Year Almanac | L9, F3 | `Examples/ProductAlmanac` | **Backlog** |
| **R07** | Survey Collage Poster | L15, G4, L2 | `Examples/SurveyPoster` | **Backlog** |
| **R08** | Population One-Pager | L14, G4 | `Examples/PopulationBrief` | **Backlog** |
| **R09** | Data Story Dashboard | G3, G10, F11, G20 | `Examples/OpsDashboard` — grid of **Card** KPIs | **Partial** |
| **R10** | Travel Notebook | F2, L17, F8 | `Examples/TravelNotebook` | **Backlog** |
| **R11** | Research Brief Card | F11, F2 | `Examples/ResearchBrief` fixed aspect | **Backlog** |
| **R12** | Weekly Glance | G3, G10, G14, G21 | `Examples/WeeklyGlance` | **Backlog** |

**R04 / R09 partial compose (dashboard row today):**

```tsx
<div className="grid gap-4 md:grid-cols-2 max-w-5xl">
  {/* Pattern — occupancy KPI in Card (F11 / G18 tone) */}
  {/* Pattern — occupancy history in Card (F3) */}
</div>
```

---

## Data-shape decision tree (quick recall)

Use Lieflat §4 ordering; map leaf → ID above.

| Data shape | Prefer Lieflat | WMDS first choice | If missing |
|------------|----------------|-------------------|------------|
| Scalar capacity 0–max | F11, G18 | **SegmentedBar** KPI | — |
| Daily/monthly series | F2, F3, L3 | **Cartesian.Area** | add line-only variant |
| Multi-series time | F3, G8 | **Cartesian** + **Legend** | — |
| ≤8 category compare | F1, F5, G3 | **Bar** (backlog) | temporary: sorted table + SegmentedBar per row |
| ± delta by category | G10 | **DivergingBar** (backlog) | — |
| Before/after per category | F12 | **Dumbbell** (backlog) | — |
| 100% composition ≤6 | F4, G4, L14 | **UnitGrid/Waffle** (backlog) | SegmentedBar only for single scalar capacity |
| Week×hour density | F10, G14 | **Heatmap** (backlog) | — |
| Funnel stages | L13 | **Funnel** (backlog) | — |
| OHLC | F17 | **Candlestick** (backlog) | — |
| Network explore | B2, G11 | **Examples** only | — |

---

## Implementation priority (WMDS backlog)

| Priority | Lieflat IDs | WMDS deliverable |
|----------|-------------|------------------|
| **P1** | G3, G10, G14, F1, F5, F10, F12 | `Chart.Bar`, `Chart.DivergingBar`, `Chart.Heatmap`, `Chart.Dumbbell` + Pattern stories |
| **P2** | G4, G12, G20, G22, F4, F6–F9, F13–F16, L13–L17 | Composition, grouped/stacked, sankey, calendar |
| **P3** | L1–L12, L19–L20, G5–G7, G15, G19, G21, F14–F15, F17, B3 | Editorial **Examples** and specialty marks |
| **Shipped** | F3, F11 (partial), G8 (partial) | **Cartesian**, **SegmentedBar**, Card patterns |

Each new pattern: extend **`chartTheme.ts`**, add **`Chart.*` compound**, **Reference + Pattern** stories, **`storyCopySource` on Pattern only**, run **`npm run validate:composition`**.

---

## Lieflat gallery lookup (for visual spec)

| Family | Gallery file |
|--------|----------------|
| Glance | `templates/glance-gallery.html` |
| Lupi Editorial | `templates/lupi-gallery.html` |
| Lupi Basics | `templates/basics-gallery.html` |
| Maps | `templates/maps-gallery.html` |
| Big interactive | `templates/big-force.html`, `big-circular.html`, `big-threads.html` |
| Reports | `templates/reports/report-NN.{zh,en}.html` |
| Color skins | `templates/color/` (reference only — WMDS uses ADR-0013 tokens) |

Find implementation: card title in HTML → `// ════ Chart name ════` block in `<script>`.

---

## Related WMDS docs

- **ADR-0012** — visx only
- **ADR-0013** — series color tiers
- **ADR-0014** — SegmentedBar capacity-only
- **ADR-0015** — Cartesian, tooltip, legend, loading phases
- **AGENTS.md** — Chart + Skeleton + resume pointers
- [scales-and-packages.md](scales-and-packages.md) — visx scale math
