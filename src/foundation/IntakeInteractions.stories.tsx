import { MotionConfig } from "motion/react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/atoms/Button/Button";
import { ConfettiProvider } from "../components/organisms/Confetti/Confetti";
import { IntakeConfirmation } from "../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { IntakeModal } from "../components/organisms/IntakeModal/IntakeModal";
import {
  IntakeForm,
  intakeAboutEmpty,
  isIntakeAboutValid,
  type IntakeAboutValues,
} from "../components/molecules/IntakeForm/IntakeForm";

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
    expect(within(dialog).getByRole("button", { name: "Back" })).toHaveAttribute("aria-disabled", "true");

    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => {
      expect(close).toHaveFocus();
    });

    // Continue comes first in the footer and Back last (Buttons U8), so the trap wraps from Back.
    const backButton = within(dialog).getByRole("button", { name: "Back" });
    backButton.focus();
    await userEvent.tab();
    expect(close).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(backButton).toHaveFocus();

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

function AboutYouStep() {
  const [values, setValues] = useState<IntakeAboutValues>(intakeAboutEmpty);
  const [submitCount, setSubmitCount] = useState(0);
  return (
    <IntakeModal
      open
      onOpenChange={() => undefined}
      step={2}
      steps={4}
      onBack={() => undefined}
      onContinue={() => {
        if (!isIntakeAboutValid(values)) setSubmitCount((count) => count + 1);
      }}
    >
      <h2 className="type-heading-1 text-fg tracking-tight">About you</h2>
      <IntakeForm values={values} onChange={setValues} submitCount={submitCount} />
    </IntakeModal>
  );
}

export const ContinueShowsErrors: Story = {
  name: "Continue comes first, stays enabled, and shows errors on press (Buttons U6, U8; V5)",
  render: () => <AboutYouStep />,
  play: async () => {
    const dialog = await waitFor(() => portal().getByRole("dialog"));
    const footer = dialog.querySelector("footer") as HTMLElement;
    const [first, second] = [...footer.querySelectorAll("button")];
    await expect(first).toHaveAccessibleName("Continue");
    await expect(first).toBeEnabled();
    await expect(second).toHaveAccessibleName("Back");

    // Nothing filled: three errors, so the summary appears and takes focus.
    await userEvent.click(first);
    const summary = await waitFor(() => within(dialog).getByRole("heading", { name: "There's a problem" }));
    await waitFor(() => expect(summary.closest("[tabindex]")).toHaveFocus());
    await expect(within(dialog).getAllByRole("link")).toHaveLength(3);

    // Fill all but the email: one error, so focus goes straight to the email field.
    await userEvent.type(within(dialog).getByRole("textbox", { name: "Name" }), "Jordan Lee");
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "What should feel different when this work is done?" }),
      "A calmer site.",
    );
    await userEvent.click(first);
    await waitFor(() => expect(within(dialog).getByRole("textbox", { name: "Email" })).toHaveFocus());
    await expect(within(dialog).queryByRole("heading", { name: "There's a problem" })).toBeNull();
  },
};
