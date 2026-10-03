import { MotionConfig } from "motion/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfettiProvider } from "../components/organisms/Confetti/Confetti";
import { IntakeConfirmation } from "../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { StartAProject } from "../sites/WhatMatters/Intake/IntakePattern";

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
  render: () => <StartAProject initialOpen={false} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start a project" }));

    const dialog = await waitFor(() => portal().getByRole("dialog"));
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAccessibleName("Start a project");

    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => {
      expect(close).toHaveFocus();
    });

    const other = within(dialog).getByRole("checkbox", { name: "Other" });
    other.focus();
    await userEvent.tab();
    expect(close).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(other).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(portal().queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const SelectionAndContinue: Story = {
  name: "selection and continue",
  render: () => <StartAProject />,
  play: async () => {
    const dialog = await waitFor(() => portal().getByRole("dialog"));
    const continueButton = within(dialog).getByRole("button", { name: "Continue" });
    expect(continueButton).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "Back" })).toBeDisabled();
    expect(within(dialog).getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 4");

    const brand = within(dialog).getByRole("checkbox", { name: "Brand identity" });
    brand.focus();
    expect(brand).toHaveFocus();
    await userEvent.click(brand);
    expect(brand).toBeChecked();
    expect(continueButton).toBeEnabled();

    await userEvent.click(continueButton);
    await waitFor(() => {
      expect(within(dialog).getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 2 of 4");
    });
    expect(continueButton).toBeDisabled();

    const underTen = within(dialog).getByRole("radio", { name: "<$10k" });
    underTen.focus();
    await userEvent.keyboard("{ArrowRight}");
    const ten = within(dialog).getByRole("radio", { name: "$10–25k" });
    expect(ten).toBeChecked();
    expect(continueButton).toBeEnabled();

    const unsure = within(dialog).getByRole("radio", { name: "Not sure yet" });
    expect(unsure.closest("label")).toHaveAttribute("data-emphasis", "muted");

    await userEvent.click(continueButton);
    await waitFor(() => {
      expect(within(dialog).getByRole("heading", { name: "About you" })).toBeInTheDocument();
    });
    expect(continueButton).toBeDisabled();

    await userEvent.type(within(dialog).getByRole("textbox", { name: "Name" }), "Jordan Lee");
    await userEvent.type(within(dialog).getByRole("textbox", { name: "Email" }), "jordan@northwind.com");
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: "Project details" }),
      "A calmer brief.",
    );
    expect(within(dialog).getByText("15 / 400")).toBeInTheDocument();
    expect(continueButton).toBeEnabled();

    await userEvent.click(continueButton);
    await waitFor(() => {
      expect(within(dialog).getByRole("heading", { name: "Book a call" })).toBeInTheDocument();
    });
    expect(within(dialog).queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Back" })).toBeEnabled();
    expect(bursts().length).toBe(0);

    await userEvent.click(within(dialog).getByRole("button", { name: "Confirm this time" }));
    await waitFor(() => {
      expect(within(dialog).getByRole("heading", { name: "You're booked" })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(bursts().length).toBe(1);
      expect(pieces().length).toBeGreaterThan(0);
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
