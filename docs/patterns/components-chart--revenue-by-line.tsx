// @thewhatmatters/wmds@0.4.31 · Pattern — revenue by line
// Storybook: Components/Chart → Pattern — revenue by line (?path=/story/components-chart--revenue-by-line)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Card,
  Chart,
  Stat,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
  cardTitleClasses,
  chartSeriesConfigFromTone,
  type ChartCartesianPoint,
} from "@thewhatmatters/wmds";

const config = chartSeriesConfigFromTone("revenue", "Revenue", "primary");

const data: ChartCartesianPoint[] = [
  { date: new Date(2026, 0, 1), revenue: 18420 },
  { date: new Date(2026, 1, 1), revenue: 22100 },
  { date: new Date(2026, 2, 1), revenue: 19840 },
  { date: new Date(2026, 3, 1), revenue: 24610 },
  { date: new Date(2026, 4, 1), revenue: 27330 },
  { date: new Date(2026, 5, 1), revenue: 26150 },
];

export function RevenueByLine() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <section>
        <Card>
        <Card.Header start={<h2 className={cardTitleClasses}>Revenue by line</h2>} />
        <Card.Body>
          <div
            className={`grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}
          >
            <Chart.Cartesian
              data={data}
              config={config}
              seriesKeys={["revenue"]}
              periodKind="month"
              minHeight={220}
              animate="none"
              aria-label="Revenue by month"
            />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <Stat label="Subscriptions" value="$42,180" trend={{ value: "+12%", direction: "up" }} />
              <Stat label="Services" value="$18,640" trend={{ value: "-3%", direction: "down" }} />
              <Stat label="Licenses" value="$9,210" trend={{ value: "0%", direction: "neutral" }} />
            </div>
          </div>
        </Card.Body>
        </Card>
      </section>
      <section>
        <Card>
        <Card.Header start={<h2 className={cardTitleClasses}>Revenue by line</h2>} />
        <Card.Body>
          <p className="type-body text-muted px-4 py-6" role="status">
            Revenue by line is not wired
          </p>
        </Card.Body>
        </Card>
      </section>
    </div>
  );
}
