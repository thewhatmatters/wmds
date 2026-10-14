import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Input } from "../../atoms/Input/Input";
import { Switch } from "../../atoms/Switch/Switch";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { useSheetParam } from "../../../lib/sheetParam/useSheetParam";
import { withSheetParam } from "../../../lib/sheetParam/sheetParam";
import { lockedViewportStory } from "../../../lib/viewports";
import { Sheet, sheetSides, sheetSizes } from "./Sheet";
import { dialogFooterActionsClasses } from "../Dialog/dialogStyles";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Sheet",
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

Below \`md\`: \`side="end"\` is **full-screen** — no inset, no radius, close stays top-right; the header and footer stay pinned, only the body scrolls, and the footer clears the home indicator (safe-area padding). From \`md\` it is a rail with a light scrim. \`bottom\` and \`start\` keep a 16px strip of scrim on the trailing edge below \`md\`.

\`headerActions\` puts controls before the close — **IconButton** \`size="sm"\` for previous / next, share, open in full. The URL helper **\`useSheetParam(kind)\`** keeps one sheet in \`?sheet=<kind>&id=<id>\` — see **Pattern — side sheet URL deep link**.

Use **Panel** when the page should stay interactive without a scrim — see **Components/Panel**.

## Anatomy

\`\`\`
Sheet (open / onOpenChange)
└── Sheet.Content — Card header rhythm + scrollable body + optional footer
    ├── header — \`headerStart\` | title | \`headerActions\` + close (**Card.Header** \`start\` | \`end\`)
    ├── body — flex-1 overflow-y scroll
    └── footer — pinned (shrink-0), end-aligned Button cluster
\`\`\`

## Best practices

- **Do** use **bottom** on mobile for filters and compact flows.
- **Do** use **end** for the detail of a row; give it a footer for the decision (Approve, Deny) so it stays in reach on a phone.
- **Do** put a deep-linkable detail in the URL with \`useSheetParam\` so Back closes it and a shared link opens it.
- **Do** dismiss via scrim, Escape, and close — same as **Dialog**.
- **Don't** use for blocking confirms — **AlertDialog**.
- **Don't** use \`top\` — not a WMDS pattern; use **bottom** or side sheets only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
/** Stories that pass required props in their own JSX — args stay optional. */
type Story = StoryObj<typeof Sheet>;

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
import { Button, Input, Sheet } from "@thewhatmatters/wmds";
import { dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function FilterSheet() {
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
import { Button, Sheet, Switch } from "@thewhatmatters/wmds";

export function SettingsSheet() {
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

interface DetailItem {
  id: string;
  name: string;
  kind: string;
  waiting: string;
}

const detailItems: DetailItem[] = [
  { id: "maya-chen", name: "Maya Chen", kind: "Creator application", waiting: "3 days" },
  { id: "field-notes-q4", name: "Field notes: Q4 studio update", kind: "Post", waiting: "2 days" },
  { id: "dev-patel", name: "Dev Patel", kind: "Creator application", waiting: "1 day" },
];

const sideSheetCode = `
import { useState } from "react";
import { Button, Sheet, dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function ApprovalSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Review Maya Chen
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          size="md"
          title="Maya Chen"
          description="Creator application, waiting 3 days"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="outline" onClick={() => setOpen(false)}>
                Deny
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Approve
              </Button>
            </div>
          }
        >
          <p>Writes about independent studios. Two published samples attached.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
`;

export const SideSheet: Story = {
  name: "Pattern — side sheet",
  render: function SideSheetPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="primary" onClick={() => setOpen(true)}>
          Review Maya Chen
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content
            side="end"
            size="md"
            title="Maya Chen"
            description="Creator application, waiting 3 days"
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="outline" onClick={() => setOpen(false)}>
                  Deny
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Approve
                </Button>
              </div>
            }
          >
            <p>Writes about independent studios. Two published samples attached.</p>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A detail rail. From md it sits at the end edge over a light scrim; below md it fills the screen. The header and footer stay pinned and the body scrolls.",
        },
      },
    },
    sideSheetCode,
  ),
};

const headerActionsCode = `
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button, IconButton, Sheet } from "@thewhatmatters/wmds";

export function StepThroughSheet() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const names = ["Maya Chen", "Field notes: Q4 studio update", "Dev Patel"];

  return (
    <>
      <Button role="secondary" onClick={() => setOpen(true)}>
        Review queue
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          title={names[index]}
          description={\`\${index + 1} of \${names.length}\`}
          headerActions={
            <>
              <IconButton
                size="sm"
                role="ghost"
                icon={<ChevronUp strokeWidth={2} />}
                aria-label="Previous"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
              />
              <IconButton
                size="sm"
                role="ghost"
                icon={<ChevronDown strokeWidth={2} />}
                aria-label="Next"
                disabled={index === names.length - 1}
                onClick={() => setIndex(index + 1)}
              />
            </>
          }
        >
          <p>Detail for {names[index]}.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
`;

export const SideSheetHeaderActions: Story = {
  name: "Pattern — side sheet header actions",
  render: function SideSheetHeaderActionsPattern() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Review queue
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content
            side="end"
            title={detailItems[index].name}
            description={`${index + 1} of ${detailItems.length}`}
            headerActions={
              <>
                <IconButton
                  size="sm"
                  role="ghost"
                  icon={<ChevronUp strokeWidth={2} />}
                  aria-label="Previous"
                  disabled={index === 0}
                  onClick={() => setIndex(index - 1)}
                />
                <IconButton
                  size="sm"
                  role="ghost"
                  icon={<ChevronDown strokeWidth={2} />}
                  aria-label="Next"
                  disabled={index === detailItems.length - 1}
                  onClick={() => setIndex(index + 1)}
                />
              </>
            }
          >
            <p>Detail for {detailItems[index].name}.</p>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "`headerActions` sits before the close. Use IconButton size sm; give each an aria-label.",
        },
      },
    },
    headerActionsCode,
  ),
};

export const SideSheetLongScroll: Story = {
  name: "Side sheet — long scroll",
  parameters: { docs: { disable: true } },
  render: function SideSheetLongScrollExample() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Open long detail
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content
            side="end"
            title="Field notes: Q4 studio update"
            description="Header and footer stay put; only the body scrolls."
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="outline" onClick={() => setOpen(false)}>
                  Deny
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Approve
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-3 pb-4">
              {Array.from({ length: 24 }, (_, index) => (
                <Input key={index} label={`Reviewer note ${index + 1}`} placeholder="Add a note" />
              ))}
            </div>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
};

const deepLinkCode = `
import { TextLink, Sheet, Button, useSheetParam, withSheetParam, dialogFooterActionsClasses } from "@thewhatmatters/wmds";

interface ApprovalRow {
  id: string;
  name: string;
}

export function ApprovalList({ rows, initialUrl }: { rows: ApprovalRow[]; initialUrl?: string }) {
  const { open, id, onOpenChange } = useSheetParam("approval", { initialUrl });
  const row = rows.find((item) => item.id === id);

  return (
    <>
      <ul className="flex flex-col gap-2">
        {rows.map((item) => (
          <li key={item.id}>
            <TextLink
              href={withSheetParam(initialUrl ?? "/approvals", item.id, "approval")}
              onClick={(event) => {
                event.preventDefault();
                onOpenChange(true, item.id);
              }}
            >
              {item.name}
            </TextLink>
          </li>
        ))}
      </ul>
      <Sheet open={open && row != null} onOpenChange={(next) => onOpenChange(next)}>
        <Sheet.Content
          side="end"
          title={row?.name}
          description="Creator application"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="primary" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          }
        >
          <p>Detail for {row?.name}.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
`;

export const SideSheetUrlDeepLink: Story = {
  name: "Pattern — side sheet URL deep link",
  render: function SideSheetUrlDeepLinkPattern() {
    const { open, id, onOpenChange } = useSheetParam("approval");
    const row = detailItems.find((item) => item.id === id);

    return (
      <>
        <ul className="flex flex-col gap-2">
          {detailItems.map((item) => (
            <li key={item.id}>
              <TextLink
                href={withSheetParam("/approvals", item.id, "approval")}
                onClick={(event) => {
                  event.preventDefault();
                  onOpenChange(true, item.id);
                }}
              >
                {item.name}
              </TextLink>
            </li>
          ))}
        </ul>
        <Sheet open={open && row != null} onOpenChange={(next) => onOpenChange(next)}>
          <Sheet.Content
            side="end"
            title={row?.name}
            description="Creator application"
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="primary" onClick={() => onOpenChange(false)}>
                  Done
                </Button>
              </div>
            }
          >
            <p>Detail for {row?.name}.</p>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "`useSheetParam(kind)` keeps the open sheet in `?sheet=<kind>&id=<id>`: opening pushes a history entry, closing replaces it, Back closes, and a shared link opens it on the first render. Pass `initialUrl` on the server so the first paint has the sheet open. Rows stay real links through `withSheetParam`.",
        },
      },
    },
    deepLinkCode,
  ),
};

export const SideSheetMobile: Story = {
  name: "Side sheet — mobile 390",
  render: function SideSheetMobileExample() {
    const [open, setOpen] = useState(true);

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          title="Maya Chen"
          description="Creator application, waiting 3 days"
          headerActions={
            <IconButton
              size="sm"
              role="ghost"
              icon={<ChevronDown strokeWidth={2} />}
              aria-label="Next"
            />
          }
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="outline" onClick={() => setOpen(false)}>
                Deny
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Approve
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-3 pb-4">
            {Array.from({ length: 16 }, (_, index) => (
              <Input key={index} label={`Reviewer note ${index + 1}`} placeholder="Add a note" />
            ))}
          </div>
        </Sheet.Content>
      </Sheet>
    );
  },
  ...lockedViewportStory("mobile"),
};
