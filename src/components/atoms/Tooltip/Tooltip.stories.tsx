import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, Settings } from "lucide-react";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { Kbd } from "../Kbd/Kbd";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { Tooltip, tooltipAlignments, tooltipSides } from "./Tooltip";

const meta = {
  title: "Components/Feedback/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Use **Tooltip** for a short, supplemental label or keyboard hint attached to an existing control. It opens on hover and keyboard focus, renders in a portal, flips or shifts away from viewport edges, and closes with Escape. Wrap related tooltips in **Tooltip.Provider** to share hover timing.

## Anatomy

\`\`\`
Tooltip.Provider (shared timing)
└── Tooltip (open state)
    ├── Tooltip.Trigger (existing control)
    └── Tooltip.Content (portal → positioner → popup + arrow)
\`\`\`

## Best practices

- **Do** keep copy brief and descriptive, especially beside icon-only controls.
- **Do** treat tooltip content as supplemental; the trigger still needs its own accessible name.
- **Do** use logical \`inline-start\` / \`inline-end\` placement when direction should follow RTL.
- **Do** wrap a disabled native button in a focusable trigger only when a short explanation is useful.
- **Don't** put links, buttons, forms, or essential instructions inside a tooltip.
- **Don't** rely on a tooltip as the only touch path; tooltips do not open on touch devices.
- **Don't** pass a component to \`render\` unless it forwards its ref and DOM event/ARIA props.
        `.trim(),
      },
    },
  },
  argTypes: {
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconAction: Story = {
  name: "Pattern — icon-only action",
  parameters: {
    docs: {
      description: {
        story:
          "The IconButton keeps its accessible name while Tooltip adds the same short visible label for pointer and keyboard users.",
      },
    },
    ...storyCopySource(`
import { IconButton, Tooltip } from "@whatmatters/wmds";
import { Settings } from "lucide-react";

<Tooltip.Provider>
  <Tooltip>
    <Tooltip.Trigger
      render={
        <IconButton
          icon={<Settings />}
          aria-label="Workspace settings"
          title=""
        />
      }
    />
    <Tooltip.Content>Workspace settings</Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>
`),
  },
  render: () => (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger
          render={
            <IconButton
              icon={<Settings strokeWidth={2} />}
              aria-label="Workspace settings"
              title=""
            />
          }
        />
        <Tooltip.Content>Workspace settings</Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  ),
};

export const Placement: Story = {
  name: "Pattern — placement",
  parameters: {
    docs: {
      description: {
        story:
          "Choose a preferred side; collision handling may flip or shift the popup to keep it visible.",
      },
    },
    ...storyCopySource(`
import { Button, Tooltip } from "@whatmatters/wmds";

<Tooltip>
  <Tooltip.Trigger render={<Button role="secondary">Details</Button>} />
  <Tooltip.Content side="inline-end" align="center">
    View market details
  </Tooltip.Content>
</Tooltip>
`),
  },
  render: () => (
    <Tooltip.Provider delay={0}>
      <div className="grid grid-cols-3 items-center gap-8 py-12">
        {tooltipSides.slice(0, 4).map((side) => (
          <Tooltip key={side}>
            <Tooltip.Trigger render={<Button role="secondary">{side}</Button>} />
            <Tooltip.Content side={side}>{side} placement</Tooltip.Content>
          </Tooltip>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

export const KeyboardShortcut: Story = {
  name: "Pattern — keyboard shortcut",
  parameters: {
    docs: {
      description: {
        story:
          "A short action label may include Kbd as a non-interactive trailing hint.",
      },
    },
    ...storyCopySource(`
import { IconButton, Kbd, Tooltip } from "@whatmatters/wmds";
import { Info } from "lucide-react";

<Tooltip>
  <Tooltip.Trigger
    render={<IconButton icon={<Info />} aria-label="Show details" title="" />}
  />
  <Tooltip.Content>
    <span className="inline-flex items-center gap-2">
      Show details <Kbd>D</Kbd>
    </span>
  </Tooltip.Content>
</Tooltip>
`),
  },
  render: () => (
    <Tooltip>
      <Tooltip.Trigger
        render={<IconButton icon={<Info strokeWidth={2} />} aria-label="Show details" title="" />}
      />
      <Tooltip.Content>
        <span className="inline-flex items-center gap-2">
          Show details <Kbd>D</Kbd>
        </span>
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const DisabledControl: Story = {
  name: "Pattern — disabled control",
  parameters: {
    docs: {
      description: {
        story:
          "Native disabled controls do not emit focus or pointer events. Put the disabled Button inside a focusable wrapper trigger and explain why it is unavailable.",
      },
    },
    ...storyCopySource(`
import { Button, Tooltip } from "@whatmatters/wmds";

<Tooltip>
  <Tooltip.Trigger
    render={
      <span
        className="inline-flex"
        tabIndex={0}
        aria-label="Export unavailable"
      >
        <Button disabled>Export</Button>
      </span>
    }
  />
  <Tooltip.Content>Choose a date range before exporting</Tooltip.Content>
</Tooltip>
`),
  },
  render: () => (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <span className="inline-flex" tabIndex={0} aria-label="Export unavailable">
            <Button disabled>Export</Button>
          </span>
        }
      />
      <Tooltip.Content>Choose a date range before exporting</Tooltip.Content>
    </Tooltip>
  ),
};

export const Controlled: Story = {
  name: "Pattern — controlled state",
  parameters: {
    docs: {
      description: {
        story:
          "Control visibility when product state must observe or coordinate the tooltip; normal hover, focus, and Escape events still report through onOpenChange.",
      },
    },
    ...storyCopySource(`
import { useState } from "react";
import { IconButton, Tooltip } from "@whatmatters/wmds";
import { Info } from "lucide-react";

function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger
        render={<IconButton icon={<Info />} aria-label="About scoring" title="" />}
      />
      <Tooltip.Content>How recommendation scoring works</Tooltip.Content>
    </Tooltip>
  );
}
`),
  },
  render: function ControlledTooltipStory() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex items-center gap-3">
        <Tooltip open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger
            render={<IconButton icon={<Info strokeWidth={2} />} aria-label="About scoring" title="" />}
          />
          <Tooltip.Content>How recommendation scoring works</Tooltip.Content>
        </Tooltip>
        <span aria-live="polite">{open ? "Open" : "Closed"}</span>
      </div>
    );
  },
};

export const ReferencePlacements: Story = {
  name: "Reference — placements",
  render: () => (
    <div className="flex flex-wrap gap-3">
      {tooltipSides.map((side) =>
        tooltipAlignments.map((align) => (
          <Tooltip key={`${side}-${align}`} defaultOpen={side === "top" && align === "center"}>
            <Tooltip.Trigger
              render={<Button role="secondary" size="xs">{`${side} · ${align}`}</Button>}
            />
            <Tooltip.Content side={side} align={align}>
              {side} · {align}
            </Tooltip.Content>
          </Tooltip>
        )),
      )}
    </div>
  ),
};
