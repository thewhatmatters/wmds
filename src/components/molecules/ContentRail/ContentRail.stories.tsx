import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../List/List";
import { ContentRail } from "./ContentRail";

const meta = {
  title: "Molecules/ContentRail",
  component: ContentRail,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

**Supporting content rail** — fixed-width scroll pane beside a main canvas (map, detail, settings).

| Pattern | Composition |
|---------|-------------|
| **Map + list (FM)** | \`h-[100dvh]\` flex row → map \`flex-1\` + \`ContentRail position="end"\` |
| **Header slot** | \`header={…}\` — sticky chrome; pill \`Input shape="pill"\` + \`ChipFilterGroup\` |
| **Overflow** | Rail fills viewport height; \`header\` stays fixed; **body scrolls** (\`overflow-y-auto\`) |
| **Widths** | \`sm\` (18rem) · \`md\` (20rem, default) · \`lg\` (24rem) from \`md:\` — full width on mobile |

## Anatomy

\`\`\`
ContentRail (flex column, h-full, overflow-hidden)
├── Header (shrink-0) — search, filters
└── Body (flex-1, min-h-0, overflow-y-auto) — List rows scroll here
\`\`\`

Parent chain must pass height: \`h-[100dvh] min-h-0 overflow-hidden\` flex row/col on the page wrapper.

## Best practices

- **Do** put \`List\` in the rail body — panel owns chrome, List owns rows.
- **Do** use \`position="end"\` for FM browse (list on the right in LTR).
- **Do** keep the map/main canvas as a sibling with \`flex-1 min-h-0\` — only the rail body scrolls.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ContentRail>;

export default meta;
type Story = StoryObj<typeof meta>;

const SCROLL_MARKETS = Array.from({ length: 16 }, (_, index) => ({
  id: `market-${index}`,
  name: `Farmers Market ${index + 1}`,
  street: `${100 + index} Main St`,
  miles: `${(index + 1) * 0.4} mi`,
}));

export const MapAndList: Story = {
  name: "Pattern — map + list rail",
  render: () => (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-body md:flex-row">
      <div
        className="hidden min-h-0 shrink-0 flex-1 bg-accent-muted md:block"
        aria-label="Map canvas"
      />
      <ContentRail
        aria-label="Results"
        position="end"
        width="md"
        header={<p className="type-body text-muted">Search + filters compose here</p>}
      >
        <List variant="ghost" hasDividers>
          {SCROLL_MARKETS.map((market) => (
            <List.Item
              key={market.id}
              primary={market.name}
              secondary={market.street}
              meta={market.miles}
            />
          ))}
        </List>
      </ContentRail>
    </div>
  ),
};
