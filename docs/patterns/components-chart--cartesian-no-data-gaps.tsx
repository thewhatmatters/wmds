// @thewhatmatters/wmds@0.4.7 · Pattern — Cartesian no-data gaps
// Storybook: Components/Chart → Pattern — Cartesian no-data gaps (?path=/story/components-chart--cartesian-no-data-gaps)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chart, chartSeriesConfigFromTone } from "@thewhatmatters/wmds";

const config = chartSeriesConfigFromTone("reach", "Reach", "primary");

const start = new Date(2026, 5, 1);
const data = Array.from({ length: 30 }, (_, index) => {
  const date = new Date(start);
  date.setDate(start.getDate() + index);
  const offset = index - 10;
  const reach = index < 10 ? null : Math.round(4150 + Math.sin(offset / 4) * 80 + offset * 6);
  return { date, reach };
});

<Chart.Cartesian
  data={data}
  config={config}
  seriesKeys={["reach"]}
  periodKind="month"
  noData={{ label: "No data" }}
  aria-label="Reach over 30 days. Early dates have no data."
/>
