import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { AlertDialog } from "../components/organisms/Dialog/AlertDialog";
import { IntakeModal } from "../components/organisms/IntakeModal/IntakeModal";
import { Panel } from "../components/organisms/Panel/Panel";
import { Sheet } from "../components/organisms/Sheet/Sheet";
import { lockBodyScroll, useOverlayLifecycle, type OverlayLifecycleOptions } from "../lib/dialogOverlay";

/**
 * Browser interaction tests for **useOverlayLifecycle** (`lib/dialogOverlay`), the open → close lifecycle
 * Dialog, Sheet, IntakeModal and Panel share, and for each of those overlays through it.
 * Run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Overlay lifecycle",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const body = () => within(document.body);
const escape = () => userEvent.keyboard("{Escape}");

/** A bare overlay: a portaled panel with the lifecycle and nothing else. */
function Bare({
  label,
  open,
  onClose,
  children,
  ...options
}: Omit<OverlayLifecycleOptions, "open" | "onClose"> & {
  label: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlayLifecycle(panelRef, { open, onClose, ...options });
  if (!open) return null;
  return createPortal(
    <div ref={panelRef} role="dialog" aria-label={label}>
      <button type="button">{`${label} action`}</button>
      {children}
    </div>,
    document.body,
  );
}

function useToggle() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false) };
}

export const ModalLifecycle: Story = {
  name: "lifecycle — a modal locks scroll, makes the page inert, takes focus, and gives it back",
  render: function ModalLifecycleExample() {
    const overlay = useToggle();
    return (
      <>
        <Button onClick={overlay.show}>Open bare</Button>
        <Bare label="Bare" open={overlay.open} onClose={overlay.hide} />
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const opener = canvas.getByRole("button", { name: "Open bare" });
    await userEvent.click(opener);
    const panel = body().getByRole("dialog", { name: "Bare" });

    await waitFor(() => expect(within(panel).getByRole("button", { name: "Bare action" })).toHaveFocus());
    expect(document.body.style.overflow).toBe("hidden");
    expect(canvasElement.closest("[inert]")).not.toBeNull();

    await escape();
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Bare" })).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(canvasElement.closest("[inert]")).toBeNull();
  },
};

export const EscapeTopmostOnly: Story = {
  name: "lifecycle — Escape closes the topmost overlay only",
  render: function EscapeTopmostOnlyExample() {
    const outer = useToggle();
    const inner = useToggle();
    return (
      <>
        <Button onClick={outer.show}>Open outer</Button>
        <Bare label="Outer" open={outer.open} onClose={outer.hide}>
          <button type="button" onClick={inner.show}>
            Open inner
          </button>
        </Bare>
        <Bare label="Inner" open={inner.open} onClose={inner.hide} />
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open outer" }));
    const outer = body().getByRole("dialog", { name: "Outer" });
    const openInner = within(outer).getByRole("button", { name: "Open inner" });
    await userEvent.click(openInner);
    await waitFor(() => expect(body().getByRole("button", { name: "Inner action" })).toHaveFocus());

    await escape();
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Inner" })).not.toBeInTheDocument());
    expect(body().getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
    expect(openInner).toHaveFocus();

    await escape();
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Outer" })).not.toBeInTheDocument());
  },
};

export const EscapeHandledInside: Story = {
  name: "lifecycle — an Escape a control already handled is left alone",
  render: function EscapeHandledInsideExample() {
    const overlay = useToggle();
    return (
      <>
        <Button onClick={overlay.show}>Open with field</Button>
        <Bare label="Field overlay" open={overlay.open} onClose={overlay.hide}>
          <input
            aria-label="Search"
            onKeyDown={(event) => {
              if (event.key === "Escape") event.preventDefault();
            }}
          />
        </Bare>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open with field" }));
    await userEvent.click(body().getByRole("textbox", { name: "Search" }));
    await escape();
    expect(body().getByRole("dialog", { name: "Field overlay" })).toBeInTheDocument();

    await userEvent.click(body().getByRole("button", { name: "Field overlay action" }));
    await escape();
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Field overlay" })).not.toBeInTheDocument());
  },
};

export const EscapeBlockedByTopmost: Story = {
  name: "lifecycle — a topmost overlay that ignores Escape still shields the one beneath",
  render: function EscapeBlockedByTopmostExample() {
    const outer = useToggle();
    const inner = useToggle();
    return (
      <>
        <Button onClick={outer.show}>Open shielded</Button>
        <Bare label="Beneath" open={outer.open} onClose={outer.hide}>
          <button type="button" onClick={inner.show}>
            Open blocking
          </button>
        </Bare>
        <Bare label="Blocking" open={inner.open} onClose={inner.hide} closeOnEscape={false} />
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open shielded" }));
    await userEvent.click(body().getByRole("button", { name: "Open blocking" }));
    await waitFor(() => expect(body().getByRole("button", { name: "Blocking action" })).toHaveFocus());
    await escape();
    expect(body().getByRole("dialog", { name: "Blocking" })).toBeInTheDocument();
    expect(body().getByRole("dialog", { name: "Beneath" })).toBeInTheDocument();
  },
};

export const OpenerGone: Story = {
  name: "lifecycle — with the opener gone, focus goes to <main>",
  render: function OpenerGoneExample() {
    const overlay = useToggle();
    const [showOpener, setShowOpener] = useState(true);
    return (
      <main>
        {showOpener ? (
          <Button
            onClick={() => {
              overlay.show();
              setShowOpener(false);
            }}
          >
            Open once
          </Button>
        ) : null}
        <Bare label="Once" open={overlay.open} onClose={overlay.hide} />
      </main>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open once" }));
    await waitFor(() => expect(body().getByRole("button", { name: "Once action" })).toHaveFocus());
    await escape();
    await waitFor(() => expect(canvas.getByRole("main")).toHaveFocus());
  },
};

export const ScrollLockOutOfOrder: Story = {
  name: "lifecycle — stacked scroll locks release in any order",
  render: () => <p>Scroll lock</p>,
  play: async () => {
    const releaseLower = lockBodyScroll();
    const releaseUpper = lockBodyScroll();
    releaseLower();
    expect(document.body.style.overflow).toBe("hidden");
    releaseUpper();
    expect(document.body.style.overflow).toBe("");
    releaseUpper();
    expect(document.body.style.overflow).toBe("");
  },
};

export const SheetUnderAlertDialog: Story = {
  name: "Sheet + AlertDialog — Escape closes the AlertDialog, then the Sheet",
  render: function SheetUnderAlertDialogExample() {
    const sheet = useToggle();
    const alert = useToggle();
    return (
      <>
        <Button onClick={sheet.show}>Open sheet</Button>
        <Sheet open={sheet.open} onOpenChange={(next) => (next ? sheet.show() : sheet.hide())}>
          <Sheet.Content side="end" title="Project" description="Settings">
            <Button role="destructive" onClick={alert.show}>
              Delete project
            </Button>
          </Sheet.Content>
        </Sheet>
        <AlertDialog
          open={alert.open}
          onOpenChange={(next) => (next ? alert.show() : alert.hide())}
          title="Delete this project?"
          description="You cannot undo this."
          cancelLabel="Keep project"
          confirmLabel="Delete"
          confirmRole="destructive"
          dismissOnEscape
          onConfirm={alert.hide}
        />
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }));
    const del = await waitFor(() => body().getByRole("button", { name: "Delete project" }));
    await userEvent.click(del);
    await waitFor(() => expect(body().getByRole("alertdialog")).toBeInTheDocument());

    await escape();
    await waitFor(() => expect(body().queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(body().getByRole("dialog", { name: "Project" })).toBeInTheDocument();
    await waitFor(() => expect(del).toHaveFocus());

    await escape();
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Project" })).not.toBeInTheDocument());
    expect(canvas.getByRole("button", { name: "Open sheet" })).toHaveFocus();
  },
};

export const AlertDialogInertPage: Story = {
  name: "AlertDialog — the page behind is inert while open",
  render: function AlertDialogInertPageExample() {
    const alert = useToggle();
    return (
      <>
        <Button onClick={alert.show}>Open alert</Button>
        <AlertDialog
          open={alert.open}
          onOpenChange={(next) => (next ? alert.show() : alert.hide())}
          title="Leave without saving?"
          description="Your changes will be lost."
          cancelLabel="Stay"
          confirmLabel="Leave"
          onConfirm={alert.hide}
        />
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const opener = canvas.getByRole("button", { name: "Open alert" });
    await userEvent.click(opener);
    await waitFor(() => expect(body().getByRole("alertdialog")).toBeInTheDocument());
    expect(canvasElement.closest("[inert]")).not.toBeNull();

    await userEvent.click(body().getByRole("button", { name: "Stay" }));
    await waitFor(() => expect(body().queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(canvasElement.closest("[inert]")).toBeNull();
    expect(opener).toHaveFocus();
  },
};

export const IntakeModalEscapeOff: Story = {
  name: "IntakeModal — dismissOnEscape={false} keeps answers; Close still closes",
  render: function IntakeModalEscapeOffExample() {
    const intake = useToggle();
    return (
      <>
        <Button onClick={intake.show}>Start intake</Button>
        <IntakeModal
          open={intake.open}
          onOpenChange={(next) => (next ? intake.show() : intake.hide())}
          title="Start a project"
          step={1}
          steps={2}
          dismissOnEscape={false}
          onContinue={() => undefined}
        >
          <p>What do you need?</p>
        </IntakeModal>
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const opener = canvas.getByRole("button", { name: "Start intake" });
    await userEvent.click(opener);
    const dialog = await waitFor(() => body().getByRole("dialog", { name: "Start a project" }));
    expect(canvasElement.closest("[inert]")).not.toBeNull();
    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => expect(close).toHaveFocus());

    await escape();
    expect(body().getByRole("dialog", { name: "Start a project" })).toBeInTheDocument();

    await userEvent.click(close);
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Start a project" })).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
  },
};

export const PanelFocusAndEscape: Story = {
  name: "Panel — focus moves in on open; Escape closes it and returns focus",
  render: function PanelFocusAndEscapeExample() {
    const panel = useToggle();
    return (
      <>
        <Button onClick={panel.show}>Open details</Button>
        <Panel open={panel.open} onOpenChange={(next) => (next ? panel.show() : panel.hide())}>
          <Panel.Content title="Details" description="Page stays interactive.">
            <p>Detail copy.</p>
          </Panel.Content>
        </Panel>
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const opener = canvas.getByRole("button", { name: "Open details" });
    await userEvent.click(opener);
    const panel = await waitFor(() => body().getByRole("dialog", { name: "Details" }));
    await waitFor(() => expect(panel).toContainElement(document.activeElement as HTMLElement));
    expect(canvasElement.closest("[inert]")).toBeNull();
    expect(document.body.style.overflow).toBe("");

    await escape();
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Details" })).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
  },
};
