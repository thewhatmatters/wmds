import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { Card, cardLayoutBodyOccupantInsetXClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { typographyClass } from "../../../lib/typography";
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

const kpiMetaClasses = `${typographyClass("caption")} text-muted`;
const periodLabelClasses = `${typographyClass("caption")} text-muted`;

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
| **Cartesian** | \`Chart.Area\` (planned) — daily / multi-series history | Yes |

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
            "Dashboard widget — hero percent + inline mono trend, **Chart.SegmentedBar** in **Card.Body**, footer meta. **Planned:** replace static period copy in **Card.Header** `end` with **Select** (time range) when **Molecules/Select** ships.",
        },
      },
    },
    `
import { Button, Card, Chart, chartFormatPercent, chartKpiHeroRowClasses, chartKpiHeroValueClasses, chartKpiTrendLabelClasses, chartKpiTrendRowClasses, chartKpiTrendValueClasses, cardLayoutBodyOccupantInsetXClasses, cardTitleClasses } from "@whatmatters/wmds";

const occupied = 144;
const total = 200;

<Card shape="rounded" className="max-w-lg">
  <Card.Header
    start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
    end={<span className="type-supporting text-muted">This month</span>}
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

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
          end={<span className={periodLabelClasses}>This month</span>}
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
