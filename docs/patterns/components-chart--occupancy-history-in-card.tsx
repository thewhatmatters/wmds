// @thewhatmatters/wmds@0.4.9 · Pattern — occupancy history in Card
// Storybook: Components/Chart → Pattern — occupancy history in Card (?path=/story/components-chart--occupancy-history-in-card)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Card,
  Chart,
  Select,
  chartSeriesConfigFromKeys,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
  cardTitleClasses,
  type ChartCartesianPoint,
  type SelectOption,
} from "@thewhatmatters/wmds";

const config = chartSeriesConfigFromKeys([
  { key: "occupied", label: "Occupied units" },
  { key: "available", label: "Available units" },
]);

export function OccupancyHistoryCard({
  data,
  periodOptions,
}: {
  data: ChartCartesianPoint[];
  periodOptions: SelectOption[];
}) {
  return (
    <Card shape="rounded" bodyTerminal className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Occupancy history</h2>}
        end={<Select aria-label="Reporting period" size="sm" options={periodOptions} defaultValue="month" className="w-36" />}
      />
      <Card.Body>
        <div className={`flex flex-col gap-3 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}>
          <Chart.Cartesian data={data} config={config} periodKind="month" minHeight={220} animate="initial" />
          <Chart.Legend config={config} />
        </div>
      </Card.Body>
    </Card>
  );
}
