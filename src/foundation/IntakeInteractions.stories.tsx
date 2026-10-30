import { MotionConfig } from "motion/react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/atoms/Button/Button";
import { ConfettiProvider } from "../components/organisms/Confetti/Confetti";
import { IntakeConfirmation } from "../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { IntakeModal } from "../components/organisms/IntakeModal/IntakeModal";
import { SketchRequestFlow } from "../storybook/SketchRequest/SketchRequestFlow";
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
        steps={2}
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
    expect(within(dialog).getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 2");
    // Step 1 has nowhere to go back to, so there's no Back.
    expect(within(dialog).queryByRole("button", { name: "Back" })).toBeNull();

    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => {
      expect(close).toHaveFocus();
    });

    // On step 1 Continue is the footer's last control, so the trap wraps from it.
    const lastButton = within(dialog).getByRole("button", { name: "Continue" });
    lastButton.focus();
    await userEvent.tab();
    expect(close).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(lastButton).toHaveFocus();

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
      steps={2}
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

export const SketchRequestSteps: Story = {
  name: "sketch request: URL state, discard confirm, two steps, Back keeps answers, skip above the calendar (T7–T9)",
  render: () => <SketchRequestFlow failFirstSend />,
  play: async ({ canvas }) => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search.replace(/[?&]sketch\b/, ""));
    await userEvent.click(canvas.getByRole("button", { name: "Get a free sketch" }));
    const dialog = await waitFor(() => portal().getByRole("dialog"));
    await expect(new URLSearchParams(window.location.search).has("sketch")).toBe(true);
    await expect(within(dialog).getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 2");

    // Typed answers: Close asks first, and Keep editing returns to the form.
    const name = within(dialog).getByRole("textbox", { name: "Name" });
    await userEvent.type(name, "Maria Ortega");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    const confirm = await waitFor(() => within(dialog).getByRole("alertdialog", { name: "Discard your answers?" }));
    await waitFor(() => expect(within(confirm).getByRole("button", { name: "Keep editing" })).toHaveFocus());
    await userEvent.click(within(confirm).getByRole("button", { name: "Keep editing" }));
    await expect(within(dialog).queryByRole("alertdialog")).toBeNull();
    await expect(name).toHaveValue("Maria Ortega");

    // A failed send keeps the answers and says what to do.
    await userEvent.type(within(dialog).getByRole("textbox", { name: "Email" }), "maria@example.com");
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "What should feel different when this work is done?" }),
      "A new site before spring.",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Send my request" }));
    await waitFor(() => expect(within(dialog).getByRole("alert")).toHaveTextContent("We couldn’t send your request."));
    await expect(within(dialog).getByRole("alert")).toHaveAttribute("data-tone", "error");
    await expect(name).toHaveValue("Maria Ortega");

    // Second press goes through: Step 2 of 2, the skip before the calendar.
    await userEvent.click(within(dialog).getByRole("button", { name: "Send my request" }));
    await waitFor(() => expect(within(dialog).getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 2 of 2"));
    const skip = within(dialog).getByRole("link", { name: "Skip, just email me" });
    await expect(skip).toBeVisible();

    // Back keeps every answer.
    await userEvent.click(within(dialog).getByRole("button", { name: "Back" }));
    await expect(within(dialog).getByRole("textbox", { name: "Name" })).toHaveValue("Maria Ortega");
    await userEvent.click(within(dialog).getByRole("button", { name: "Send my request" }));
    await userEvent.click(await waitFor(() => within(dialog).getByRole("link", { name: "Skip, just email me" })));

    // Confirmation: what we got, when we reply, how to reach us.
    await waitFor(() => expect(within(dialog).getByText(/within one business day with a few times that fit\./)).toBeInTheDocument());
    await expect(within(dialog).getByText("A new site before spring.")).toBeInTheDocument();
    await expect(within(dialog).getByRole("link", { name: "hello@whatmatters.studio" })).toBeInTheDocument();

    // The honeypot is out of reach: hidden from assistive tech and the Tab order.
    const trap = document.querySelector("[data-intake-honeypot]");
    await expect(trap).toBeNull(); // gone with the details step

    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
    await waitFor(() => expect(portal().queryByRole("dialog")).toBeNull());
    await expect(new URLSearchParams(window.location.search).has("sketch")).toBe(false);
  },
};

export const HoneypotHidden: Story = {
  name: "IntakeHoneypot is hidden from screen readers and skipped by Tab (T4)",
  render: () => <SketchRequestFlow />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Get a free sketch" }));
    await waitFor(() => portal().getByRole("dialog"));
    const trap = document.querySelector("[data-intake-honeypot]") as HTMLElement;
    await expect(trap.getAttribute("aria-hidden")).toBe("true");
    const input = trap.querySelector("input") as HTMLInputElement;
    await expect(input.tabIndex).toBe(-1);
    await expect(input.autocomplete).toBe("off");
    await expect(trap.getBoundingClientRect().right).toBeLessThan(0);
    // Axe runs after play: let the modal finish fading in.
    await new Promise((resolve) => setTimeout(resolve, 800));
  },
};
