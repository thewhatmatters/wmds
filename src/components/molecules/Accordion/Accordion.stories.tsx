import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CircleHelp, Settings2 } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { typographyClass } from "../../../lib/typography";
import { Accordion, accordionVariants } from "./Accordion";

const meta = {
  title: "Molecules/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: [...accordionVariants] },
    children: { control: false },
  },
  args: {
    variant: "plain",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Generic expand/collapse rows — **leading**, **label**, **trailing**, built-in chevron, \`motion-collapse\` panel. **TaskRows** composes this for task-status patterns.

| Pattern | Composition |
|---------|-------------|
| **FAQ / settings** | \`variant="plain"\` + \`Accordion.Item\` |
| **Contained list** | \`variant="list"\` — panel shell with dividers |
| **Capsules** | \`variant="capsule"\` — separated rounded rows |
| **Controlled** | \`open\` + \`onOpenChange\` on **Accordion.Item** |

## Anatomy

\`\`\`
Accordion
└── Accordion.Item
    ├── leading? — any node (**Status**, **Badge**, **ButtonIcon**)
    ├── label — \`body\` (plain) or \`ui-label\` (list / capsule)
    ├── trailing? — \`caption\` for meta; chevron is outside trailing
    ├── chevron (built-in when children present)
    └── panel — body scale + \`text-muted\` + \`px-4\` inset
\`\`\`

## Best practices

- **Do** omit \`children\` for static header rows — no chevron, no disclosure button.
- **Do** use \`leading\` / \`trailing\` for atoms — not hand-rolled affordances.
- **Do** compose **TaskRows** when you need status rings, meta, and detail rails — not raw Accordion.
- **Don't** nest interactive controls that steal clicks from the row trigger without stopping propagation.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FaqPlain: Story = {
  name: "Pattern — FAQ (plain)",
  args: { variant: "plain" },
  render: (args) => (
    <Accordion {...args} className="max-w-md">
      <Accordion.Item label="What is WhatMatters?" defaultOpen>
        WhatMatters helps teams track outcomes that actually matter — not vanity metrics.
      </Accordion.Item>
      <Accordion.Item label="How do I invite my team?">
        Open Settings → Team, then share the invite link or add emails directly.
      </Accordion.Item>
      <Accordion.Item label="Can I export my data?">
        Yes — CSV export is available on every table via the toolbar menu.
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithLeadingIcon: Story = {
  name: "Pattern — leading icon",
  render: () => (
    <Accordion variant="plain" className="max-w-md">
      <Accordion.Item
        label="Account preferences"
        leading={
          <span className="text-muted" aria-hidden>
            <ButtonIcon size="sm">
              <Settings2 strokeWidth={2} />
            </ButtonIcon>
          </span>
        }
        trailing={<span className={typographyClass("caption")}>Optional</span>}
        defaultOpen
      >
        <p>Notification defaults, timezone, and display density.</p>
      </Accordion.Item>
      <Accordion.Item
        label="Help & support"
        leading={
          <span className="text-muted" aria-hidden>
            <ButtonIcon size="sm">
              <CircleHelp strokeWidth={2} />
            </ButtonIcon>
          </span>
        }
      >
        <p>Docs, contact, and release notes.</p>
      </Accordion.Item>
    </Accordion>
  ),
};

export const ListVariant: Story = {
  name: "Pattern — list",
  args: { variant: "list" },
  render: (args) => (
    <div className="max-w-md p-4">
      <Accordion {...args}>
        <Accordion.Item label="Vendor records" trailing={<span className={typographyClass("caption")}>12</span>} defaultOpen>
          <p>Matched tax and contact IDs for every supplier.</p>
        </Accordion.Item>
        <Accordion.Item label="Opening hours" trailing={<span className={typographyClass("caption")}>1 source</span>}>
          <p>USDA API sync pending retry.</p>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

export const Capsules: Story = {
  name: "Pattern — capsules",
  args: { variant: "capsule" },
  render: (args) => (
    <div className="max-w-md bg-body p-4">
      <Accordion {...args}>
        <Accordion.Item label="Export vendor CSV" trailing={<span className={typographyClass("caption")}>12 rows</span>}>
          <p>Generated vendors.csv — ready to download.</p>
        </Accordion.Item>
        <Accordion.Item
          label="Refresh POS data"
          trailing={<span className={typographyClass("caption")}>3 files</span>}
          defaultOpen
        >
          <p>Reading export 2 of 3.</p>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

function ControlledAccordionDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md space-y-3">
      <Accordion variant="plain">
        <Accordion.Item
          label="Reorder recommendations"
          trailing={<span className={typographyClass("caption")}>7 SKUs</span>}
          open={open}
          onOpenChange={setOpen}
        >
          <p>Scoring stockout risk at 68%.</p>
        </Accordion.Item>
      </Accordion>
      <Button role="secondary" size="sm" onClick={() => setOpen((value) => !value)}>
        {open ? "Collapse" : "Expand"}
      </Button>
    </div>
  );
}

export const ControlledExpand: Story = {
  name: "Pattern — controlled expand",
  render: () => <ControlledAccordionDemo />,
};

export const StaticRow: Story = {
  name: "Pattern — static row",
  parameters: {
    docs: {
      description: {
        story: "Omit `children` — no chevron, no disclosure. Header layout matches expandable rows.",
      },
    },
  },
  render: () => (
    <Accordion variant="list" className="max-w-md">
      <Accordion.Item label="Completed vendor sync" trailing={<span className={typographyClass("caption")}>Done</span>} />
      <Accordion.Item label="Pending hours sync" trailing={<span className={typographyClass("caption")}>Waiting</span>}>
        <p>Expandable row below a static header.</p>
      </Accordion.Item>
    </Accordion>
  ),
};
