import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { Input } from "../components/atoms/Input/Input";
import { AlertDialog } from "../components/organisms/Dialog/AlertDialog";
import { Dialog } from "../components/organisms/Dialog/Dialog";
import { Sheet } from "../components/organisms/Sheet/Sheet";
import { Panel } from "../components/organisms/Panel/Panel";
import { useSheetParam } from "../lib/sheetParam/useSheetParam";
import { withSheetParam } from "../lib/sheetParam/sheetParam";

/**
 * Browser interaction tests for overlay primitives — run via `npm run test:interactions`.
 * Portals render to `document.body`; queries use `within(document.body)` after open.
 */
const meta = {
  title: "Internal/Interactions/Overlay",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function queryPortal() {
  return within(document.body);
}

export const DialogDismiss: Story = {
  name: "Dialog — open and close",
  render: function DialogDismissExample() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button role="primary" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content title="Notification settings" description="Choose how WhatMatters reaches you.">
            <p className="text-muted">Email digests can be configured in preferences.</p>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));

    await waitFor(() => {
      expect(queryPortal().getByRole("dialog")).toBeInTheDocument();
    });

    const dialog = queryPortal().getByRole("dialog");
    await expect(dialog).toHaveAccessibleName(/notification settings/i);

    await userEvent.click(queryPortal().getByRole("button", { name: /close dialog/i }));

    await waitFor(() => {
      expect(queryPortal().queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const AlertDialogBlocking: Story = {
  name: "AlertDialog — confirm and cancel",
  render: function AlertDialogBlockingExample() {
    const [open, setOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    return (
      <>
        <Button role="destructive" onClick={() => setOpen(true)}>
          Open delete confirm
        </Button>
        {confirmed ? <p data-testid="confirmed">Deleted</p> : null}
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete this project?"
          description="This removes all tasks and history. You cannot undo this action."
          cancelLabel="Keep project"
          confirmLabel="Delete project"
          confirmRole="destructive"
          dismissOnBackdrop={false}
          onConfirm={() => {
            setConfirmed(true);
            setOpen(false);
          }}
        />
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /open delete confirm/i }));

    await waitFor(() => {
      expect(queryPortal().getByRole("alertdialog")).toBeInTheDocument();
    });

    await userEvent.click(queryPortal().getByRole("button", { name: /keep project/i }));

    await waitFor(() => {
      expect(queryPortal().queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(canvas.queryByTestId("confirmed")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /open delete confirm/i }));
    await waitFor(() => {
      expect(queryPortal().getByRole("alertdialog")).toBeInTheDocument();
    });

    // A press on the scrim neither closes it nor moves focus out of it.
    const alert = queryPortal().getByRole("alertdialog");
    await waitFor(() => expect(alert).toContainElement(document.activeElement as HTMLElement));
    await userEvent.pointer({ keys: "[MouseLeft]", target: alert.parentElement as HTMLElement, coords: { clientX: 4, clientY: 4 } });
    expect(queryPortal().getByRole("alertdialog")).toBeInTheDocument();
    expect(alert).toContainElement(document.activeElement as HTMLElement);

    await userEvent.click(queryPortal().getByRole("button", { name: /^delete project$/i }));

    await waitFor(() => {
      expect(canvas.getByTestId("confirmed")).toBeInTheDocument();
    });
  },
};

export const SheetEscapeDismiss: Story = {
  name: "Sheet — escape dismiss",
  render: function SheetEscapeDismissExample() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Open sheet
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content title="Filters" description="Refine the occupancy view.">
            <p className="text-muted">Filter controls go here.</p>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /open sheet/i }));

    await waitFor(() => {
      expect(queryPortal().getByRole("dialog")).toBeInTheDocument();
    });

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(queryPortal().queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const PanelNonModal: Story = {
  name: "Panel — non-modal flyover",
  render: function PanelNonModalExample() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button role="secondary" onClick={() => setOpen(true)}>
          Open panel
        </Button>
        <Button role="primary">Page action</Button>
        <Panel open={open} onOpenChange={setOpen}>
          <Panel.Content title="Detail rail" description="Page stays interactive.">
            <p className="text-muted">Detail copy goes here.</p>
          </Panel.Content>
        </Panel>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /open panel/i }));

    await waitFor(() => {
      const panel = queryPortal().getByRole("dialog");
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveAttribute("aria-modal", "false");
    });

    await userEvent.click(canvas.getByRole("button", { name: /page action/i }));
    expect(canvas.getByRole("button", { name: /page action/i })).toHaveFocus();
  },
};

/**
 * Known accessibility violations — listed in docs/audits/2026-10-03.md.
 * Checks fail on every other story. These report without failing until the component is fixed.
 * Remove a story from this list when it passes.
 */
for (const story of [AlertDialogBlocking, PanelNonModal]) {
  story.parameters = { ...story.parameters, a11y: { test: "todo" } };
}

function UrlSheetExample() {
  const { open, id, onOpenChange } = useSheetParam("approval");
  return (
    <main>
      <Button role="primary" onClick={() => onOpenChange(true, "maya-chen")}>
        Review Maya Chen
      </Button>
      <Sheet open={open} onOpenChange={(next) => onOpenChange(next)}>
        <Sheet.Content side="end" title={`Approval ${id ?? ""}`} description="Creator application">
          <p className="text-muted">Detail.</p>
        </Sheet.Content>
      </Sheet>
    </main>
  );
}

function resetUrl() {
  window.history.replaceState(null, "", withSheetParam(window.location.href, null, "approval"));
}

export const SideSheetOpenByUrl: Story = {
  name: "Side sheet — opens from the URL, focus goes to main on close",
  beforeEach: () => {
    window.history.replaceState(
      null,
      "",
      withSheetParam(window.location.href, "maya-chen", "approval"),
    );
    return resetUrl;
  },
  render: function SideSheetOpenByUrlExample() {
    return <UrlSheetExample />;
  },
  play: async () => {
    await waitFor(() => {
      expect(queryPortal().getByRole("dialog")).toBeInTheDocument();
    });
    await expect(queryPortal().getByRole("dialog")).toHaveAccessibleName(/maya-chen/i);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(queryPortal().queryByRole("dialog")).not.toBeInTheDocument();
    });
    await expect(window.location.search).not.toContain("sheet=");
    await waitFor(() => {
      expect(document.querySelector("main")).toHaveFocus();
    });
  },
};

export const SideSheetScrimAndFocus: Story = {
  name: "Side sheet — scrim closes, focus returns, page is inert",
  beforeEach: () => resetUrl,
  render: function SideSheetScrimAndFocusExample() {
    return <UrlSheetExample />;
  },
  play: async ({ canvas }) => {
    const opener = canvas.getByRole("button", { name: /review maya chen/i });
    await userEvent.click(opener);
    await waitFor(() => {
      expect(queryPortal().getByRole("dialog")).toBeInTheDocument();
    });
    await expect(window.location.search).toContain("sheet=approval");
    await expect(opener.closest("[inert]")).not.toBeNull();

    const dialog = queryPortal().getByRole("dialog");
    await userEvent.pointer({ keys: "[MouseLeft]", target: dialog.parentElement as HTMLElement, coords: { clientX: 4, clientY: 4 } });
    await waitFor(() => {
      expect(queryPortal().queryByRole("dialog")).not.toBeInTheDocument();
    });
    await expect(opener).toHaveFocus();
    await expect(opener.closest("[inert]")).toBeNull();
  },
};

export const SideSheetPopstateCloses: Story = {
  name: "Side sheet — Back closes",
  beforeEach: () => resetUrl,
  render: function SideSheetPopstateClosesExample() {
    return <UrlSheetExample />;
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /review maya chen/i }));
    await waitFor(() => {
      expect(queryPortal().getByRole("dialog")).toBeInTheDocument();
    });
    window.history.back();
    await waitFor(() => {
      expect(queryPortal().queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const AlertDialogTypedConfirmation: Story = {
  name: "AlertDialog — typed confirmation",
  render: function AlertDialogTypedConfirmationExample() {
    const handle = "@sarah-lee";
    const [open, setOpen] = useState(false);
    const [typed, setTyped] = useState("");
    const [deleted, setDeleted] = useState(false);
    const normalize = (value: string) => value.trim().replace(/^@/, "").toLowerCase();
    const matches = typed.trim() !== "" && normalize(typed) === normalize(handle);

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
        {deleted ? <p data-testid="deleted">Deleted</p> : null}
        <AlertDialog
          open={open}
          onOpenChange={handleOpenChange}
          title="Delete this account?"
          description="This removes the account and everything it owns."
          cancelLabel="Keep account"
          confirmLabel="Delete account"
          confirmRole="destructive"
          confirmDisabled={!matches}
          onConfirm={() => {
            setDeleted(true);
            handleOpenChange(false);
          }}
        >
          <Input
            label={
              <>
                Type <strong>{handle}</strong> to confirm
              </>
            }
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        </AlertDialog>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^delete account$/i }));

    await waitFor(() => {
      expect(queryPortal().getByRole("alertdialog")).toBeInTheDocument();
    });
    const dialog = queryPortal().getByRole("alertdialog");

    // Cancel is focused on open.
    await waitFor(() => {
      expect(queryPortal().getByRole("button", { name: /keep account/i })).toHaveFocus();
    });

    // The field is named by the rich label; the description alone describes the dialog.
    const field = queryPortal().getByRole("textbox", { name: "Type @sarah-lee to confirm" });
    await expect(dialog).toHaveAccessibleDescription("This removes the account and everything it owns.");
    await expect(dialog.querySelector(`#${CSS.escape(dialog.getAttribute("aria-describedby") ?? "")}`)).not.toContainElement(field);

    const confirm = within(dialog).getByRole("button", { name: /^delete account$/i });
    await expect(confirm).toHaveAttribute("aria-disabled", "true");

    // Partial and wrong values keep it off.
    await userEvent.type(field, "@sarah");
    await expect(confirm).toHaveAttribute("aria-disabled", "true");
    await userEvent.clear(field);
    await userEvent.type(field, "@someone-else");
    await expect(confirm).toHaveAttribute("aria-disabled", "true");

    // Leading @, case, and surrounding spaces are ignored.
    await userEvent.clear(field);
    await userEvent.type(field, "  SARAH-Lee ");
    await waitFor(() => {
      expect(confirm).not.toHaveAttribute("aria-disabled");
    });

    // Cancel, reopen — the field is empty and the button is off again.
    await userEvent.click(queryPortal().getByRole("button", { name: /keep account/i }));
    await waitFor(() => {
      expect(queryPortal().queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    await userEvent.click(canvas.getByRole("button", { name: /^delete account$/i }));
    await waitFor(() => {
      expect(queryPortal().getByRole("alertdialog")).toBeInTheDocument();
    });
    const reopened = queryPortal().getByRole("textbox", { name: "Type @sarah-lee to confirm" });
    await expect(reopened).toHaveValue("");
    await expect(within(queryPortal().getByRole("alertdialog")).getByRole("button", { name: /^delete account$/i })).toHaveAttribute("aria-disabled", "true");

    // A matching value confirms.
    await userEvent.type(reopened, "@sarah-lee");
    const confirmAgain = within(queryPortal().getByRole("alertdialog")).getByRole("button", { name: /^delete account$/i });
    await waitFor(() => {
      expect(confirmAgain).not.toHaveAttribute("aria-disabled");
    });
    await userEvent.click(confirmAgain);
    await waitFor(() => {
      expect(canvas.getByTestId("deleted")).toBeInTheDocument();
      expect(queryPortal().queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  },
};
