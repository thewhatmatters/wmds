import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Filter, Share2 } from "lucide-react";
import { Avatar, avatarSizeForCluster } from "../../atoms/Avatar/Avatar";
import { Button } from "../../atoms/Button/Button";
import { Chip } from "../Chip/Chip";
import { SegmentedControl } from "../SegmentedControl/SegmentedControl";
import { buttonSizeForCluster } from "../../../lib/clusterScale";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { PageHeader, pageHeaderVariants } from "./PageHeader";

const headerClusterTier = "sm" as const;

const meta = {
  title: "Components/Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    variant: { control: "select", options: [...pageHeaderVariants] },
    title: { control: "text" },
    start: { control: false },
    end: { control: false },
  },
  args: {
    title: "Insights",
    variant: "page",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Horizontal page chrome — \`start\` | title | \`end\` slots for titles and cluster-aligned actions. Not **Card.Header** (in-card) and not raw flex utilities for every app page.

| Pattern | \`variant\` | Role |
|---------|------------|------|
| **App header** | \`app\` | Canvas top band — 56px, page margin inset, bottom hairline; one \`h1\` per view |
| **Page header** | \`page\` | In-page section title + actions above content |
| **Toolbar header** | \`toolbar\` | Compact control row — filters, view switchers; \`role="toolbar"\`; \`aria-label\` when no title |

Pair \`end\` controls at one **cluster** tier — **SegmentedControl** \`size\` matches tier name; **Button** / **Avatar** via \`buttonSizeForCluster\` / \`avatarSizeForCluster\`.

## Anatomy

\`\`\`
PageHeader (header | [role=toolbar])
├── start?   — leading slot
├── title?   — h1 (app) | h2 (page) | span (toolbar)
└── end?     — trailing cluster (actions, avatar, menus)
\`\`\`

## Best practices

- **Do** use \`variant="app"\` once per app canvas — **AppHeader** in shell examples maps to this pattern.
- **Do** pass \`aria-label\` on toolbar-only rows when \`title\` is omitted.
- **Do** keep one cluster tier per row — see **Foundations → Cluster**.
- **Don't** nest **PageHeader** inside **Card** for card titles — use **Card.Header**.
- **Don't** re-theme with \`className\` — layout width/margin only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function InsightsHeaderActions({
  period,
  onPeriodChange,
}: {
  period: string;
  onPeriodChange: (value: string) => void;
}) {
  return (
    <>
      <SegmentedControl
        aria-label="Reporting period"
        size={headerClusterTier}
        value={period}
        onValueChange={onPeriodChange}
      >
        <SegmentedControl.Item value="7d">7d</SegmentedControl.Item>
        <SegmentedControl.Item value="30d">30d</SegmentedControl.Item>
        <SegmentedControl.Item value="90d">90d</SegmentedControl.Item>
      </SegmentedControl>
      <Button
        role="secondary"
        size={buttonSizeForCluster(headerClusterTier)}
        icon={<Share2 strokeWidth={2} />}
      >
        Share
      </Button>
      <Avatar
        name="Alex Rivera"
        size={avatarSizeForCluster(headerClusterTier)}
        presence={{ tone: "success", label: "Online" }}
      />
    </>
  );
}

export const AppHeaderPattern: Story = {
  name: "Pattern — app header",
  render: function AppHeaderPatternDemo() {
    const [period, setPeriod] = useState("30d");

    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <PageHeader
          variant="app"
          title="Insights"
          end={<InsightsHeaderActions period={period} onPeriodChange={setPeriod} />}
        />
        <div className="px-[var(--grid-margin)] py-4">
          <p className="text-sm text-muted">Canvas body — compose below the app band.</p>
        </div>
      </div>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Share2 } from "lucide-react";
import {
  Avatar,
  avatarSizeForCluster,
  Button,
  buttonSizeForCluster,
  PageHeader,
  SegmentedControl,
} from "@whatmatters/wmds";

const tier = "sm";

export function InsightsAppHeader() {
  const [period, setPeriod] = useState("30d");

  return (
    <PageHeader
      variant="app"
      title="Insights"
      end={
        <>
          <SegmentedControl aria-label="Reporting period" size={tier} value={period} onValueChange={setPeriod}>
            <SegmentedControl.Item value="7d">7d</SegmentedControl.Item>
            <SegmentedControl.Item value="30d">30d</SegmentedControl.Item>
            <SegmentedControl.Item value="90d">90d</SegmentedControl.Item>
          </SegmentedControl>
          <Button role="secondary" size={buttonSizeForCluster(tier)} icon={<Share2 strokeWidth={2} />}>
            Share
          </Button>
          <Avatar name="Alex Rivera" size={avatarSizeForCluster(tier)} />
        </>
      }
    />
  );
}
`),
};

export const PageSectionHeader: Story = {
  name: "Pattern — page header",
  render: () => (
    <PageHeader
      variant="page"
      title="Insights"
      end={
        <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
          Share
        </Button>
      }
    />
  ),
  parameters: storyCopySource(`
import { Share2 } from "lucide-react";
import { Button, PageHeader } from "@whatmatters/wmds";

export function InsightsSectionHeader() {
  return (
    <PageHeader
      variant="page"
      title="Insights"
      end={
        <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
          Share
        </Button>
      }
    />
  );
}
`),
};

export const ToolbarHeader: Story = {
  name: "Pattern — toolbar header",
  render: function ToolbarHeaderDemo() {
    const [filter, setFilter] = useState<string[]>(["active"]);

    return (
      <PageHeader
        variant="toolbar"
        aria-label="Insights filters"
        start={
          <>
            <Chip
              size="sm"
              selected={filter.includes("active")}
              onSelectedChange={() =>
                setFilter((current) =>
                  current.includes("active")
                    ? current.filter((id) => id !== "active")
                    : [...current, "active"],
                )
              }
            >
              Active
            </Chip>
            <Chip
              size="sm"
              selected={filter.includes("draft")}
              onSelectedChange={() =>
                setFilter((current) =>
                  current.includes("draft")
                    ? current.filter((id) => id !== "draft")
                    : [...current, "draft"],
                )
              }
            >
              Draft
            </Chip>
          </>
        }
        end={
          <Button role="ghost" size="sm" icon={<Filter strokeWidth={2} aria-hidden />}>
            Filters
          </Button>
        }
      />
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button, Chip, PageHeader } from "@whatmatters/wmds";

export function InsightsToolbar() {
  const [filter, setFilter] = useState<string[]>(["active"]);

  return (
    <PageHeader
      variant="toolbar"
      aria-label="Insights filters"
      start={
        <Chip size="sm" selected={filter.includes("active")} onSelectedChange={() => /* toggle */}>
          Active
        </Chip>
      }
      end={
        <Button role="ghost" size="sm" icon={<Filter strokeWidth={2} aria-hidden />}>
          Filters
        </Button>
      }
    />
  );
}
`),
};
