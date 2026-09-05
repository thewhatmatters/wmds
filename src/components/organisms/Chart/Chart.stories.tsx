import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../atoms/Button/Button";
import { Card, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantWellClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { Select, type SelectOption } from "../../molecules/Select/Select";
import { typographyClass } from "../../../lib/typography";
import {
  chartSeriesConfigFromKeys,
  chartSeriesConfigFromTone,
  chartTooltipItemsFromConfig,
} from "../../../lib/chartTheme";
import { buildOccupancyAreaSeries } from "../../../lib/chartSampleData";
import { backgroundPatternDotGridClasses } from "../../../lib/backgroundPatterns";
import { cn } from "../../../lib/cn";
import { withStoryCopySource } from "../../../lib/storyCopySource";
import {
  Chart,
  chartFormatPercent,
  chartKpiHeroRowClasses,
  chartKpiHeroValueClasses,
  chartKpiTrendLabelClasses,
  chartKpiTrendRowClasses,
  chartKpiTrendValueClasses,
} from "./Chart";
import {
  chartCartesianWireframeClasses,
  chartTooltipCrosshairClasses,
} from "./chartStyles";

const kpiMetaClasses = `${typographyClass("caption")} text-muted`;

const occupancyPeriodOptions: SelectOption[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

const occupancySeriesConfig = chartSeriesConfigFromKeys([
  { key: "occupied", label: "Occupied units" },
  { key: "available", label: "Available units" },
]);

const occupancyAreaData = buildOccupancyAreaSeries(30);

const occupancyTooltipValues = { occupied: 144, available: 56 };

const occupiedToneConfig = chartSeriesConfigFromTone("occupied", "Occupied units", "primary");

const meta = {
  title: "Organisms/Chart",
  component: Chart,
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "padded",
    docs: {
      source: {
        disable: true,
      },
      description: {
        component: `
## Usage

Dashboard visualizations on **visx v4** — WMDS owns the **shell**; patterns own **marks**. Not every chart uses x/y axes.

| Plot family | Pattern | Axes |
|-------------|---------|------|
| **Capacity meter** | \`Chart.SegmentedBar\` — \`value\` / \`max\`, \`fill="velocity"\` \| \`semantic\` | No |
| **Cartesian** | \`Chart.Cartesian\` + \`Chart.Cartesian.Area\` — daily / multi-series history | Yes |

**Tooltip + legend** — **ADR-0015**. Hover a Cartesian plot for crosshair + frosted tooltip; **Chart.Legend** uses the same \`ChartSeriesConfig\` / \`chartSeriesColor\` palette (**ADR-0013**). **SegmentedBar** has no tooltip.

## Anatomy

\`\`\`
Chart.Frame          — responsive width, segment height var, no axes assumed
└── Chart.SegmentedBar — capacity meter only (\`role="meter"\`); not for daily history
\`\`\`

Card.Header / Footer usually carry KPI copy; the chart mark sits in **Card.Body**.

## Best practices

- **Do** wrap marks in \`Chart.Frame\` — set \`segmentHeight\` when the default tick height is wrong.
- **Do** pair scalar charts with hero KPI + inline mono trend (\`chartKpiTrend*\` classes) — not **Badge**.
- **Do** use \`chartFormatPercent(value, max)\` for headline percent copy.
- **Do** pass \`label\` when \`role="meter"\` needs more context than a percent.
- **Do** use \`Chart.SegmentedBar\` only for **capacity** — snapshot fill (\`value\` / \`max\`). Daily history → **Chart.Area** (planned).
- **Do** use \`fill="velocity"\` for occupancy-style capacity bars; \`fill="semantic"\` for RAG utilization meters.
- **Don't** use \`Chart.SegmentedBar\` for per-day or per-week strips — ticks are not calendar buckets.
- **Don't** put axis assumptions in \`Chart.Frame\` — add \`Chart.Cartesian\` when area/bar ships.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TooltipContentReference: Story = {
  name: "Reference — tooltip content",
  parameters: {
    docs: {
      description: {
        story:
          "Static **Chart.Tooltip.Content** — shadcn Chart parity on WMDS popover tokens. Header label + indicator + series name + tabular value. Wired to visx on **Chart.Area** (ADR-0015).",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>Single series</span>
        <Chart.Tooltip.Content
          label="Apr 12, 2026"
          items={[
            {
              key: "occupied",
              label: "Occupied units",
              value: "144",
              color: occupancySeriesConfig.occupied.color,
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>Multi series</span>
        <Chart.Tooltip.Content
          label="Apr 12, 2026"
          items={chartTooltipItemsFromConfig(occupancySeriesConfig, occupancyTooltipValues)}
        />
      </div>
    </div>
  ),
};

export const TooltipIndicatorsReference: Story = {
  name: "Reference — tooltip indicators",
  parameters: {
    docs: {
      description: {
        story: "Indicator variants — `dot` (default), `line`, `dashed` — shadcn `ChartTooltipContent` parity.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(["dot", "line", "dashed"] as const).map((indicator) => (
        <div key={indicator} className="flex flex-col gap-2">
          <span className={kpiMetaClasses}>{indicator}</span>
          <Chart.Tooltip.Content
            label="Apr 12, 2026"
            indicator={indicator}
            items={chartTooltipItemsFromConfig(occupancySeriesConfig, occupancyTooltipValues)}
          />
        </div>
      ))}
    </div>
  ),
};

export const LegendReference: Story = {
  name: "Reference — legend",
  parameters: {
    docs: {
      description: {
        story:
          "**Chart.Legend** — same `ChartSeriesConfig` as tooltip rows. Typical placement: **Card.Body** below the plot.",
      },
    },
  },
  render: () => <Chart.Legend config={occupancySeriesConfig} />,
};

export const TooltipLegendPairingReference: Story = {
  name: "Reference — tooltip + legend pairing",
  parameters: {
    docs: {
      description: {
        story:
          "Multi-series Cartesian specimen — frosted-glass **Chart.Tooltip.Content** over plot marks; legend below. Static wireframe until **Chart.Area** ships.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className={chartCartesianWireframeClasses}>
        <div className={`absolute inset-0 ${backgroundPatternDotGridClasses}`} aria-hidden />
        <div className="absolute inset-x-8 bottom-8 top-10 flex items-end justify-between gap-1" aria-hidden>
          {[28, 42, 55, 72, 68, 48, 36].map((height, index) => (
            <div
              key={height}
              className={cn(
                "w-2 rounded-full bg-border/80",
                index === 4 && "bg-primary/35 shadow-[0_0_18px_4px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div
          className={chartTooltipCrosshairClasses}
          style={{ left: "62%", bottom: "2rem", top: "1.5rem" }}
          aria-hidden
        />
        <div className="absolute left-[54%] top-6 z-10">
          <Chart.Tooltip.Content
            label="Apr 12, 2026"
            items={chartTooltipItemsFromConfig(occupancySeriesConfig, occupancyTooltipValues)}
          />
        </div>
      </div>
      <Chart.Legend config={occupancySeriesConfig} />
    </div>
  ),
};

export const AreaSingleSeries: Story = {
  name: "Pattern — area (single series)",
  parameters: {
    docs: {
      description: {
        story:
          "Single semantic series — `chartSeriesConfigFromTone` + primary stroke. Hover for crosshair tooltip; categorical palette not used.",
      },
    },
  },
  render: () => (
    <Chart.Cartesian
      className="max-w-lg"
      data={occupancyAreaData}
      config={occupiedToneConfig}
      seriesKeys={["occupied"]}
      periodKind="month"
      aria-label="Occupied units over time"
    />
  ),
};

export const AreaMultiSeries: Story = {
  name: "Pattern — area (multi series + legend)",
  parameters: {
    docs: {
      description: {
        story:
          "Multi-series — `chartSeriesConfigFromKeys` assigns **chartSeriesColor** indices. Tooltip rows and **Chart.Legend** share the same config.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Chart.Cartesian
        data={occupancyAreaData}
        config={occupancySeriesConfig}
        periodKind="month"
        aria-label="Occupied and available units over time"
      />
      <Chart.Legend config={occupancySeriesConfig} />
    </div>
  ),
};

export const OccupancyHistoryInCard: Story = {
  name: "Pattern — occupancy history in Card",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "History companion to the capacity KPI — **Card.Header** Select scopes period; inset well + **`bodyTerminal`** (no **Footer**). Categorical palette for occupied vs available.",
        },
      },
    },
    `
import { Card, Chart, Select, chartSeriesConfigFromKeys, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantWellClasses, cardTitleClasses } from "@whatmatters/wmds";

const config = chartSeriesConfigFromKeys([
  { key: "occupied", label: "Occupied units" },
  { key: "available", label: "Available units" },
]);

<Card shape="rounded" bodyTerminal className="max-w-lg">
  <Card.Header
    start={<h2 className={cardTitleClasses}>Occupancy history</h2>}
    end={<Select aria-label="Reporting period" size="sm" options={periodOptions} defaultValue="month" className="w-36" />}
  />
  <Card.Body>
    <div className={\`flex flex-col gap-3 py-4 \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantInsetXClasses}\`}>
      <Chart.Cartesian data={data} config={config} periodKind="month" minHeight={220} />
      <Chart.Legend config={config} />
    </div>
  </Card.Body>
</Card>
    `,
  ),
  render: () => {
    const [period, setPeriod] = useState("month");

    return (
      <Card shape="rounded" bodyTerminal className="max-w-lg">
        <Card.Header
          start={<h2 className={cardTitleClasses}>Occupancy history</h2>}
          end={
            <Select
              aria-label="Reporting period"
              size="sm"
              options={occupancyPeriodOptions}
              value={period}
              onValueChange={setPeriod}
              className="w-36"
            />
          }
        />
        <Card.Body>
          <div className={`flex flex-col gap-3 py-4 ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}>
            <Chart.Cartesian
              data={occupancyAreaData}
              config={occupancySeriesConfig}
              periodKind="month"
              minHeight={220}
              aria-label="Occupied and available units over the selected period"
            />
            <Chart.Legend config={occupancySeriesConfig} />
          </div>
        </Card.Body>
      </Card>
    );
  },
};

export const SegmentedBar: Story = {
  name: "Pattern — segmented bar",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Capacity meter — **60** ticks at **5px** each (**1px** min gap); gap flexes so the bar **fills the card width**. Filled segment count from `value / max`. `role=\"meter\"`.",
        },
      },
    },
    `
import { Chart } from "@whatmatters/wmds";

<Chart.Frame className="max-w-lg">
  <Chart.SegmentedBar value={144} max={200} tone="primary" label="Occupancy 72%" />
</Chart.Frame>
    `,
  ),
  render: () => (
    <Chart.Frame className="max-w-lg">
      <Chart.SegmentedBar value={144} max={200} tone="primary" label="Occupancy 72%" />
    </Chart.Frame>
  ),
};

export const SegmentedBarVelocity: Story = {
  name: "Pattern — segmented bar (velocity)",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Occupancy-style fill — `fill=\"velocity\"` applies a left → right tone gradient across filled ticks (token opacity 1 → 0.22).",
        },
      },
    },
    `
import { Chart } from "@whatmatters/wmds";

<Chart.Frame className="max-w-lg">
  <Chart.SegmentedBar value={144} max={200} tone="primary" fill="velocity" label="Occupancy 72%" />
</Chart.Frame>
    `,
  ),
  render: () => (
    <Chart.Frame className="max-w-lg">
      <Chart.SegmentedBar value={144} max={200} tone="primary" fill="velocity" label="Occupancy 72%" />
    </Chart.Frame>
  ),
};

export const SegmentedBarSemantic: Story = {
  name: "Pattern — segmented bar (RAG)",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "**RAG** (red / amber / green) — `fill=\"semantic\"` maps error → warning → success across bar capacity. Common for utilization and health meters.",
        },
      },
    },
    `
import { Chart } from "@whatmatters/wmds";

<Chart.Frame className="max-w-lg">
  <Chart.SegmentedBar value={144} max={200} fill="semantic" label="Occupancy 72%" />
</Chart.Frame>
    `,
  ),
  render: () => (
    <Chart.Frame className="max-w-lg">
      <Chart.SegmentedBar value={144} max={200} fill="semantic" label="Occupancy 72%" />
    </Chart.Frame>
  ),
};

export const SegmentedBarFillComparison: Story = {
  name: "Reference — segment fills",
  parameters: {
    docs: {
      description: {
        story: "Same `144/200` data — **velocity** (tone fade) vs **semantic** (RAG hue scale).",
      },
    },
  },
  render: () => (
    <div className="flex max-w-lg flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>fill=&quot;velocity&quot;</span>
        <Chart.Frame>
          <Chart.SegmentedBar value={144} max={200} tone="primary" fill="velocity" />
        </Chart.Frame>
      </div>
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>fill=&quot;semantic&quot; (RAG)</span>
        <Chart.Frame>
          <Chart.SegmentedBar value={144} max={200} fill="semantic" />
        </Chart.Frame>
      </div>
    </div>
  ),
};

export const OccupancyInCard: Story = {
  name: "Pattern — occupancy KPI in Card",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Dashboard widget — hero percent + inline mono trend, **Chart.SegmentedBar** in **Card.Body**, footer meta. **Card.Header** `end` → **Select** (`size=\"sm\"`) for reporting period.",
        },
      },
    },
    `
import { Button, Card, Chart, Select, chartFormatPercent, chartKpiHeroRowClasses, chartKpiHeroValueClasses, chartKpiTrendLabelClasses, chartKpiTrendRowClasses, chartKpiTrendValueClasses, cardLayoutBodyOccupantInsetXClasses, cardTitleClasses } from "@whatmatters/wmds";

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
    <div className={\`flex flex-col gap-2 py-4 \${cardLayoutBodyOccupantInsetXClasses}\`}>
      <div className={chartKpiHeroRowClasses}>
        <span className={chartKpiHeroValueClasses}>{chartFormatPercent(occupied, total)}</span>
        <div className={chartKpiTrendRowClasses}>
          <span className={\`\${chartKpiTrendValueClasses} text-success\`}>+4.2%</span>
          <span className={chartKpiTrendLabelClasses}>From last month</span>
        </div>
      </div>
      <Chart.Frame>
        <Chart.SegmentedBar value={occupied} max={total} tone="primary" fill="velocity" />
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
    `,
  ),
  render: () => {
    const occupied = 144;
    const total = 200;
    const [period, setPeriod] = useState("month");

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
          end={
            <Select
              aria-label="Reporting period"
              size="sm"
              options={occupancyPeriodOptions}
              value={period}
              onValueChange={setPeriod}
              className="w-36"
            />
          }
        />
        <Card.Body>
          <div className={`flex flex-col gap-2 py-4 ${cardLayoutBodyOccupantInsetXClasses}`}>
            <div className={chartKpiHeroRowClasses}>
              <span className={chartKpiHeroValueClasses}>{chartFormatPercent(occupied, total)}</span>
              <div className={chartKpiTrendRowClasses}>
                <span className={`${chartKpiTrendValueClasses} text-success`}>+4.2%</span>
                <span className={chartKpiTrendLabelClasses}>From last month</span>
              </div>
            </div>
            <Chart.Frame>
              <Chart.SegmentedBar value={occupied} max={total} tone="primary" fill="velocity" />
            </Chart.Frame>
          </div>
        </Card.Body>
        <Card.Footer>
          <span className={kpiMetaClasses}>Occupied units: {occupied}/{total}</span>
          <Button role="secondary" size="sm">
            View breakdown
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};
