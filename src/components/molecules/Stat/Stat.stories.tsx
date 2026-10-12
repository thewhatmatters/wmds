import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Receipt, Share2, Unplug, Wallet } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { PageHeader } from "../PageHeader/PageHeader";
import { Stat, statSizes } from "./Stat";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Stat",
  component: Stat,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...statSizes] },
    label: { control: "text" },
    value: { control: "text" },
    trend: { control: false },
    context: { control: "text" },
    icon: { control: false },
    action: { control: false },
    unavailable: { control: false },
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
| **With trend** | \`trend={{ value, direction, label? }}\` — muted **Badge** beside the value. \`direction\` \`flat\` matches \`neutral\` |
| **Hero KPI** | \`size="md"\` — larger type before a chart in **Card.Body** |
| **Hero stat** | \`size="lg"\` — \`type-display-3\` tabular figure, \`context\` ("vs $14,850"), \`icon\`, \`action\` |
| **Not connected** | \`unavailable={{ reason }}\` — muted "Not connected" replaces the figure; \`trend\` stays hidden |
| **Loading** | \`loading\` — **Skeleton** label + value (\`lg\` adds the context bar); \`aria-busy\` on the tile |
| **Slots** | \`icon\` leading tile, \`action\` (**Button** \`size="sm"\`) trailing, \`start\` / \`end\` beside the label |

Section chrome (**Insights** heading, **Share** action) — **PageHeader** \`variant="page"\`; not part of **Stat**.

## Anatomy

\`\`\`
Stat (article)
├── label row       — [icon tile] [start] label [end] [action]
├── value + trend?  — tabular headline + muted Badge
└── context?        — visible secondary line (or the unavailable reason)
\`\`\`

**Stat.Group** — \`grid-cols-2\` mobile, \`columns\` at lg+ (default 4).

## Best practices

- **Do** pre-format values in app code (\`12,480\`, \`4.2%\`, \`256K\`) — **Stat** does not locale-format.
- **Do** use **Stat.Group** \`aria-label\` when the row is a meaningful dashboard region.
- **Do** use \`trend.direction\` so badge variant matches semantic up/down. \`neutral\` and \`flat\` stay muted.
- **Do** put comparison copy on \`context\` ("vs $14,850"). \`trend.label\` is only the badge tooltip.
- **Do** pass a Lucide glyph to \`icon\` and **Button** \`size="sm"\` to \`action\`.
- **Do** use \`unavailable\` when the source is unwired — do not fake a zero.
- **Do** use inline mono trend (\`chartKpiTrend*\`) when a KPI sits directly above **Chart** marks — not **Badge**.
- **Don't** put charts inside **Stat** — compose **Card** + **Chart** for plots.
- **Don't** use **Stat** for table cells — future **Table** molecule.

## For agents building UIs

Copy **Pattern — insights row** for overview metrics. Copy **Pattern — hero stat** for a \`size="lg"\` figure with a visible "vs" line. **PageHeader** + **Stat.Group** for the overview band.
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
import { Button, PageHeader, Stat } from "@thewhatmatters/wmds";
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

const heroStatCopySource = `
import { Button, Stat } from "@thewhatmatters/wmds";
import { BarChart3, Receipt, Unplug, Wallet } from "lucide-react";

export function HeroStats() {
  return (
    <Stat.Group aria-label="Performance" columns={2}>
      <Stat
        size="lg"
        icon={<Receipt strokeWidth={2} />}
        label="Attributed revenue"
        value="$18,420"
        trend={{ value: "+24.1%", direction: "up" }}
        context="vs $14,850"
        action={
          <Button role="secondary" size="sm">
            View details
          </Button>
        }
      />
      <Stat
        size="lg"
        icon={<BarChart3 strokeWidth={2} />}
        label="Return on spend"
        value="2.7×"
        trend={{ value: "−0.4", direction: "down" }}
        context="vs 3.1×"
      />
      <Stat
        size="lg"
        icon={<Wallet strokeWidth={2} />}
        label="Available to spend"
        value="$14.00"
        trend={{ value: "0.0%", direction: "flat" }}
        context="of $1M goal"
      />
      <Stat
        size="lg"
        icon={<Unplug strokeWidth={2} />}
        label="Content awaiting approval"
        value=""
        unavailable={{ reason: "Google Analytics is not linked" }}
        action={
          <Button role="secondary" size="sm">
            Connect
          </Button>
        }
      />
    </Stat.Group>
  );
}
`;

export const HeroStat: Story = {
  name: "Pattern — hero stat",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            '`size="lg"` — display figure, tabular numbers, and a visible `context` line. `unavailable` replaces the figure with "Not connected" and a reason. `direction="flat"` keeps the trend badge muted.',
        },
      },
    },
    heroStatCopySource,
  ),
  render: () => (
    <div className="mx-auto w-full max-w-3xl">
      <Stat.Group aria-label="Performance" columns={2}>
        <Stat
          size="lg"
          icon={<Receipt strokeWidth={2} />}
          label="Attributed revenue"
          value="$18,420"
          trend={{ value: "+24.1%", direction: "up" }}
          context="vs $14,850"
          action={
            <Button role="secondary" size="sm">
              View details
            </Button>
          }
        />
        <Stat
          size="lg"
          icon={<BarChart3 strokeWidth={2} />}
          label="Return on spend"
          value="2.7×"
          trend={{ value: "−0.4", direction: "down" }}
          context="vs 3.1×"
        />
        <Stat
          size="lg"
          icon={<Wallet strokeWidth={2} />}
          label="Available to spend"
          value="$14.00"
          trend={{ value: "0.0%", direction: "flat" }}
          context="of $1M goal"
        />
        <Stat
          size="lg"
          icon={<Unplug strokeWidth={2} />}
          label="Content awaiting approval"
          value=""
          unavailable={{ reason: "Google Analytics is not linked" }}
          action={
            <Button role="secondary" size="sm">
              Connect
            </Button>
          }
        />
      </Stat.Group>
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
        story: "`sm` — 4-up insights grid. `md` — KPI above charts. `lg` — hero figure with a visible vs line.",
      },
    },
  },
  render: () => (
    <div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <Stat size="sm" label="Followers" value="12,480" />
      <Stat size="md" label="Engagement rate" value="4.2%" trend={{ value: "+0.3%", direction: "up" }} />
      <Stat size="lg" label="Attributed revenue" value="$18,420" context="vs $14,850" trend={{ value: "+24.1%", direction: "up" }} />
    </div>
  ),
};
