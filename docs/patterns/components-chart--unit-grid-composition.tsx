// @thewhatmatters/wmds@0.3.0 · Pattern — 100-unit composition
// Storybook: Components/Chart → Pattern — 100-unit composition (?path=/story/components-chart--unit-grid-composition)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chart, chartSeriesConfigFromKeys } from "@thewhatmatters/wmds";

const config = chartSeriesConfigFromKeys([
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "unspecified", label: "Not specified" },
]);

<Chart.UnitGrid
  aria-label="Audience gender: 68% women, 30% men, 2% not specified"
  config={config}
  parts={[
    { key: "women", value: 68 },
    { key: "men", value: 30 },
    { key: "unspecified", value: 2 },
  ]}
  minHeight={240}
/>
