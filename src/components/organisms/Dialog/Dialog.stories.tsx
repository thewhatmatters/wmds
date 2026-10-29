import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { AlertDialog, alertDialogConfirmRoles } from "./AlertDialog";
import { Dialog, dialogSizes } from "./Dialog";
import { dialogFooterActionsClasses } from "./dialogStyles";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Dialog",
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
| **Typed confirmation** | \`AlertDialog\` + \`children\` (an **Input**) + \`confirmDisabled\` | \`children\` renders between the description and the actions, outside the description; the field's \`label\` takes markup |
| **Form in modal** | \`Dialog.Content\` + body children + footer actions | \`size="lg"\` for wider forms |
| **Detail view, media viewer** | \`Dialog.Content size="full"\` | The window less a margin (up to 90rem × 60rem); the whole screen on phones. \`headerEnd\` holds previous / next beside the close; \`aria-labelledby\` names it from a heading in the body. See **Guides/Resource detail** |

Shared overlay: portal to \`document.body\`, \`aria-modal\`, focus trap, scroll lock, **medium** enter/exit motion.

## Anatomy

\`\`\`
Dialog (open / onOpenChange)
└── Dialog.Content — Card shell (rounded-2xl shadow-md)
    ├── Card.Header — \`headerStart\` | title · \`headerEnd\` + optional IconButton close
    ├── body — 24px inset copy / form fields
    └── Card.Footer — Button action cluster

AlertDialog — same overlay + compact sm panel
├── title
├── description — \`<p>\`, the dialog's aria-describedby
├── children — optional body (an Input), outside the description
└── cancel/confirm Buttons
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
/** Stories that pass required props in their own JSX — args stay optional. */
type Story = StoryObj<typeof Dialog>;

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
import { Button, Dialog } from "@thewhatmatters/wmds";
import { dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function NotificationSettingsDialog() {
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
              <Input label="Email address" />
              <Input label="Role" />
            </div>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, Dialog, Input } from "@thewhatmatters/wmds";
import { dialogFooterActionsClasses } from "@thewhatmatters/wmds";

export function InviteDialog() {
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
            <Input label="Email address" />
            <Input label="Role" />
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
import { AlertDialog, Button } from "@thewhatmatters/wmds";

export function DeleteProjectAlert() {
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

function normalizeHandle(value: string): string {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export const AlertDialogTypedConfirmation: Story = {
  name: "Pattern — alert dialog (typed confirmation delete)",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "`children` sits between the description and the actions, outside the description `<p>` — `aria-describedby` still names the description alone. The **Input** `label` takes markup, so the handle can be bold. Delete stays off until the typed value matches the handle (a leading `@`, case, and surrounding spaces are ignored); Cancel keeps initial focus, and the field clears on reopen.",
        },
      },
    },
    `
import { useState } from "react";
import { AlertDialog, Button, Input } from "@thewhatmatters/wmds";

function normalizeHandle(value: string): string {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function DeleteAccountAlert({ handle }: { handle: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const matches = typed.trim() !== "" && normalizeHandle(typed) === normalizeHandle(handle);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTyped("");
    }
  }

  return (
    <>
      <Button role="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Delete this account?"
        description="This removes the account and everything it owns. You cannot undo this action."
        cancelLabel="Keep account"
        confirmLabel="Delete account"
        confirmRole="destructive"
        confirmDisabled={!matches}
        onConfirm={() => handleOpenChange(false)}
      >
        <Input
          label={
            <>
              Type <strong>{handle}</strong> to confirm
            </>
          }
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </AlertDialog>
    </>
  );
}
`,
  ),
  render: function AlertDialogTypedConfirmationPattern() {
    const handle = "@sarah-lee";
    const [open, setOpen] = useState(false);
    const [typed, setTyped] = useState("");
    const matches = typed.trim() !== "" && normalizeHandle(typed) === normalizeHandle(handle);

    function handleOpenChange(next: boolean) {
      setOpen(next);
      if (!next) {
        setTyped("");
      }
    }

    return (
      <>
        <Button role="destructive" onClick={() => setOpen(true)}>
          Delete account
        </Button>
        <AlertDialog
          open={open}
          onOpenChange={handleOpenChange}
          title="Delete this account?"
          description="This removes the account and everything it owns. You cannot undo this action."
          cancelLabel="Keep account"
          confirmLabel="Delete account"
          confirmRole="destructive"
          confirmDisabled={!matches}
          onConfirm={() => handleOpenChange(false)}
        >
          <Input
            label={
              <>
                Type <strong>{handle}</strong> to confirm
              </>
            }
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </AlertDialog>
      </>
    );
  },
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
