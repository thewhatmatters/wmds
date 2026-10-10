// @thewhatmatters/wmds@0.4.8 · Pattern — chart comparison gallery
// Storybook: Guides/Chart explorations → Pattern — chart comparison gallery (?path=/story/guides-chart-explorations--comparison-gallery)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Card,
  Chart,
  PageHeader,
  chartSeriesConfigFromKeys,
  type ChartDistributionItem,
  type ChartHeatmapAxisItem,
  type ChartHeatmapCell,
  type ChartUnitGridPart,
} from "@thewhatmatters/wmds";

const compositionConfig = chartSeriesConfigFromKeys([
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "unspecified", label: "Not specified" },
]);

export function ChartComparison({
  composition,
  postReach,
  activity,
}: {
  composition: ChartUnitGridPart[];
  postReach: ChartDistributionItem[];
  activity: { rows: ChartHeatmapAxisItem[]; columns: ChartHeatmapAxisItem[]; cells: ChartHeatmapCell[] };
}) {
  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">
      <div className="band pt-8">
        <section className="col-span-full">
          <PageHeader variant="page" title="Chart explorations" />
        </section>

        <div className="band gap-y-6 [align-items:stretch]">
          <Card className="col-span-full h-full min-w-0 lg:col-span-6">
            <Card.Body className="flex-1">
              <Chart.UnitGrid
                aria-label="Audience composition"
                config={compositionConfig}
                parts={composition}
                minHeight={240}
              />
            </Card.Body>
          </Card>

          <Card className="col-span-full h-full min-w-0 lg:col-span-6">
            <Card.Body className="flex-1">
              <Chart.DistributionStrip
                aria-label="Recent post reach distribution"
                items={postReach}
                     metricLabel="Reach"
                reference={{ value: 9300, label: "Typical 9.3K" }}
                minHeight={240}
              />
            </Card.Body>
          </Card>

          <Card className="col-span-full h-full min-w-0 lg:col-span-6">
            <Card.Body className="flex-1">
              <Chart.Heatmap
                aria-label="Audience activity by day and time"
                rows={activity.rows}
                columns={activity.columns}
                cells={activity.cells}
                     metricLabel="Activity"
                minHeight={240}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  );
}
