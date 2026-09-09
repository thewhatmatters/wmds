import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Download, Share2, Trash2 } from "lucide-react";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Card, cardBodyTextClasses, cardSubtitleClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { SegmentedControl } from "../../molecules/SegmentedControl/SegmentedControl";
import { iconButtonSizeForCluster } from "../../../lib/clusterScale";
import { MoreMenu } from "./MoreMenu";

const meta = {
  title: "Organisms/MoreMenu",
  component: MoreMenu,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    items: { control: false },
    onAction: { control: false },
  },
  args: {
    "aria-label": "More actions",
    size: "sm",
    disabled: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

Kebab **IconButton** + floating **Dropdown** action menu — Card header \`end\` slot, toolbars, row overflow.

| Pattern | Props |
|---------|--------|
| **Action menu** | \`items\` + \`onAction\` — stable \`id\` per row |
| **With icons** | \`items[].start\` — **ButtonIcon** + Lucide from stories |
| **Card header cluster** | \`size="xs"\` beside **SegmentedControl** \`sm\`; \`size="sm"\` beside **Select** \`md\` |

Menu **right-aligns** to the trigger (\`align="end"\`) and clamps to the nearest **Card** shell (\`data-layout="shell"\`).

## Anatomy

- **Trigger** — **IconButton** \`role="ghost"\` + vertical kebab (built-in); retains its ghost hover surface while the menu is expanded
- **Menu** — **Dropdown.Menu** \`role="menu"\` — fixed position, **4px** below trigger
- **Row** — **Dropdown.Item** \`role="menuitem"\` — \`start\` | label | \`end\`; hover/keyboard \`active\` fill only (no selection check)

## Best practices

- **Do** use for secondary actions (export, share, remove) — not primary CTAs (**Button**).
- **Do** keep \`aria-label\` specific — "More market actions", not "Menu".
- **Do** pass icons in \`start\` via **ButtonIcon** — not raw Lucide in app TSX against the organism.
- **Don't** use for single-select lists — **Select** or **SegmentedControl**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof MoreMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoItems = [
  {
    id: "export",
    label: "Export",
    start: (
      <ButtonIcon size="sm">
        <Download strokeWidth={2} />
      </ButtonIcon>
    ),
  },
  {
    id: "share",
    label: "Share",
    start: (
      <ButtonIcon size="sm">
        <Share2 strokeWidth={2} />
      </ButtonIcon>
    ),
  },
  {
    id: "remove",
    label: "Remove",
    start: (
      <ButtonIcon size="sm">
        <Trash2 strokeWidth={2} />
      </ButtonIcon>
    ),
  },
] as const;

export const ActionMenu: Story = {
  name: "Pattern — action menu",
  parameters: {
    ...storyCopySource(`
import { Download, Share2 } from "lucide-react";
import { ButtonIcon, MoreMenu } from "@whatmatters/wmds";

function MarketActions() {
  return (
    <MoreMenu
      aria-label="More market actions"
      size="sm"
      items={[
        {
          id: "export",
          label: "Export",
          start: (
            <ButtonIcon size="sm">
              <Download strokeWidth={2} />
            </ButtonIcon>
          ),
        },
        {
          id: "share",
          label: "Share",
          start: (
            <ButtonIcon size="sm">
              <Share2 strokeWidth={2} />
            </ButtonIcon>
          ),
        },
      ]}
      onAction={(id) => console.log(id)}
    />
  );
}
`),
  },
  render: () => (
    <MoreMenu
      aria-label="More market actions"
      items={[...demoItems.slice(0, 2)]}
      onAction={() => undefined}
    />
  ),
};

export const InCardHeader: Story = {
  name: "Pattern — Card header cluster",
  parameters: {
    ...storyCopySource(`
import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import {
  ButtonIcon,
  Card,
  cardTitleClasses,
  cardSubtitleClasses,
  MoreMenu,
  SegmentedControl,
} from "@whatmatters/wmds";

function MarketCardHeader() {
  const [view, setView] = useState("overview");

  return (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Texas Farmers' Market at Mueller</h2>
            <p className={cardSubtitleClasses}>2006 Philomena St. · Austin, TX</p>
          </>
        }
        end={
          <>
            <SegmentedControl
              aria-label="Market detail view"
              size="sm"
              value={view}
              onValueChange={setView}
            >
              <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
              <SegmentedControl.Item value="hours">Hours</SegmentedControl.Item>
            </SegmentedControl>
            <MoreMenu
              aria-label="More market actions"
              size="xs"
              items={[
                {
                  id: "export",
                  label: "Export",
                  start: (
                    <ButtonIcon size="sm">
                      <Download strokeWidth={2} />
                    </ButtonIcon>
                  ),
                },
                {
                  id: "share",
                  label: "Share",
                  start: (
                    <ButtonIcon size="sm">
                      <Share2 strokeWidth={2} />
                    </ButtonIcon>
                  ),
                },
              ]}
              onAction={(id) => console.log(id)}
            />
          </>
        }
      />
      <Card.Body>
        <p>Body follows selected view.</p>
      </Card.Body>
    </Card>
  );
}
`),
    wmdsLayout: "padded",
  },
  render: function CardHeaderDemo() {
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
              <SegmentedControl
                aria-label="Market detail view"
                size="sm"
                value={view}
                onValueChange={setView}
              >
                <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
                <SegmentedControl.Item value="hours">Hours</SegmentedControl.Item>
              </SegmentedControl>
              <MoreMenu
                aria-label="More market actions"
                size={iconButtonSizeForCluster("sm")}
                items={[...demoItems.slice(0, 2)]}
                onAction={() => undefined}
              />
            </>
          }
        />
        <Card.Body>
          <div className="flex min-h-24 items-center justify-center px-4 py-6">
            <p className={`${cardBodyTextClasses} text-muted`}>
              {view === "overview" ? "Overview content" : "Hours content"}
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  },
};
