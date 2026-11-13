import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { BarChart3, Receipt, Share2, Unplug, Wallet } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { PageHeader } from "../PageHeader/PageHeader";
import { Stat, statSizes, statVariants } from "./Stat";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Stat",
  component: Stat,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...statSizes] },
    variant: { control: "select", options: [...statVariants] },
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
    variant: "tile",
    loading: false,
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

**Scalar metrics** — label + headline value for at-a-glance figures, on a dashboard or a marketing page. Not a chart; pair **Card** + **Chart** when history or capacity marks are needed.

| Pattern | Props |
|---------|--------|
| **Insights row** | **Stat.Group** + multiple **Stat** \`size="sm"\` |
| **With trend** | \`trend={{ value, direction, label? }}\` — muted **Badge** beside the value. \`direction\` \`flat\` matches \`neutral\` |
| **Hero KPI** | \`size="md"\` — larger type before a chart in **Card.Body** |
| **Hero stat** | \`size="lg"\` — \`type-display-3\` tabular figure, \`context\` ("vs $14,850"), \`icon\`, \`action\` |
| **Not connected** | \`unavailable={{ reason }}\` — muted "Not connected" replaces the figure; \`trend\` stays hidden |
| **Loading** | \`loading\` — **Skeleton** label + value (\`lg\` adds the context bar); \`aria-busy\` on the tile |
| **On a framed surface** | \`variant="plain"\` — the figure alone, no border, fill or padding, when a **Card**, a band or a picture already frames it |
| **Editorial row** | \`variant="ruled"\` — a hairline above each figure. Copy **Pattern — ruled figures** |
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

\`variant\` picks the frame: \`tile\` (default, bordered tile), \`plain\` (none) or \`ruled\` (hairline above). \`id\`, \`data-*\` and \`aria-*\` pass through to the root of **Stat** and **Stat.Group**, so a page can anchor or animate a figure without a wrapper.

## Best practices

- **Do** pre-format values in app code (\`12,480\`, \`4.2%\`, \`256K\`) — **Stat** does not locale-format.
- **Do** use **Stat.Group** \`aria-label\` when the row is a meaningful dashboard region.
- **Do** use \`trend.direction\` so badge variant matches semantic up/down. \`neutral\` and \`flat\` stay muted.
- **Do** put comparison copy on \`context\` ("vs $14,850"). \`trend.label\` is only the badge tooltip.
- **Do** pass a Lucide glyph to \`icon\` and **Button** \`size="sm"\` to \`action\`.
- **Do** use \`unavailable\` when the source is unwired — do not fake a zero.
- **Do** use inline mono trend (\`chartKpiTrend*\`) when a KPI sits directly above **Chart** marks — not **Badge**.
- **Do** use \`variant="plain"\` inside a **Card** or on a toned band instead of stripping the tile with \`className\`.
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

export const Variants: Story = {
  name: "Reference — variants",
  parameters: {
    docs: {
      description: {
        story:
          "`tile` (default) frames the figure itself. `plain` leaves the frame to the surface it sits on. `ruled` sets a hairline above, for editorial rows.",
      },
    },
  },
  render: () => (
    <div className="mx-auto grid w-full max-w-3xl gap-6 md:grid-cols-3">
      {statVariants.map((variant) => (
        <Stat key={variant} variant={variant} size="md" label={variant} value="12,480" detail="vs 11,900 last week" />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [tile, plain, ruled] = [...canvasElement.querySelectorAll<HTMLElement>("article")];
    await expect(getComputedStyle(tile).borderTopWidth).toBe("1px");
    await expect(getComputedStyle(tile).paddingLeft).not.toBe("0px");
    await expect(getComputedStyle(plain).borderTopWidth).toBe("0px");
    await expect(getComputedStyle(plain).paddingTop).toBe("0px");
    await expect(getComputedStyle(plain).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    await expect(getComputedStyle(ruled).borderTopWidth).toBe("1px");
    await expect(getComputedStyle(ruled).borderLeftWidth).toBe("0px");
    await expect(getComputedStyle(ruled).paddingTop).not.toBe("0px");
    await expect(getComputedStyle(ruled).paddingLeft).toBe("0px");
  },
};

export const RuledFigures: Story = {
  name: "Pattern — ruled figures",
  render: () => (
    <div className="mx-auto w-full max-w-5xl">
      <Stat.Group aria-label="The studio in numbers" columns={4} data-figures="studio">
        <Stat variant="ruled" size="lg" label="Projects shipped" value="148" context="since 2016" />
        <Stat variant="ruled" size="lg" label="Clients who return" value="72%" context="of all clients" />
        <Stat variant="ruled" size="lg" label="Weeks to launch" value="6" context="median" />
        <Stat variant="ruled" size="lg" label="People" value="14" context="in two cities" />
      </Stat.Group>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const group = canvas.getByRole("group", { name: "The studio in numbers" });
    await expect(group).toHaveAttribute("data-figures", "studio");
    await expect(canvasElement.querySelectorAll("article[data-variant='ruled']")).toHaveLength(4);
  },
  parameters: storyCopySource(`
import { Stat } from "@thewhatmatters/wmds";

export function StudioInNumbers() {
  return (
    <Stat.Group aria-label="The studio in numbers" columns={4}>
      <Stat variant="ruled" size="lg" label="Projects shipped" value="148" context="since 2016" />
      <Stat variant="ruled" size="lg" label="Clients who return" value="72%" context="of all clients" />
      <Stat variant="ruled" size="lg" label="Weeks to launch" value="6" context="median" />
      <Stat variant="ruled" size="lg" label="People" value="14" context="in two cities" />
    </Stat.Group>
  );
}
`),
};
