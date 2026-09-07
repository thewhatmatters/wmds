import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, FileText, Image, Pencil } from "lucide-react";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { FloatingActionButton } from "./FloatingActionButton";

const actions = [
  { id: "camera", label: "Camera", icon: <Camera /> },
  { id: "image", label: "Image", icon: <Image /> },
  { id: "file", label: "File", icon: <FileText /> },
  { id: "edit", label: "Edit", icon: <Pencil /> },
];

const meta = {
  title: "Molecules/FloatingActionButton",
  component: FloatingActionButton,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

**FloatingActionButton** reveals two to four high-priority actions in a vertical stack above its trigger. It composes **IconButton** for the trigger and every action, while Motion owns path position, stagger, and label entrance.

Pass action data through \`items\` and handle selection with \`onAction\`. Use \`backdrop\` when the expanded menu should temporarily separate itself from page content.

## Anatomy

\`\`\`
FloatingActionButton
├── IconButton fab — trigger
├── optional dismiss backdrop
└── vertical action stack
    └── IconButton secondary + visible label
\`\`\`

## Best practices

- **Do** keep the set to two–four distinct, high-priority actions.
- **Do** use short labels and familiar Lucide icons.
- **Do** place it at a stable viewport edge with \`className\`.
- **Don't** use it for filters, many destinations, or destructive confirmation.
- **Don't** pass custom colors or motion recipes; WMDS owns those contracts.
        `.trim(),
      },
    },
  },
  args: {
    items: actions,
    onAction: () => undefined,
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalActions: Story = {
  name: "Pattern — vertical actions",
  render: (args) => (
    <div className="relative h-[420px] w-[360px] overflow-hidden rounded-2xl border border-border bg-body">
      <FloatingActionButton {...args} className="absolute bottom-4 right-4" backdrop />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The trigger stays anchored while labeled actions rise straight above it. Escape, backdrop press, or action selection closes the menu.",
      },
    },
    ...storyCopySource(`
import { Camera, FileText, Image, Pencil } from "lucide-react";
import { FloatingActionButton } from "@whatmatters/wmds";

<FloatingActionButton
  className="fixed bottom-4 right-4"
  backdrop
  items={[
    { id: "camera", label: "Camera", icon: <Camera /> },
    { id: "image", label: "Image", icon: <Image /> },
    { id: "file", label: "File", icon: <FileText /> },
    { id: "edit", label: "Edit", icon: <Pencil /> },
  ]}
  onAction={(id) => performAction(id)}
/>
`),
  },
};
