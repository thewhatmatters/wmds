# Using WMDS in other apps

WMDS is **optional** — add it only to projects where you want the What Matters design language. Other apps can keep their own UI or mix WMDS primitives with custom layout.

## Requirements

- **React** 18 or 19
- **Tailwind v4** in the consumer (recommended — components use token-mapped utilities like `bg-primary`, `text-muted`)
- **IBM Plex** loads automatically via `@whatmatters/wmds/styles.css` (Google Fonts)
- **Recharts** 3.x when using `Chart` (`npm install recharts`)

Icons are **not** bundled — install `lucide-react` (or any SVG) in your app and pass via `icon` / `startSlot`.

## Install

Pick one:

```bash
# Local sibling repo (best while iterating)
npm install ../wmds

# GitHub (after dist is built and committed, or use npm prepare on publish)
npm install github:thewhatmatters/wmds

# npm (when published)
npm install @whatmatters/wmds
```

In the **wmds** repo, build the package first:

```bash
cd wmds && npm install && npm run build
```

That produces `dist/index.js`, `dist/index.d.ts`, and `dist/styles.css`.

## Wire up styles (once per app)

Import the stylesheet in your app root — Next.js `app/layout.tsx`, Vite `main.tsx`, etc.:

```tsx
import "@whatmatters/wmds/styles.css";
```

Dark mode — same as Storybook:

```tsx
<html data-wmds-theme={dark ? "dark" : undefined}>
```

Or toggle on any ancestor: `data-wmds-theme="dark"`.

### Tokens only (advanced)

If your app already has Tailwind and only needs CSS variables:

```css
@import "@whatmatters/wmds/tokens.css";
@import "@whatmatters/wmds/theme-dark.css";
```

You must still mirror the `@theme inline` bridge from `src/styles/wmds.css` or utilities like `bg-surface` will not resolve. Prefer **`styles.css`** unless you know you need granular control.

## Use components

```tsx
import { Button, Card, List, StatusRing, Tab, Badge } from "@whatmatters/wmds";
import { Plus } from "lucide-react";

export function PortfolioPanel() {
  return (
    <Card variant="outlined" elevation="raised" padding="none" className="max-w-md">
      <Tab.Group value="value" onValueChange={() => undefined} aria-label="Views" layout="equal">
        <Tab value="value">Value</Tab>
        <Tab value="held">Held</Tab>
      </Tab.Group>

      <List variant="contained">
        <List.Item>
          <List.ItemRow>
            <List.ItemMedia>
              <StatusRing count={2} decorative />
            </List.ItemMedia>
            <List.ItemLabel>Open positions</List.ItemLabel>
            <List.ItemMeta>+$2.38</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
        <List.Item>
          <List.ItemRow>
            <List.ItemLabel>Cash</List.ItemLabel>
            <List.ItemMeta>$369.49</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
      </List>

      <Button icon={<Plus strokeWidth={2} />}>New</Button>
    </Card>
  );
}
```

## What is not exported

| Path | Notes |
|------|--------|
| `src/examples/*` | Storybook specimens only (`TaskRows`, `RestockCard`, …) |
| Paper MCP | Design-time only — not a runtime dependency |
| Storybook | Catalog for humans/agents — not shipped |

Copy patterns from Examples into your app; do not import example files from the package.

## Charts

Install Recharts alongside WMDS:

```bash
npm install recharts
```

```tsx
import { Chart, resolveChartTone, chartTheme } from "@whatmatters/wmds";

// Hero portfolio curve — tone from first vs last point
<Chart.Area
  data={curve}
  dataKey="total_value"
  xKey="date"
  variant="hero"
  tone="auto"
  label="Value"
  height={300}
  formatValue={(n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })}
  formatLabel={(d) => d} // pass ISO dates; format in app (e.g. Jun 16, 2026)
/>

// Inline position sparkline (dot-grid on by default)
<Chart.Sparkline values={closes} tone="auto" width={104} height={30} />

// Opt out of dot grid
<Chart.Area ... showGrid={false} />
```

Use **`chartTheme`** / **`resolveChartTone`** when composing raw Recharts in app code (e.g. existing shadcn `ChartContainer`):

```tsx
import { chartStroke, chartGradientStops, chartMargins } from "@whatmatters/wmds";

const stroke = chartStroke("success");
const gradient = chartGradientStops("success", "hero");
const margin = chartMargins.compact;
```

## Carousel

Manual prev/next only — no autoplay. Compose slide copy with inline chips and figures:

```tsx
import { Badge, Carousel, StatusDot } from "@whatmatters/wmds";

<Carousel title="Insights" index={index} onIndexChange={setIndex}>
  <Carousel.Slide>
    The best performer in your{" "}
    <Badge variant="neutral" startSlot={<StatusDot variant="warning" decorative />}>
      @Creamery
    </Badge>{" "}
    is Pistachio — up{" "}
    <span className="font-mono text-[11.5px] text-success">+4.2%</span>.
  </Carousel.Slide>
</Carousel>
```

**Badge chips** (`startSlot` / `endSlot`) use baseline alignment for inline prose — avoid overriding with `align-middle`.

## Customization

- **Variants** — `Card variant`, `List variant`, `Button variant`, etc.
- **className** — all primitives accept Tailwind classes; radius and chrome are not fixed by Paper mockups.
- **Tokens** — sync from Paper → `tokens.css` → rebuild package; all apps pick up changes on upgrade.

## Monorepo (optional)

```json
{
  "workspaces": ["apps/*", "packages/wmds"]
}
```

```json
{
  "dependencies": {
    "@whatmatters/wmds": "workspace:*"
  }
}
```

Run `npm run build` in the wmds workspace when components change.

## Publishing checklist

1. `npm run build` — refresh `dist/`
2. Bump version in `package.json`
3. Set `"private": false` or use GitHub Packages
4. `npm publish` (or tag a GitHub release with built `dist/` if installing from git)

Until publish, **`file:../wmds`** or **`npm link`** is the smoothest path.

### Install from GitHub

`dist/` is not committed (gitignored). **`prepare`** runs `npm run build` on `npm install` from git — requires devDependencies (Node, no `--omit=dev` on first install).

```bash
npm install github:thewhatmatters/wmds
```
