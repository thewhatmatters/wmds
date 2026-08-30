# Using WMDS in other apps

## Philosophy — pattern-first

WMDS is **not** utility-class-first. You do **not** build product UI by composing `bg-primary`, `text-sm`, and ad-hoc borders across the app.

**Do this:**

```tsx
import { Button, Badge, Chip, ChipFilterGroup, IconButton, Input, StatusDot } from "@whatmatters/wmds";
import "@whatmatters/wmds/styles.css";

<Button status={status}>Submit</Button>
<Button role="secondary" count={3}>Inbox</Button>
<Button role="primary" icon={<Plus strokeWidth={2} />}>New item</Button>
<IconButton icon={<Settings strokeWidth={2} />} aria-label="Open settings" title="Settings" />
<Badge variant="success">Online</Badge>
<span className="inline-flex items-center gap-1.5">
  <StatusDot variant="success" besideLabel />
  Online
</span>
```

Browse patterns in Storybook under **Examples/** — copy JSX and state wiring into your app; Examples are not exported from the package.

**Not this:**

```tsx
// Avoid — re-inventing WMDS patterns
<button className="rounded-full bg-primary px-5 …">Submit</button>
<Button startSlot={<img … />} badge="New" variant="success" />
```

Use Tailwind in your app for **page layout** (`grid`, `gap`, `max-w`, responsive columns) and spacing **between** WMDS components. Use **`className` on a component** for layout tweaks (width, margin) — not for new variants or colors.

New visuals require a WMDS component or Example pattern — see **`docs/adr/0004-pattern-first-not-utility-first.md`**.

## Requirements

- **React** 18 or 19
- **Tailwind v4** recommended — import WMDS styles or theme
- **Motion** — `npm install motion` when using animated components
- **Lucide** — `lucide-react` for icons passed into component props

## Install

```bash
npm install ../wmds   # local
# or github: / npm when published
```

Build the package:

```bash
cd wmds && npm install && npm run build
```

## Wire up styles

```tsx
import "@whatmatters/wmds/styles.css";
```

Or theme only (if you configure Tailwind yourself):

```css
@import "@whatmatters/wmds/theme.css";
```

## Dark mode

```tsx
<html data-theme={dark ? "dark" : undefined}>
```

Toggle on any ancestor — same token names, values from `colors.css`.

## Components

Import from the package — configure via **props**, not utility strings:

```tsx
import {
  Button,
  IconButton,
  Badge,
  Card,
  Chip,
  ChipFilterGroup,
  ContentRail,
  Input,
  List,
  Search,
  StatusDot,
  TaskRows,
  buttonRoles,
  getNextButtonStatus,
  type ButtonRole,
  type ButtonStatus,
} from "@whatmatters/wmds";
```

| Component | Key props | Storybook |
|-----------|-----------|-----------|
| `Button` | `role`, `size`, `status`, `icon`, `count` | Atoms/Button — copy a **Pattern** story |
| `IconButton` | `icon`, `aria-label`, `role`, `size`, `fab`, `loading`, `title` | Atoms/IconButton — copy a **Pattern** story |
| `Chip` | `size`, `value`, `selected`, `onRemove`, `icon`, `count`, `readOnly` | Molecules/Chip — use `ChipFilterGroup` for multi-select filters |
| `Input` | `label`, `description`, `status`, `message`, `loading`, `endBadge`, `icon`, `size`, `shape` | Atoms/Input — Required via `endBadge={<Badge>…</Badge>}` |
| `Search` | `size`, `placeholder`, `onSubmit` | Molecules/Search — inline input + button row |
| `List` | `variant`, `hasDividers`, `header` | Molecules/List — `List.Item` with `layout`, `primary`, `secondary`, `meta`, `trailing`, `onPress`, `selected` |
| `Card` | `variant`, `shape`, `padding` | Molecules/Card — `Card.Header`, `Card.Body`, `Card.Footer`, `Card.Divider` |
| `ContentRail` | `position`, `width`, `header` | Molecules/ContentRail — map + list pane beside main canvas |
| `TaskRows` | `variant`, `detailsLayout` | Molecules/TaskRows — expandable rows; **Pattern — FM market detail** |
| `Badge` | `variant`, `size`, `count`, `icon` | Atoms/Badge — copy a **Pattern** story |
| `StatusDot` | `variant`, `label`, `besideLabel`, `pulsing` | Atoms/StatusDot — copy a **Pattern** story |

Copy flow patterns from **Examples/** in Storybook when they ship. See **`src/package.manifest.ts`** for the export contract.

## Farmer Market — integrate into your app

WMDS ships **primitives + Storybook examples** for [farmermarket.us](https://farmermarket.us). Your app owns routing, map library, API/geo data, and page chrome.

### 1. Install and styles

```bash
# From the FM app repo (adjust path to your WMDS clone)
npm install ../wmds
cd ../wmds && npm install && npm run build
```

```tsx
// App root (e.g. layout.tsx or _app.tsx)
import "@whatmatters/wmds/styles.css";
```

Peer deps in the FM app:

```bash
npm install motion lucide-react
```

### 2. Browse layout (map + list rail)

Viewport-height flex row — map is `flex-1`, rail is **`ContentRail`** at `md:`+.

```tsx
import { ContentRail, Input, Chip, ChipFilterGroup, List, IconButton } from "@whatmatters/wmds";
import { MapPin, X } from "lucide-react";

<div className="flex h-[100dvh] flex-col md:flex-row">
  {/* Map — your map library; WMDS does not own this */}
  <div className="relative min-h-[40vh] flex-1 md:min-h-0">{/* map + overlay slot */}</div>

  <ContentRail
    aria-label="Market results"
    position="end"
    width="sm"
    header={
      <>
        <Input
          shape="pill"
          placeholder="ZIP or city"
          aria-label="Location"
          icon={<MapPin strokeWidth={2} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ChipFilterGroup aria-label="Market filters" value={filters} onValueChange={setFilters}>
          <Chip value="snap">SNAP</Chip>
          <Chip value="open-today">Open today</Chip>
        </ChipFilterGroup>
      </>
    }
  >
    <List variant="ghost" hasDividers>
      {markets.map((market) => (
        <List.Item
          key={market.id}
          layout="stacked"
          primary={market.name}
          secondary={market.street}
          meta={`${market.miles} mi`}
          trailing={market.snap ? <Chip readOnly size="sm">SNAP</Chip> : undefined}
          selected={market.id === selectedId}
          onPress={() => setSelectedId(market.id)}
        />
      ))}
    </List>
  </ContentRail>
</div>
```

Full wiring: **Storybook → Examples/FarmerMarket → Browse**.

### 3. Map overlay (market detail)

WMDS does **not** export a map overlay component. Two integration paths:

**A — Copy the example (fastest)**  
Copy `src/examples/FarmerMarket/MarketDetailCard.tsx` into the FM app. Map your API fields to `FarmerMarketDetail`, mount in the map library’s overlay slot, pass `onClose` to dismiss.

**B — Compose from exports**  
Follow **Molecules/TaskRows → Pattern — FM market detail**: `Card variant="outlined" shape="rounded"` + `TaskRows variant="capsule"` with directions (`detailsLayout="actions"`) and services (`detailsLayout="chips"`).

Mount overlay inside your map component — Storybook demo positions bottom-left on `md:`+; your map library owns placement.

### 4. What stays in the app

| Concern | Owner |
|---------|--------|
| Map library + overlay positioning | FM app |
| Search / Find UX (pill morph vs rail search) | FM app + product — both patterns exist in Storybook |
| Filter logic, geo distance, API | FM app |
| Header, logo, bottom nav | FM app |
| Apple Maps / Google Maps deep links | FM app — wire `TaskRows.Detail onPress` |

### 5. Storybook reference

```bash
cd wmds && npm run storybook
```

| Story | Use |
|-------|-----|
| **Examples/FarmerMarket → Browse** | End-to-end map + rail + overlay on row select |
| **Examples/FarmerMarket → Detail — map overlay content** | Isolated overlay card |
| **Examples/FarmerMarket → Find morph** | Hero Find pill (optional — product decision) |
| **Molecules/TaskRows → Pattern — FM market detail** | Component contract for overlay rows |

Roadmap: **`docs/farmermarket-component-roadmap.md`**

## Icons

**Lucide only** until further notice. Pass icons into component props — do not embed icon styling utilities in app code.

```tsx
import { Plus } from "lucide-react";

<Button icon={<Plus strokeWidth={2} />}>New item</Button>
```

Browse [lucide.dev/icons](https://lucide.dev/icons/).

## Customization

Brand theming: edit semantic roles in **`src/theme/colors.css`**, rebuild, bump the package. Do **not** fork component visuals with per-app utility overrides — extend WMDS via new variants/patterns in the design system repo.
