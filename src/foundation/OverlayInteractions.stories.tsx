import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { AlertDialog } from "../components/organisms/Dialog/AlertDialog";
import { Dialog } from "../components/organisms/Dialog/Dialog";
import { Sheet } from "../components/organisms/Sheet/Sheet";
import { Panel } from "../components/organisms/Panel/Panel";

/**
 * Browser interaction tests for overlay primitives — run via `npm run test:interactions`.
 * Portals render to `document.body`; queries use `within(document.body)` after open.
 */
const meta = {
  title: "Foundation/Overlay interactions",
  tags: ["test", "!autodocs"],
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
