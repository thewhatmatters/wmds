import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyCopySource,
  storyMetaDocsDefaults,
} from "../../lib/storyCopySource";
import { ChartExplorationsExample } from "./ChartExplorationsExample";

const meta = {
  title: "Examples/Chart explorations",
  component: ChartExplorationsExample,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

A comparison gallery for selecting a truthful visualization contract before adding it to a product page. Every specimen spans six columns on the 1140px WMDS subgrid; the Storybook-only layout panel can inspect responsive behavior and theme contrast.

## Anatomy

- **UnitGrid** — exact shared-denominator composition with a visible categorical legend.
- **DistributionStrip** — independent scalar marks, one numeric axis, and an optional supplied reference.
- **Heatmap** — categorical row × column matrix with a compact intensity legend.

## Best practices

- **Do** choose the pattern from the available data shape.
- **Do** give adjacent charts the same \`minHeight\` so their measured plot areas align.
- **Do** label illustrative fixtures explicitly.
- **Don't** infer a heatmap matrix from totals or a time series.
- **Don't** place these explorations in PitchKit until one pattern is selected.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ChartExplorationsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComparisonGallery: Story = {
  name: "Pattern — chart comparison gallery",
  render: () => <ChartExplorationsExample />,
  parameters: storyCopySource(`
import {
  Card,
  Chart,
  PageHeader,
  chartSeriesConfigFromKeys,
} from "@whatmatters/wmds";

const compositionConfig = chartSeriesConfigFromKeys([
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "unspecified", label: "Not specified" },
]);

export function ChartComparison({ composition, postReach, activity }) {
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
  `),
};
