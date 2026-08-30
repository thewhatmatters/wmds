import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Chip } from "../Chip/Chip";
import {
  List,
  listItemLayouts,
  listVariants,
  type ListItemLayout,
} from "./List";

const SAMPLE_MARKETS = [
  {
    id: "pdx",
    name: "Portland Farmers Market",
    street: "1831 SW Jefferson St",
    miles: 1.2,
    snap: true,
  },
  {
    id: "beaverton",
    name: "Beaverton Farmers Market",
    street: "SW Hall Blvd & 3rd St",
    miles: 4.8,
    snap: true,
  },
  {
    id: "hillsdale",
    name: "Hillsdale Farmers Market",
    street: "SW Capitol Hwy & Sunset Blvd",
    miles: 2.1,
    snap: false,
  },
] as const;

const meta = {
  title: "Molecules/List",
  component: List,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: [...listVariants] },
    hasDividers: { control: "boolean" },
    header: { control: false },
    children: { control: false },
  },
  args: {
    variant: "surface",
    hasDividers: true,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

[Astryx List](https://astryx.atmeta.com/components/List) — scannable **rows inside a panel**, not one Card per record.

| Pattern | Composition |
|---------|-------------|
| **Panel tray** | Parent \`rounded-lg border bg-surface\` → \`List variant="surface"\` with \`hasDividers\` |
| **Selectable row** | \`List.Item\` + \`onPress\` + \`selected\` — \`aria-pressed\`, \`bg-body\` when selected |
| **FM browse (stacked)** | \`layout="stacked"\` — name → street → miles; optional trailing \`Chip readOnly\` |
| **Split row** | \`layout="split"\` — name, street, trailing \`Chip\` left; \`meta\` (miles) right |
| **Read-only row** | Omit \`onPress\` — static content, no button chrome |
| **Header** | \`header\` slot — optional title above rows (filters/search stay outside) |

**Parent owns outer radius.** List uses \`shape="flush"\` rhythm — inset \`px-4 py-3\`, hairline \`divide-border\`.

## Anatomy

\`\`\`
List
├── header?          (optional chrome)
└── ul[role=list]
    └── List.Item    (li → button or static div)
        ├── primary
        ├── secondary?
        ├── meta?
        └── trailing?
\`\`\`

## Best practices

- **Do** wrap List in a bordered panel for FM sidebar results — padding **0** on the panel body; List owns inset.
- **Do** use \`layout="stacked"\` for Farmer Market browse rows (name / address / distance).
- **Do** put SNAP and status labels in \`trailing\` as read-only \`Chip\` — not inside Badge.
- **Don't** wrap each row in \`Card\` — records belong in List rows ([Astryx layout](https://astryx.atmeta.com/docs/layout)).
- **Don't** use \`className\` on items to invent new typography — \`primary\` / \`secondary\` / \`meta\` own roles.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

function MarketListDemo({
  layout = "stacked",
  variant = "surface",
}: {
  layout?: ListItemLayout;
  variant?: (typeof listVariants)[number];
}) {
  const [selectedId, setSelectedId] = useState(SAMPLE_MARKETS[0].id);

  return (
    <div className="max-w-md overflow-hidden rounded-lg border border-border bg-surface">
      <List variant={variant} hasDividers>
        {SAMPLE_MARKETS.map((market) => (
          <List.Item
            key={market.id}
            layout={layout}
            primary={market.name}
            secondary={market.street}
            meta={`${market.miles} mi`}
            trailing={
              market.snap ? (
                <Chip readOnly size="sm">
                  SNAP
                </Chip>
              ) : undefined
            }
            selected={market.id === selectedId}
            onPress={() => setSelectedId(market.id)}
          />
        ))}
      </List>
    </div>
  );
}

export const StackedSelectable: Story = {
  name: "Pattern — stacked selectable",
  render: () => <MarketListDemo layout="stacked" />,
};

export const SplitSelectable: Story = {
  name: "Pattern — split selectable",
  render: () => <MarketListDemo layout="split" />,
};

export const WithHeader: Story = {
  name: "Pattern — header",
  render: () => (
    <div className="max-w-md overflow-hidden rounded-lg border border-border bg-surface">
      <List header="12 markets nearby" hasDividers>
        {SAMPLE_MARKETS.map((market) => (
          <List.Item
            key={market.id}
            primary={market.name}
            secondary={market.street}
            meta={`${market.miles} mi`}
          />
        ))}
      </List>
    </div>
  ),
};

export const ReadOnly: Story = {
  name: "Pattern — read-only",
  render: () => (
    <div className="max-w-md overflow-hidden rounded-lg border border-border bg-surface">
      <List hasDividers>
        <List.Item
          primary="Notifications"
          secondary="Email and push preferences"
          trailing={<Chip readOnly size="sm">On</Chip>}
        />
        <List.Item
          primary="Location"
          secondary="Used for nearby markets"
          meta="Portland, OR"
          trailing={<Chip readOnly size="sm" icon={<MapPin strokeWidth={2} />}>97201</Chip>}
        />
      </List>
    </div>
  ),
};

export const GhostInPanel: Story = {
  name: "Pattern — ghost variant",
  parameters: {
    docs: {
      description: {
        story:
          "`variant=\"ghost\"` when the parent panel already owns `bg-surface` — List rows still get dividers and inset padding.",
      },
    },
  },
  render: () => (
    <div className="max-w-md overflow-hidden rounded-lg border border-border bg-surface p-0">
      <List variant="ghost" hasDividers>
        {SAMPLE_MARKETS.map((market) => (
          <List.Item
            key={market.id}
            layout="stacked"
            primary={market.name}
            secondary={market.street}
            meta={`${market.miles} mi`}
          />
        ))}
      </List>
    </div>
  ),
};

export const Layouts: Story = {
  name: "Reference — layouts",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `\`layout\` options: ${listItemLayouts.join(", ")}.`,
      },
    },
  },
  render: () => (
    <div className="grid max-w-3xl gap-6 md:grid-cols-2">
      <div>
        <p className="type-label mb-2 text-muted">stacked</p>
        <MarketListDemo layout="stacked" />
      </div>
      <div>
        <p className="type-label mb-2 text-muted">split</p>
        <MarketListDemo layout="split" />
      </div>
    </div>
  ),
};
