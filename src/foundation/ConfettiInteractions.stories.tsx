import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfettiProvider, useConfetti } from "../components/organisms/Confetti/Confetti";

/**
 * Browser interaction tests — `npm run test:interactions`.
 * Particles portal to `document.body`. Reduced motion: `fire()` adds nothing.
 */
const meta = {
  title: "Internal/Interactions/Confetti",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const burstOptions = {
  particleCount: 4,
  duration: 0.12,
  origin: { x: 120, y: 80 },
} as const;

function FireTwice() {
  const { fire } = useConfetti();
  return (
    <button
      type="button"
      onClick={() => {
        fire(burstOptions);
        fire(burstOptions);
      }}
    >
      Fire
    </button>
  );
}

function pieces(): NodeListOf<Element> {
  return document.querySelectorAll("[data-confetti-piece]");
}

function bursts(): NodeListOf<Element> {
  return document.querySelectorAll("[data-confetti-burst]");
}

export const FireAndCleanup: Story = {
  name: "fire and cleanup",
  render: () => (
    <ConfettiProvider>
      <FireTwice />
    </ConfettiProvider>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (!button) {
      throw new Error("Confetti fire button is missing");
    }

    button.click();

    await waitFor(() => {
      expect(pieces().length).toBe(8);
      expect(bursts().length).toBe(2);
    });

    const layer = document.querySelector("[data-confetti-layer]");
    expect(layer?.className).toContain("pointer-events-none");

    await waitFor(
      () => {
        expect(pieces().length).toBe(0);
        expect(bursts().length).toBe(0);
      },
      { timeout: 2500 },
    );
  },
};

export const ReducedMotion: Story = {
  name: "reduced motion",
  render: () => (
    <MotionConfig reducedMotion="always">
      <ConfettiProvider>
        <FireTwice />
      </ConfettiProvider>
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (!button) {
      throw new Error("Confetti fire button is missing");
    }

    button.click();

    await waitFor(() => {
      expect(document.querySelector("[data-confetti-layer]")).not.toBeNull();
    });
    expect(pieces().length).toBe(0);
    expect(bursts().length).toBe(0);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 200);
    });
    expect(pieces().length).toBe(0);
  },
};
