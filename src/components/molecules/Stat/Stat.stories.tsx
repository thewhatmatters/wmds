import type { Meta, StoryObj } from "@storybook/react-vite";
import { Share2 } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { PageHeader } from "../PageHeader/PageHeader";
import { Stat, statSizes } from "./Stat";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Data display/Stat",
  component: Stat,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...statSizes] },
    label: { control: "text" },
    value: { control: "text" },
    trend: { control: false },
    start: { control: false },
    end: { control: false },
    loading: { control: "boolean" },
  },
  args: {
    label: "Followers",
    value: "12,480",
    size: "sm",
    loading: false,
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

**Scalar metric tiles** — label + headline value for dashboard at-a-glance stats. Not a chart; pair **Card** + **Chart** when history or capacity marks are needed.

| Pattern | Props |
|---------|--------|
| **Insights row** | **Stat.Group** + multiple **Stat** \`size="sm"\` |
| **With trend** | \`trend={{ value, direction, label? }}\` — muted **Badge** beside the value |
| **Hero KPI** | \`size="md"\` — larger type before a chart in **Card.Body** |
| **Loading** | \`loading\` — **Skeleton** label + value; \`aria-busy\` on the tile |
| **Slots** | \`start\` / \`end\` — inline with the label row |

Section chrome (**Insights** heading, **Share** action) — **PageHeader** \`variant="page"\`; not part of **Stat**.

## Anatomy

\`\`\`
Stat (article)
├── label row       — [start] label [end]
└── value + trend?  — tabular headline + muted Badge
\`\`\`

**Stat.Group** — \`grid-cols-2\` mobile, \`columns\` at lg+ (default 4).

## Best practices

- **Do** pre-format values in app code (\`12,480\`, \`4.2%\`, \`256K\`) — **Stat** does not locale-format.
- **Do** use **Stat.Group** \`aria-label\` when the row is a meaningful dashboard region.
- **Do** use \`trend.direction\` so badge variant matches semantic up/down/neutral.
- **Do** use inline mono trend (\`chartKpiTrend*\`) when a KPI sits directly above **Chart** marks — not **Badge**.
- **Don't** put charts inside **Stat** — compose **Card** + **Chart** for plots.
- **Don't** use **Stat** for table cells — future **Table** molecule.

## For agents building UIs

Copy **Pattern — insights row** for Instagram-style overview metrics. **PageHeader** + **Stat.Group** for the overview band.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsightsRow: Story = {
  name: "Pattern — insights row",
  render: () => (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        variant="page"
        title="Insights"
        end={
          <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
            Share
          </Button>
        }
      />
      <Stat.Group aria-label="Insights metrics" columns={4}>
        <Stat label="Followers" value="12,480" trend={{ value: "+2.1%", direction: "up", label: "vs last period" }} />
        <Stat label="ER" value="4.2%" trend={{ value: "+0.3%", direction: "up" }} />
        <Stat label="Reach" value="256K" trend={{ value: "-1.2%", direction: "down" }} />
        <Stat label="Saves" value="3,241" />
      </Stat.Group>
    </div>
  ),
  parameters: storyCopySource(`
import { Button, PageHeader, Stat } from "@whatmatters/wmds";
import { Share2 } from "lucide-react";

export function InsightsOverview() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        variant="page"
        title="Insights"
        end={
          <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
            Share
          </Button>
        }
      />
      <Stat.Group aria-label="Insights metrics" columns={4}>
        <Stat label="Followers" value="12,480" trend={{ value: "+2.1%", direction: "up" }} />
        <Stat label="ER" value="4.2%" />
        <Stat label="Reach" value="256K" />
        <Stat label="Saves" value="3,241" />
      </Stat.Group>
    </div>
  );
}
`),
};

export const WithTrend: Story = {
  name: "Pattern — with trend",
  args: {
    label: "Reach",
    value: "256K",
    trend: { value: "+12.4%", direction: "up", label: "vs prior 30 days" },
  },
};

export const HeroKpi: Story = {
  name: "Pattern — hero KPI",
  parameters: {
    docs: {
      description: {
        story:
          "`size=\"md\"` — larger headline before a chart occupant in **Card.Body**. Trend still uses muted **Badge** on standalone tiles.",
      },
    },
  },
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <Stat
        size="md"
        label="Engagement rate"
        value="4.2%"
        trend={{ value: "+0.3%", direction: "up", label: "vs last week" }}
      />
    </div>
  ),
};

export const WithSlots: Story = {
  name: "Pattern — start and end slots",
  render: () => (
    <Stat
      label="Saves"
      value="3,241"
      end={
        <IconButton
          role="ghost"
          size="xs"
          aria-label="Share metric"
          icon={<Share2 strokeWidth={2} />}
        />
      }
    />
  ),
};

export const Loading: Story = {
  name: "Pattern — loading",
  args: {
    label: "Followers",
    value: "12,480",
    loading: true,
  },
};

export const LoadingRow: Story = {
  name: "Pattern — loading row",
  render: () => (
    <Stat.Group aria-label="Loading insights metrics" columns={4}>
      <Stat label="Followers" value="" loading />
      <Stat label="ER" value="" loading />
      <Stat label="Reach" value="" loading />
      <Stat label="Saves" value="" loading />
    </Stat.Group>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "`sm` — 4-up insights grid. `md` — hero KPI above charts.",
      },
    },
  },
  render: () => (
    <div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <Stat size="sm" label="Followers" value="12,480" />
      <Stat size="md" label="Engagement rate" value="4.2%" trend={{ value: "+0.3%", direction: "up" }} />
    </div>
  ),
};
