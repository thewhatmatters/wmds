// @whatmatters/wmds@0.2.0 · Pattern — matrix heatmap
// Storybook: Components/Chart → Pattern — matrix heatmap (?path=/story/components-chart--audience-activity-heatmap)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chart, type ChartHeatmapAxisItem, type ChartHeatmapCell } from "@whatmatters/wmds";

export function AudienceActivityHeatmap({
  rows,
  columns,
  cells,
}: {
  rows: ChartHeatmapAxisItem[];
  columns: ChartHeatmapAxisItem[];
  cells: ChartHeatmapCell[];
}) {
  return (
    <Chart.Heatmap
      aria-label="Illustrative audience activity by day and time"
      rows={rows}
      columns={columns}
      cells={cells}
      metricLabel="Activity"
      minHeight={240}
    />
  );
}
