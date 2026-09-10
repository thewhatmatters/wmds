import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { AlertDialog, alertDialogConfirmRoles } from "./AlertDialog";
import { Dialog, dialogSizes } from "./Dialog";
import { dialogFooterActionsClasses } from "./dialogStyles";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Overlays/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    dismissOnBackdrop: { control: "boolean" },
    dismissOnEscape: { control: "boolean" },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Modal overlay system — **Dialog** for general modals, **AlertDialog** for blocking confirms.

| Pattern | Component | Notes |
|---------|-----------|--------|
| **General modal** | \`Dialog\` + \`Dialog.Content\` | Card shell, optional close, scrim dismiss |
| **Blocking confirm** | \`AlertDialog\` | Cancel + confirm footer; scrim dismiss off by default |
| **Destructive confirm** | \`AlertDialog confirmRole="destructive"\` | Irreversible actions |
| **Form in modal** | \`Dialog.Content\` + body children + footer actions | \`size="lg"\` for wider forms |

Shared overlay: portal to \`document.body\`, \`aria-modal\`, focus trap, scroll lock, **medium** enter/exit motion.

## Anatomy

\`\`\`
Dialog (open / onOpenChange)
└── Dialog.Content — Card shell (rounded-2xl shadow-md)
    ├── Card.Header — \`headerStart\` | title + optional IconButton close
    ├── body — 16px inset copy / form fields
    └── Card.Footer — Button action cluster

AlertDialog — same overlay + compact sm panel + cancel/confirm Buttons
\`\`\`

## Best practices

- **Do** use **AlertDialog** for irreversible or high-stakes confirms — not a generic **Dialog** with two buttons.
- **Do** compose footer actions from **Button** \`role="secondary"\` + \`primary\` / \`destructive\`.
- **Do** keep \`dismissOnBackdrop={false}\` on blocking alerts — users must choose an action.
- **Don't** hand-roll portal/scrim/focus — use **Dialog** / **AlertDialog**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDialog: Story = {
  name: "Pattern — dialog",
  render: function DefaultDialogPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="primary" onClick={() => setOpen(true)}>
          Open settings
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content
            title="Notification settings"
            description="Choose how WhatMatters reaches you."
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Save
                </Button>
              </div>
            }
          >
            <p className="text-muted">
              Email digests and push alerts can be configured in your account preferences.
            </p>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, Dialog } from "@whatmatters/wmds";
import { dialogFooterActionsClasses } from "@whatmatters/wmds";

function NotificationSettingsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content
          title="Notification settings"
          description="Choose how WhatMatters reaches you."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </div>
          }
        >
          <p className="text-muted">
            Email digests and push alerts can be configured in your account preferences.
          </p>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
`),
};

export const FormDialog: Story = {
  name: "Pattern — form dialog",
  render: function FormDialogPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Invite teammate
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content
            size="lg"
            title="Invite teammate"
            description="Send an email invite to join this workspace."
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Send invite
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4 pb-2">
              <Input label="Email address" placeholder="name@company.com" />
              <Input label="Role" placeholder="Editor" />
            </div>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, Dialog, Input } from "@whatmatters/wmds";
import { dialogFooterActionsClasses } from "@whatmatters/wmds";

function InviteDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="secondary" onClick={() => setOpen(true)}>
        Invite teammate
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content
          size="lg"
          title="Invite teammate"
          description="Send an email invite to join this workspace."
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                Send invite
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 pb-2">
            <Input label="Email address" placeholder="name@company.com" />
            <Input label="Role" placeholder="Editor" />
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
`),
};

export const FormDialogScroll: Story = {
  name: "Pattern — scroll (header/footer pinned)",
  parameters: { docs: { disable: true } },
  render: function FormDialogScrollPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Invite many teammates
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content
            size="lg"
            title="Invite teammates"
            description="Header and footer stay visible — only the body scrolls."
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" role="primary" onClick={() => setOpen(false)}>
                  Send invites
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4 pb-2">
              {Array.from({ length: 20 }, (_, index) => (
                <Input
                  key={index}
                  label={`Email ${index + 1}`}
                  placeholder="name@company.com"
                />
              ))}
            </div>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
};

export const AlertDialogDestructive: Story = {
  name: "Pattern — alert dialog (destructive)",
  render: function AlertDialogDestructivePattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="destructive" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete this project?"
          description="This removes all tasks and history. You cannot undo this action."
          cancelLabel="Keep project"
          confirmLabel="Delete project"
          confirmRole="destructive"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { AlertDialog, Button } from "@whatmatters/wmds";

function DeleteProjectAlert() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this project?"
        description="This removes all tasks and history. You cannot undo this action."
        cancelLabel="Keep project"
        confirmLabel="Delete project"
        confirmRole="destructive"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
`),
};

export const AlertDialogPrimary: Story = {
  name: "Pattern — alert dialog (primary)",
  render: function AlertDialogPrimaryPattern() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button role="primary" onClick={() => setOpen(true)}>
          Publish changes
        </Button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Publish updates?"
          description="Residents will see the new occupancy thresholds immediately."
          confirmLabel="Publish"
          confirmRole="primary"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const DialogSizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: { disable: true },
  },
  render: function DialogSizesReference() {
    return (
      <ul className="type-body flex flex-col gap-2 text-muted">
        {dialogSizes.map((size) => (
          <li key={size}>
            <code>{size}</code> — max width token in <code>dialogPanelSizeClasses</code>
          </li>
        ))}
      </ul>
    );
  },
};

export const AlertDialogConfirmRoles: Story = {
  name: "Reference — confirm roles",
  parameters: {
    docs: { disable: true },
  },
  render: function AlertDialogRolesReference() {
    return (
      <ul className="type-body flex flex-col gap-2 text-muted">
        {alertDialogConfirmRoles.map((role) => (
          <li key={role}>
            <code>confirmRole="{role}"</code>
          </li>
        ))}
      </ul>
    );
  },
};
