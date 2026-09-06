import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { Switch } from "../../atoms/Switch/Switch";
import { Sheet, sheetSides, sheetSizes } from "./Sheet";
import { dialogFooterActionsClasses } from "../Dialog/dialogStyles";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

const meta = {
  title: "Organisms/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Dismissible edge overlay — bottom drawer or side sheet. Shares portal scrim, focus trap, and scroll lock with **Dialog**.

| Pattern | Props |
|---------|--------|
| **Bottom drawer** | \`side="bottom"\` (default) — mobile filters, short forms |
| **End sheet** | \`side="end"\` — detail rail, settings on desktop |
| **Start sheet** | \`side="start"\` — nav or tool palette |
| **Size** | \`sm\` / \`md\` / \`lg\` — max-height (bottom) or width (side) |

Mobile (< \`md\`): **16px inset on the trailing edge only** — \`end\` → \`pl-4\` (scrim on the left); entry + top/bottom flush. Tablet+ side sheets fully edge-flush.

Use **Panel** when the page should stay interactive without a scrim — see **Organisms/Panel**.

## Anatomy

\`\`\`
Sheet (open / onOpenChange)
└── Sheet.Content — Card header rhythm + scrollable body + optional footer
    ├── header — \`headerStart\` | title | close (**Card.Header** \`start\` | \`end\`)
    ├── body — flex-1 overflow-y scroll
    └── footer — pinned (shrink-0), end-aligned Button cluster
\`\`\`

## Best practices

- **Do** use **bottom** on mobile for filters and compact flows.
- **Do** use **end** on tablet+ for detail without leaving the page.
- **Do** dismiss via scrim, Escape, and close — same as **Dialog**.
- **Don't** use for blocking confirms — **AlertDialog**.
- **Don't** use \`top\` — not a WMDS pattern; use **bottom** or side sheets only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomSheet: Story = {
  name: "Pattern — bottom sheet",
  render: function BottomSheetPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Filter results
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content
            title="Filters"
            description="Refine the occupancy view."
            headerStart={<SlidersHorizontal strokeWidth={2} />}
            size="md"
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                  Reset
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4 pb-4">
              <Input label="Minimum occupancy %" placeholder="80" />
              <Input label="Market" placeholder="All markets" />
            </div>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, Input, Sheet } from "@whatmatters/wmds";
import { dialogFooterActionsClasses } from "@whatmatters/wmds";

function FilterSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="secondary" onClick={() => setOpen(true)}>
        Filter results
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          title="Filters"
          description="Refine the occupancy view."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Reset
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 pb-4">
            <Input label="Minimum occupancy %" placeholder="80" />
            <Input label="Market" placeholder="All markets" />
          </div>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
`),
};

export const EndSheet: Story = {
  name: "Pattern — end sheet",
  render: function EndSheetPattern() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
      <>
        <Button role="primary" onClick={() => setOpen(true)}>
          Open settings
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content
            side="end"
            size="md"
            title="Settings"
            description="Workspace preferences"
          >
            <div className="flex flex-col gap-4 pb-4">
              <Switch
                layout="settings"
                label="Email notifications"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
              />
              <Switch
                layout="settings"
                label="Weekly digest"
                checked={!notifications}
                onChange={() => undefined}
              />
            </div>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, Sheet, Switch } from "@whatmatters/wmds";

function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          title="Settings"
          description="Workspace preferences"
        >
          <Switch
            layout="settings"
            label="Email notifications"
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
          />
        </Sheet.Content>
      </Sheet>
    </>
  );
}
`),
};

export const BottomSheetScroll: Story = {
  name: "Pattern — scroll (header/footer pinned)",
  parameters: { docs: { disable: true } },
  render: function BottomSheetScrollPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Open long filter list
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content
            title="Filters"
            description="Header and footer stay visible — only the body scrolls."
            size="md"
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                  Reset
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-3 pb-4">
              {Array.from({ length: 24 }, (_, index) => (
                <Input
                  key={index}
                  label={`Filter ${index + 1}`}
                  placeholder={`Value ${index + 1}`}
                />
              ))}
            </div>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
};

export const SheetReference: Story = {
  name: "Reference — sides and sizes",
  parameters: { docs: { disable: true } },
  render: () => (
    <div className="type-body flex flex-col gap-3 text-muted">
      <p>
        <strong className="text-fg">Sides:</strong> {sheetSides.join(", ")}
      </p>
      <p>
        <strong className="text-fg">Sizes:</strong> {sheetSizes.join(", ")}
      </p>
    </div>
  ),
};
