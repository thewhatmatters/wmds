import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import {
  storyCopySource,
  storyMetaDocsDefaults,
} from "../../../lib/storyCopySource";
import { Button } from "../../atoms/Button/Button";
import { Toast, Toaster, toast } from "./Toast";
import { toastPositions, type ToastPosition } from "./toastStyles";

const meta = {
  title: "Organisms/Toast",
  component: Toast,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  args: {
    position: "bottom-right",
    maxVisible: 5,
  },
  argTypes: {
    position: {
      control: "select",
      options: toastPositions,
    },
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

Temporary layered notification stack with optional semantic tone, description, action, and dismiss control. The newest toast stays fully visible while older surfaces offset and scale behind it. Mount one **Toaster** near the app root, then call **toast.add()** from event handlers.

| Pattern | Contract |
|---------|----------|
| **Status** | \`tone="success" | "info" | "warning" | "error"\` — icon via **Badge iconOnly** |
| **Action** | \`action={{ label, onClick, dismiss? }}\` — composed **Button** |
| **Placement** | Six \`position\` values: top/bottom × left/center/right |
| **Persistent** | \`duration: null\`; otherwise default auto-dismiss is 5000ms |

## Anatomy

- **Toaster** — one fixed portal viewport; placement and maximum visible layered deck
- **Toast item** — live-region shell with title and optional description
- **Status** — semantic **Badge iconOnly**
- **Action** — **Button** \`size="xs"\`
- **Dismiss** — **IconButton** \`size="xs"\`

## Best practices

- **Do** use concise, outcome-led titles.
- **Do** provide an action only when it is immediately useful, such as Undo or View.
- **Do** use \`error\` only for failures requiring attention; it announces assertively.
- **Don't** use Toast for blocking confirmation — use **AlertDialog**.
- **Don't** mount multiple Toasters for one application shell.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo({
  position,
  maxVisible,
}: {
  position: ToastPosition;
  maxVisible: number;
}) {
  useEffect(() => () => toast.dismiss(), []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        role="secondary"
        onClick={() =>
          toast.add({
            title: "Changes saved",
            description: "Your PitchKit has been updated.",
            tone: "success",
          })
        }
      >
        Show success
      </Button>
      <Button
        role="secondary"
        onClick={() => {
          toast.add({
            title: "Post hidden",
            description: "The post was removed from your shareable kit.",
            action: {
              label: "Undo",
              onClick: () =>
                toast.add({
                  title: "Post restored",
                  tone: "success",
                }),
            },
          });
        }}
      >
        Show action
      </Button>
      <Button
        role="secondary"
        onClick={() => {
          [
            ["Audience synced", "Latest Instagram insights are ready."],
            ["Share link copied", "The public URL is on your clipboard."],
            ["PitchKit published", "Your shareable creator profile is live."],
          ].forEach(([title, description], index) => {
            toast.add({
              title: title!,
              description,
              tone: index === 2 ? "success" : "info",
              duration: null,
            });
          });
        }}
      >
        Stack notifications
      </Button>
      <Toaster position={position} maxVisible={maxVisible} />
    </div>
  );
}

export const StackedNotifications: Story = {
  name: "Pattern — stacked notifications",
  parameters: storyCopySource(`
import { Button, Toaster, toast } from "@whatmatters/wmds";

export function App() {
  return (
    <>
      <Button
        onClick={() => {
          toast.add({
            title: "Post hidden",
            description: "The post was removed from your shareable kit.",
            action: {
              label: "Undo",
              onClick: (id) => {
                // Restore the hidden post in app state.
                toast.dismiss(id);
              },
              dismiss: false,
            },
          });
        }}
      >
        Hide post
      </Button>
      <Toaster position="bottom-right" maxVisible={5} />
    </>
  );
}
  `),
  render: (args) => (
    <ToastDemo
      position={args.position ?? "bottom-right"}
      maxVisible={args.maxVisible ?? 5}
    />
  ),
};

export const PlacementReference: Story = {
  name: "Reference — placement",
  args: {
    position: "top-center",
  },
  render: (args) => (
    <ToastDemo
      position={args.position ?? "top-center"}
      maxVisible={args.maxVisible ?? 5}
    />
  ),
};
