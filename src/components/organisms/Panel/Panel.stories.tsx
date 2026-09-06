import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import {
  Card,
  cardBodyTextClasses,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardTitleClasses,
} from "../../molecules/Card/Card";
import { Panel, panelSides, panelSizes } from "./Panel";
import { dialogFooterActionsClasses } from "../Dialog/dialogStyles";
import { cn } from "../../../lib/cn";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

const meta = {
  title: "Organisms/Panel",
  component: Panel,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Persistent edge flyover — non-blocking visual scrim; no scroll lock, no focus trap. The page behind stays visible and interactive (clicks pass through the dim layer).

| Pattern | Props |
|---------|--------|
| **Detail rail** | \`side="end"\` (default) — inspect a row without leaving the list |
| **Tool palette** | \`side="start"\` — secondary tools beside the canvas |
| **Size** | \`sm\` / \`md\` / \`lg\` — same width tokens as **Sheet** side panels |

Use **Sheet** when the flow should block the canvas (scrim captures clicks + scroll lock). Use **Panel** when users may still interact with the page.

## Anatomy

\`\`\`
Panel (open / onOpenChange)
└── Panel.Content — Card header rhythm + scrollable body + optional footer
    ├── header — full-width hairline when body/footer follow (**Sheet** chrome)
    ├── body — flex-1 overflow-y scroll
    └── footer — full-width hairline + pinned actions
\`\`\`

## Best practices

- **Do** use for peek/detail flows — occupancy row inspect, audit trail, map pin detail.
- **Do** keep \`aria-modal="false"\` — page remains usable.
- **Don't** use for blocking confirms — **AlertDialog**.
- **Don't** use \`bottom\` — not a **Panel** pattern; use **Sheet**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EndDetailRail: Story = {
  name: "Pattern — end detail rail",
  render: function EndDetailRailPattern() {
    const [open, setOpen] = useState(true);

    return (
      <div className="relative min-h-[28rem] w-full">
        <Card padding="none" className="max-w-xl">
          <Card.Header start={<h2 className={cardTitleClasses}>Mueller market</h2>} />
          <Card.Body>
            <div
              className={cn(
                cardLayoutBodyOccupantInsetXClasses,
                cardLayoutBodyOccupantPadYClasses,
              )}
            >
              <p className={cardBodyTextClasses}>
                Occupancy held at 82% this week. Open the detail rail to review threshold
                history without leaving the list.
              </p>
            </div>
          </Card.Body>
          <Card.Footer className="justify-end">
            <Button role="secondary" size="sm" onClick={() => setOpen(true)}>
              View details
            </Button>
          </Card.Footer>
        </Card>

        <Panel open={open} onOpenChange={setOpen}>
          <Panel.Content
            title="Threshold history"
            description="Last 7 days — Mueller market"
            headerStart={<Info strokeWidth={2} />}
            size="md"
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            }
          >
            <ul className="flex flex-col gap-3 pb-4 text-muted type-body">
              <li>Mon — 84% (threshold 80%)</li>
              <li>Tue — 81% (threshold 80%)</li>
              <li>Wed — 79% (threshold 80%)</li>
              <li>Thu — 82% (threshold 80%)</li>
            </ul>
          </Panel.Content>
        </Panel>
      </div>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, Card, Panel } from "@whatmatters/wmds";

function MarketDetailRail() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card padding="none">{/* list row */}</Card>
      <Panel open={open} onOpenChange={setOpen}>
        <Panel.Content
          title="Threshold history"
          description="Last 7 days — Mueller market"
          size="md"
        >
          {/* scrollable detail */}
        </Panel.Content>
      </Panel>
    </>
  );
}
`),
};

export const PanelSidesReference: Story = {
  name: "Reference — sides",
  parameters: { docs: { disable: true } },
  render: function PanelSidesReference() {
    return (
      <ul className="type-body flex flex-col gap-2 text-muted">
        {panelSides.map((side) => (
          <li key={side}>
            <code>{side}</code> — edge-attached flyover
          </li>
        ))}
      </ul>
    );
  },
};

export const PanelSizesReference: Story = {
  name: "Reference — sizes",
  parameters: { docs: { disable: true } },
  render: function PanelSizesReference() {
    return (
      <ul className="type-body flex flex-col gap-2 text-muted">
        {panelSizes.map((size) => (
          <li key={size}>
            <code>{size}</code> — max width in <code>panelSizeClasses</code>
          </li>
        ))}
      </ul>
    );
  },
};
