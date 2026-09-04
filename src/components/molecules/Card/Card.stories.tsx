import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clock, EllipsisVertical, Globe } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Input } from "../../atoms/Input/Input";
import { Chip, ChipFilterGroup } from "../Chip/Chip";
import { iconButtonSizeForCluster } from "../../../lib/clusterScale";
import { TaskRows } from "../TaskRows/TaskRows";
import {
  Chart,
  chartFormatPercent,
  chartKpiHeroRowClasses,
  chartKpiHeroValueClasses,
  chartKpiTrendLabelClasses,
  chartKpiTrendRowClasses,
  chartKpiTrendValueClasses,
} from "../../organisms/Chart/Chart";
import {
  Card,
  cardBodyTextClasses,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantDotGridWellClasses,
  cardLayoutBodyOccupantWellClasses,
  cardPaddings,
  cardShapes,
  cardSubtitleClasses,
  cardTitleClasses,
  cardVariants,
} from "./Card";

function mutedText(className: string) {
  return `${className} text-muted`;
}

const meta = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "select", options: [...cardShapes] },
    variant: { control: "select", options: [...cardVariants] },
    padding: { control: "select", options: [...cardPaddings] },
    as: { control: "select", options: ["div", "article", "section"] },
  },
  args: {
    shape: "rounded",
    variant: "surface",
    padding: "none",
    as: "div",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

[Astryx Card](https://astryx.atmeta.com/components/Card) — **Header** and **Footer** sit on the shell; **Body** is a square **slot** 2px from the card edges. The slot has no default fill, radius, or inner pad — **the occupant dictates how the body region looks**. Background on the content (e.g. \`bg-body\`, TaskRows chrome) is what the card shows there; without it, the shell surface shows through.

| Pattern | Composition |
|---------|-------------|
| **Layout** | \`Card padding="none"\` + \`Card.Header\` / \`Card.Body\` / \`Card.Footer\` — default; shell + transparent Body slot |
| **Header** | Horizontal \`start\` / \`end\` slots — title + subtitle, kebab, chips-as-tabs, Badge, or any cluster |
| **Body slot** | TaskRows, form, **Chart**, or custom UI — occupant owns fill, radius, and padding |
| **Simple** | \`Card padding="md"\` — flat padded block (no sections) |

Default \`shape="rounded"\` — \`rounded-2xl shadow-md\` on the shell. Use \`shape="flush"\` only when a parent owns outer radius and shadow.

## Anatomy

\`\`\`
Card (bg-surface shell, py-4, gap-3)
├── Card.Header   — start | end slots — 16px horizontal inset (px-4)
├── Card.Body     — slot — 2px horizontal gutter (px-[2px]); transparent; occupant paints the region
└── Card.Footer   — status, actions — 16px horizontal inset (px-4)
\`\`\`

## Best practices

- **Do** set \`padding="none"\` when using Header/Body/Footer.
- **Do** put leading copy in \`start\` and trailing actions in \`end\` — do not hand-roll the header row.
- **Do** use \`cardLayoutBodyOccupantInsetXClasses\` (\`px-3.5\` / 14px) on body occupants when horizontal edges should align with **Header** and **Footer** (2px gutter + 14px = 16px).
- **Do** keep title, address, and meta in **Header**; primary actions in **Footer**.
- **Do** use default \`shape="rounded"\` — detail overlays, dashboard widgets, map overlays.
- **Do** use \`shape="flush"\` only when nested inside a parent that already owns radius and shadow.
- **Don't** restrict the Body to TaskRows — that is one occupant, not the contract.
- **Don't** put fill or surface styling on \`Card.Body\` itself — only the 2px gutter belongs on the slot.
- **Don't** re-theme the slot with \`className\` — put layout tweaks on the root only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  name: "Pattern — simple",
  args: {
    padding: "md",
    shape: "rounded",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <h2 className={cardTitleClasses}>Simple card</h2>
      <p className={mutedText(cardBodyTextClasses)}>
        Padded content without header/footer regions — quick summaries or empty states.
      </p>
    </Card>
  ),
};

export const Layout: Story = {
  name: "Pattern — layout",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Default layout card — header/footer on the shell. **Body** is 2px from the card edges with no slot fill; this occupant has no background so the shell surface shows through.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Meeting Finder</h2>}
        end={<Badge size="sm">11:00 UTC</Badge>}
      />
      <Card.Body>
        <div className="flex min-h-32 items-center justify-center px-4 py-6">
          <p className={mutedText(cardBodyTextClasses)}>
            Body slot — TaskRows, form, or custom canvas
          </p>
        </div>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>1 of 4 in working hours</span>
        <Button role="primary" size="sm" icon={<Clock strokeWidth={2} />}>
          Find best time
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const BodyGutter: Story = {
  name: "Pattern — body gutter",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "**Card.Body** spans the full card width with **2px horizontal gutter** on the shell. The occupant's \`bg-body\` fill is what paints the body region — header and footer stay at **16px** inset on the shell.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Body gutter</h2>
            <p className={cardSubtitleClasses}>Header and footer — 16px from the shell edge</p>
          </>
        }
      />
      <Card.Body>
        <div className="flex min-h-28 items-center justify-center border border-dashed border-primary bg-body">
          <p className={mutedText(cardBodyTextClasses)}>
            Body slot — full width inside 2px shell gutter
          </p>
        </div>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>Compare dashed edge to header copy above</span>
        <Button role="secondary" size="sm">
          Action
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const HeaderSlots: Story = {
  name: "Pattern — header slots",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "**Header** is two horizontal slots. `start` and `end` take any cluster — title + subtitle, chips-as-tabs, kebab `IconButton`, Badge. Filter chips at **`sm`** pair with **`IconButton` `xs`** (cluster sm, 28px) — see **Foundation → Cluster**.",
      },
    },
  },
  render: function HeaderSlotsDemo() {
    const [view, setView] = useState("overview");

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={
            <>
              <h2 className={cardTitleClasses}>Texas Farmers&apos; Market at Mueller</h2>
              <p className={cardSubtitleClasses}>2006 Philomena St. · Austin, TX</p>
            </>
          }
          end={
            <>
              <ChipFilterGroup
                aria-label="Market detail view"
                selectionMode="single"
                value={view}
                onValueChange={setView}
              >
                <Chip value="overview" size="sm">
                  Overview
                </Chip>
                <Chip value="hours" size="sm">
                  Hours
                </Chip>
              </ChipFilterGroup>
              <IconButton
                icon={<EllipsisVertical strokeWidth={2} />}
                aria-label="More market actions"
                title="More"
                role="ghost"
                size={iconButtonSizeForCluster("sm")}
              />
            </>
          }
        />
        <Card.Body>
          <div className="flex min-h-32 items-center justify-center px-4 py-6">
            <p className={mutedText(cardBodyTextClasses)}>
              {view === "overview"
                ? "Overview — directions, services, and hours"
                : "Hours — Saturday 9am – 1pm"}
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  },
};

export const BodySlotForm: Story = {
  name: "Pattern — body slot (form)",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story: `
Form controls in the Body slot — no occupant background here, so the shell surface shows through; the footer keeps the action.

**Recommendation:** Header and footer sit at **16px** (\`px-4\`) from the shell edge. \`Card.Body\` adds a **2px** gutter — use **\`cardLayoutBodyOccupantInsetXClasses\`** (\`px-3.5\`, 14px) on the occupant so labels and fields align with the title and footer copy (2px + 14px = 16px).
        `.trim(),
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Working hours</h2>
            <p className={cardSubtitleClasses}>Used to score overlapping time zones</p>
          </>
        }
      />
      <Card.Body>
        <div
          className={`flex flex-col gap-3 py-4 ${cardLayoutBodyOccupantInsetXClasses}`}
        >
          <Input
            label="Home time zone"
            defaultValue="America/Chicago"
            icon={<Globe strokeWidth={2} />}
          />
          <Input label="Typical start" defaultValue="09:00" description="Local time, 24-hour" />
        </div>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>Saved to this workspace</span>
        <Button role="primary" size="sm">
          Update
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const BodySlotStatusRows: Story = {
  name: "Example — body slot (status rows)",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "**TaskRows variant=\"list\"** in the Body slot with \`inset\` — rows own their chrome; that content dictates the body appearance.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Restock run</h2>}
        end={
          <span className={cardBodyTextClasses + " text-muted tabular-nums"}>Step 2 of 4</span>
        }
      />
      <Card.Body>
        <TaskRows variant="list" inset>
          <TaskRows.Item
            label="Verified vendor records"
            meta="12 suppliers"
            status="done"
            defaultOpen
          >
            <TaskRows.Detail label="Matched tax and contact IDs" meta="12/12" />
            <TaskRows.Detail label="Flagged stale records" meta="0" />
          </TaskRows.Item>
          <TaskRows.Item
            label="Build reorder task list"
            meta="7 SKUs"
            status="running"
            step={2}
            defaultOpen
          >
            <TaskRows.Detail label="Reading POS export" meta="3 files" />
            <TaskRows.Detail label="Scoring stockout risk" meta="68%" />
          </TaskRows.Item>
          <TaskRows.Item label="Draft supplier emails" meta="2 messages" status="pending" step={3}>
            <TaskRows.Detail label="Cone supplier follow-up" meta="draft" />
            <TaskRows.Detail label="Pistachio reorder note" meta="draft" />
          </TaskRows.Item>
          <TaskRows.Item label="Sync market hours" meta="1 source" status="failed">
            <TaskRows.Detail label="USDA API timeout" meta="retry" />
          </TaskRows.Item>
        </TaskRows>
      </Card.Body>
      <Card.Footer>
        <span className={mutedText(cardBodyTextClasses)}>2 complete · 1 running</span>
        <Button role="primary" size="sm">
          Continue
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const BodySlotOccupancyKpi: Story = {
  name: "Example — body slot (occupancy KPI)",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "**Chart.SegmentedBar** in the Body slot — scalar gauge with KPI + inline mono trend. **Planned:** **Card.Header** `end` → **Select** for period (e.g. This month), not static copy.",
      },
    },
  },
  render: () => {
    const occupied = 144;
    const total = 200;

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
          end={<span className={mutedText(cardBodyTextClasses)}>This month</span>}
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
          <span className={mutedText(cardBodyTextClasses)}>Occupied units: {occupied}/{total}</span>
          <Button role="secondary" size="sm">
            View breakdown
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};

export const BodySlotOccupancyKpiInsetWell: Story = {
  name: "Example — body slot (occupancy KPI, inset well)",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Same occupancy KPI — Body occupant uses **`cardLayoutBodyOccupantWellClasses`** (`bg-body` page-floor gray + `rounded-lg` / 8px) inside the 2px Body gutter. Shell stays **`bg-surface`**. **Planned:** **Select** in **Card.Header** `end`.",
      },
    },
  },
  render: () => {
    const occupied = 144;
    const total = 200;

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
          end={<span className={mutedText(cardBodyTextClasses)}>This month</span>}
        />
        <Card.Body>
          <div
            className={`flex flex-col gap-2 py-4 ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}
          >
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
          <span className={mutedText(cardBodyTextClasses)}>Occupied units: {occupied}/{total}</span>
          <Button role="secondary" size="sm">
            View breakdown
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};

export const BodySlotOccupancyKpiDotGridWell: Story = {
  name: "Example — body slot (occupancy KPI, dot grid well)",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Occupancy KPI on **`cardLayoutBodyOccupantDotGridWellClasses`** — inset well with **Foundation → Patterns → Dot grid** texture (`backgroundPatternDotGridClasses`). Same stack spacing as the solid inset well.",
      },
    },
  },
  render: () => {
    const occupied = 144;
    const total = 200;

    return (
      <Card shape="rounded" className="max-w-lg">
        <Card.Header
          start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
          end={<span className={mutedText(cardBodyTextClasses)}>This month</span>}
        />
        <Card.Body>
          <div
            className={`flex flex-col gap-2 py-4 ${cardLayoutBodyOccupantDotGridWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}
          >
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
          <span className={mutedText(cardBodyTextClasses)}>Occupied units: {occupied}/{total}</span>
          <Button role="secondary" size="sm">
            View breakdown
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};

export const RoundedStandalone: Story = {
  name: "Pattern — simple (rounded)",
  args: {
    shape: "rounded",
    variant: "surface",
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <h2 className={cardTitleClasses}>Simple card</h2>
      <p className={mutedText(cardBodyTextClasses)}>
        Flat padded surface — use when you do not need header/body/footer regions.
      </p>
    </Card>
  ),
};
