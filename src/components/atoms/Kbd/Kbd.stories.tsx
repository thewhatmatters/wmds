import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../../../lib/cn";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { Kbd, kbdSizes } from "./Kbd";

const meta = {
  title: "Components/Data display/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...kbdSizes] },
    children: { control: "text" },
  },
  args: {
    children: "K",
    size: "sm",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Use **Kbd** to display one physical key in a shortcut, command menu, or keyboard-help surface. Compose multiple keycaps beside each other for combinations.

## Anatomy

\`\`\`
Kbd (\`kbd\`)
└── key label
\`\`\`

## Best practices

- **Do** keep labels short: \`K\`, \`⌘\`, \`Enter\`, \`Esc\`, or arrow symbols.
- **Do** add \`aria-label\` when a symbol needs a spoken expansion.
- **Do** compose separate **Kbd** elements for each physical key.
- **Don't** make **Kbd** interactive; place it beside the command it documents.
- **Don't** use it for status, tags, or counts—use **Badge**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shortcut: Story = {
  name: "Pattern — keyboard shortcut",
  parameters: {
    docs: {
      description: {
        story:
          "A command hint composed from one semantic keycap per physical key.",
      },
    },
    ...storyCopySource(`
import { Kbd } from "@whatmatters/wmds";

<span className="inline-flex items-center gap-1">
  <Kbd aria-label="Command">⌘</Kbd>
  <span aria-hidden>+</span>
  <Kbd>K</Kbd>
</span>
`),
  },
  render: () => (
    <span className="inline-flex items-center gap-1 text-muted">
      <Kbd aria-label="Command">⌘</Kbd>
      <span aria-hidden>+</span>
      <Kbd>K</Kbd>
    </span>
  ),
};

export const CommandRow: Story = {
  name: "Pattern — command row",
  parameters: {
    docs: {
      description: {
        story:
          "Keep the command label primary and align the shortcut as trailing supporting information.",
      },
    },
    ...storyCopySource(`
import { Kbd } from "@whatmatters/wmds";

<div className="flex items-center justify-between gap-6">
  <span>Open command menu</span>
  <span className="inline-flex items-center gap-1">
    <Kbd aria-label="Command">⌘</Kbd>
    <Kbd>K</Kbd>
  </span>
</div>
`),
  },
  render: () => (
    <div
      className={cn(
        typographyClass("body"),
        "flex w-72 items-center justify-between gap-6 rounded-lg bg-surface px-3 py-2 text-fg shadow-hairline",
      )}
    >
      <span>Open command menu</span>
      <span className="inline-flex items-center gap-1">
        <Kbd aria-label="Command">⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: () => (
    <div className="flex items-end gap-4">
      {kbdSizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Kbd size={size}>Esc</Kbd>
          <span className={cn(typographyClass("caption"), "text-muted")}>{size}</span>
        </div>
      ))}
    </div>
  ),
};
