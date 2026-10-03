// @whatmatters/wmds@0.2.0 · Pattern — ranked audience breakdown
// Storybook: Components/Chart → Pattern — ranked audience breakdown (?path=/story/components-chart--ranked-audience-breakdown)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chart } from "@whatmatters/wmds";

<Chart.RankedBars
  aria-label="Top audience countries"
  items={[
    { label: "United States", value: 42 },
    { label: "United Kingdom", value: 18 },
    { label: "Canada", value: 11 },
    { label: "Australia", value: 8 },
  ]}
  animate="initial"
/>
