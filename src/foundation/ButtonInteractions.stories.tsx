import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy } from "lucide-react";
import { expect, spyOn, userEvent, waitFor } from "storybook/test";
import { Button, buttonStatusHoldMs, type ButtonStatus } from "../components/atoms/Button/Button";

/**
 * Browser interaction tests for **Button** `status` with `icon` (the copy pattern) and `external` —
 * run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Button",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Button
      role="secondary"
      size="sm"
      icon={<Copy data-testid="copy-glyph" />}
      status={status}
      statusLabels={{ success: "Copied", error: "Couldn't copy" }}
      onClick={copy}
    >
      Copy for LLM
    </Button>
  );
}

/** The label spans are fully faded in — no morph in flight for the accessibility scan to catch. */
function expectLabelSettled(button: HTMLElement) {
  for (const label of button.querySelectorAll<HTMLElement>("span.inline-block")) {
    expect(getComputedStyle(label).opacity).toBe("1");
  }
}

export const CopyConfirms: Story = {
  name: "a copy button keeps its icon, confirms, and returns",
  render: () => <CopyButton text="# Post" />,
  play: async ({ canvas, canvasElement }) => {
    const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    try {
      const button = canvas.getByRole("button", { name: "Copy for LLM" });
      expect(button).toHaveAttribute("aria-live", "polite");
      expect(canvasElement.querySelector("[data-testid='copy-glyph']")).not.toBeNull();

      await userEvent.click(button);
      expect(writeText).toHaveBeenCalledWith("# Post");
      await waitFor(() => {
        expect(button).toHaveAttribute("data-status", "success");
        expect(button).toHaveTextContent("Copied");
      });
      // The Copy glyph has morphed into the check.
      await waitFor(() => {
        expect(canvasElement.querySelector("[data-testid='copy-glyph']")).toBeNull();
      });

      await waitFor(
        () => {
          expect(button).toHaveAttribute("data-status", "idle");
          expect(button).toHaveTextContent("Copy for LLM");
          expect(canvasElement.querySelector("[data-testid='copy-glyph']")).not.toBeNull();
          expectLabelSettled(button);
        },
        { timeout: buttonStatusHoldMs + 3000 },
      );
    } finally {
      writeText.mockRestore();
    }
  },
};

export const CopyFails: Story = {
  name: "a refused clipboard says so",
  render: () => <CopyButton text="# Post" />,
  play: async ({ canvas }) => {
    const writeText = spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    try {
      const button = canvas.getByRole("button", { name: "Copy for LLM" });
      await userEvent.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute("data-status", "error");
        expect(button).toHaveTextContent("Couldn't copy");
      });
      // Settle back to idle before the accessibility scan.
      await waitFor(
        () => {
          expect(button).toHaveAttribute("data-status", "idle");
          expect(button.textContent).toBe("Copy for LLM");
          expectLabelSettled(button);
        },
        { timeout: buttonStatusHoldMs + 3000 },
      );
    } finally {
      writeText.mockRestore();
    }
  },
};

export const ExternalLink: Story = {
  name: "an external link button opens a new tab and says so",
  render: () => (
    <div className="flex gap-2">
      <Button role="secondary" size="sm" external render={<a href="https://www.linkedin.com/" />}>
        LinkedIn
      </Button>
      <Button role="secondary" size="sm" external externalIcon={false} render={<a href="https://x.com/" />}>
        Twitter/X
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const linkedin = canvas.getByRole("link", { name: "LinkedIn (opens in a new tab)" });
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkedin.querySelector("svg")).not.toBeNull();

    const x = canvas.getByRole("link", { name: "Twitter/X (opens in a new tab)" });
    expect(x).toHaveAttribute("target", "_blank");
    expect(x.querySelector("svg")).toBeNull();
  },
};
