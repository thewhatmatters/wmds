import { MotionConfig } from "motion/react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/atoms/Button/Button";
import { ConfettiProvider } from "../components/organisms/Confetti/Confetti";
import { IntakeConfirmation } from "../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { IntakeModal } from "../components/organisms/IntakeModal/IntakeModal";

/**
 * Browser interaction tests — `npm run test:interactions`.
 * The modal portals to `document.body`.
 */
const meta = {
  title: "Internal/Interactions/Intake",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The IntakeModal shell from **Components/IntakeModal → Pattern — intake modal**, closed until the trigger is pressed. */
function IntakeShell() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button role="primary" type="button" onClick={() => setOpen(true)}>
        Start a project
      </Button>
      <IntakeModal
        open={open}
        onOpenChange={setOpen}
        step={1}
        steps={4}
        backDisabled
        onBack={() => undefined}
        onContinue={() => undefined}
      >
        <h2 className="type-heading-1 text-fg tracking-tight">What do you need?</h2>
      </IntakeModal>
    </>
  );
}

function portal() {
  return within(document.body);
}

function bursts(): NodeListOf<Element> {
  return document.querySelectorAll("[data-confetti-burst]");
}

function pieces(): NodeListOf<Element> {
  return document.querySelectorAll("[data-confetti-piece]");
}

export const Keyboard: Story = {
  name: "keyboard",
  render: () => <IntakeShell />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start a project" }));

    const dialog = await waitFor(() => portal().getByRole("dialog"));
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAccessibleName("Start a project");
    expect(within(dialog).getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 4");
    expect(within(dialog).getByRole("button", { name: "Back" })).toBeDisabled();

    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => {
      expect(close).toHaveFocus();
    });

    const continueButton = within(dialog).getByRole("button", { name: "Continue" });
    continueButton.focus();
    await userEvent.tab();
    expect(close).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(continueButton).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(portal().queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const ConfirmationMount: Story = {
  name: "confetti on confirmation mount",
  render: () => (
    <ConfettiProvider>
      <IntakeConfirmation variant="emailed" />
    </ConfettiProvider>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByRole("heading", { name: "We'll be in touch" })).toBeInTheDocument();
    await waitFor(() => {
      expect(bursts().length).toBe(1);
      expect(pieces().length).toBeGreaterThan(0);
    });
  },
};

export const ReducedMotion: Story = {
  name: "no confetti under reduced motion",
  render: () => (
    <MotionConfig reducedMotion="always">
      <ConfettiProvider>
        <IntakeConfirmation variant="booked" />
      </ConfettiProvider>
    </MotionConfig>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByRole("heading", { name: "You're booked" })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.querySelector("[data-confetti-layer]")).not.toBeNull();
    });
    expect(pieces().length).toBe(0);
    expect(bursts().length).toBe(0);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 200);
    });
    expect(pieces().length).toBe(0);
    expect(canvas.getByRole("heading", { name: "You're booked" })).toBeInTheDocument();
  },
};
