// @thewhatmatters/wmds@0.4.5 · Pattern — occupancy KPI in Card
// Storybook: Components/Chart → Pattern — occupancy KPI in Card (?path=/story/components-chart--occupancy-in-card)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Card, Chart, Select, chartFormatPercent, chartKpiHeroRowClasses, chartKpiHeroValueClasses, chartKpiTrendLabelClasses, chartKpiTrendRowClasses, chartKpiTrendValueClasses, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardLayoutBodyOccupantWellClasses, cardTitleClasses } from "@thewhatmatters/wmds";

const occupied = 144;
const total = 200;
const periodOptions = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

<Card shape="rounded" className="max-w-lg">
  <Card.Header
    start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
    end={
      <Select
        aria-label="Reporting period"
        size="sm"
        options={periodOptions}
        defaultValue="month"
        className="w-36"
      />
    }
  />
  <Card.Body>
    <div className={`flex flex-col gap-2 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}>
      <div className={chartKpiHeroRowClasses}>
        <span className={chartKpiHeroValueClasses}>{chartFormatPercent(occupied, total)}</span>
        <div className={chartKpiTrendRowClasses}>
          <span className={`${chartKpiTrendValueClasses} text-success`}>+4.2%</span>
          <span className={chartKpiTrendLabelClasses}>From last month</span>
        </div>
      </div>
      <Chart.Frame>
        <Chart.SegmentedBar value={occupied} max={total} tone="primary" fill="velocity" animate="initial" />
      </Chart.Frame>
    </div>
  </Card.Body>
  <Card.Footer>
    <span className="type-supporting text-muted">Occupied units: {occupied}/{total}</span>
    <Button role="secondary" size="sm">
      View breakdown
    </Button>
  </Card.Footer>
</Card>
