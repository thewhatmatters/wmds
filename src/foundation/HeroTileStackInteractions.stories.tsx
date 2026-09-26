import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroTileStack } from "../components/organisms/HeroTileStack/HeroTileStack";
import {
  heroTileRepel,
  heroTileStackDefaultStrength,
} from "../components/organisms/HeroTileStack/heroTileScatter";

/**
 * Browser interaction tests — `npm run test:storybook`.
 * Scatter values are the springs that drive each card's x / y / rotate.
 */
const meta = {
  title: "Internal/Interactions/HeroTileStack",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const tiles = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
] as const;

const stiffSpring = { stiffness: 700, damping: 60, mass: 0.4 };

function StackFixture() {
  return (
    <HeroTileStack tiles={[...tiles]} strength={heroTileStackDefaultStrength} spring={stiffSpring} />
  );
}

function rowOf(root: HTMLElement): HTMLElement {
  const row = root.querySelector<HTMLElement>("[data-hero-tile-row]");
  if (!row) throw new Error("Hero tile row is missing");
  return row;
}

function surfacesOf(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("[data-hero-tile]")];
}

function readScatter(tile: HTMLElement): { x: number; y: number; rotate: number } {
  return {
    x: Number(tile.getAttribute("data-scatter-x")),
    y: Number(tile.getAttribute("data-scatter-y")),
    rotate: Number(tile.getAttribute("data-scatter-rotate")),
  };
}

function pointerAt(row: HTMLElement, clientX: number, clientY: number, type: "pointermove" | "pointerleave") {
  // React listens for pointerout (bubbling) and synthesizes onPointerLeave.
  // A native pointerleave does not bubble, so it never reaches that listener.
  const nativeType = type === "pointerleave" ? "pointerout" : type;
  row.dispatchEvent(
    new PointerEvent(nativeType, {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX,
      clientY,
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      relatedTarget: type === "pointerleave" ? document.body : null,
    }),
  );
}

function expectedFromGeometry(root: HTMLElement, clientX: number, clientY: number) {
  const row = rowOf(root);
  const rowBox = row.getBoundingClientRect();
  const slots = [...root.querySelectorAll<HTMLElement>("[data-hero-tile-slot]")];
  const surfaces = surfacesOf(root);
  return slots.map((slot, index) => {
    const box = slot.getBoundingClientRect();
    const repel = heroTileRepel({
      pointerX: clientX - rowBox.left,
      pointerY: clientY - rowBox.top,
      centerX: box.left + box.width / 2 - rowBox.left,
      centerY: box.top + box.height / 2 - rowBox.top,
      strength: heroTileStackDefaultStrength,
    });
    const surface = surfaces[index];
    if (!surface) throw new Error(`Hero tile surface ${index} is missing`);
    return { repel, surface };
  });
}

export const PointerScatter: Story = {
  name: "pointer scatter",
  render: () => (
    <MotionConfig reducedMotion="never">
      <StackFixture />
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(surfacesOf(canvasElement)).toHaveLength(4);
      const slot = canvasElement.querySelector<HTMLElement>("[data-hero-tile-slot]");
      expect(slot?.getBoundingClientRect().width ?? 0).toBeGreaterThan(40);
    });

    for (const image of canvasElement.querySelectorAll("img")) {
      expect(image.getAttribute("alt")?.length ?? 0).toBeGreaterThan(0);
    }

    const row = rowOf(canvasElement);
    const box = row.getBoundingClientRect();
    const clientX = box.left + box.width / 2;
    const clientY = box.top + box.height / 2;
    pointerAt(row, clientX, clientY, "pointermove");

    await waitFor(
      () => {
        const pairs = expectedFromGeometry(canvasElement, clientX, clientY);
        const moved = pairs.filter((pair) => Math.abs(pair.repel.x) > 40 || Math.abs(pair.repel.y) > 40);
        expect(moved.length).toBeGreaterThan(1);
        for (const pair of moved) {
          const actual = readScatter(pair.surface);
          if (Math.abs(pair.repel.x) > 40) {
            expect(Math.sign(actual.x)).toBe(Math.sign(pair.repel.x));
            expect(Math.abs(actual.x)).toBeGreaterThan(Math.abs(pair.repel.x) * 0.7);
          }
          if (Math.abs(pair.repel.y) > 40) {
            expect(Math.sign(actual.y)).toBe(Math.sign(pair.repel.y));
          }
          expect(getComputedStyle(pair.surface).transform).not.toBe("none");
        }
      },
      { timeout: 2500 },
    );

    pointerAt(row, clientX, clientY + box.height, "pointerleave");

    await waitFor(
      () => {
        for (const surface of surfacesOf(canvasElement)) {
          const actual = readScatter(surface);
          expect(Math.abs(actual.x)).toBeLessThan(4);
          expect(Math.abs(actual.y)).toBeLessThan(4);
        }
      },
      { timeout: 2500 },
    );
  },
};

export const ReducedMotion: Story = {
  name: "reduced motion",
  render: () => (
    <MotionConfig reducedMotion="always">
      <StackFixture />
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(surfacesOf(canvasElement)).toHaveLength(4);
    });

    const row = rowOf(canvasElement);
    const box = row.getBoundingClientRect();
    pointerAt(row, box.left + box.width / 2, box.top + box.height / 2, "pointermove");

    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });

    const resting = [2, -3, 6, -2];
    surfacesOf(canvasElement).forEach((surface, index) => {
      const actual = readScatter(surface);
      expect(actual.x).toBe(0);
      expect(actual.y).toBe(0);
      expect(actual.rotate).toBe(resting[index]);
    });
  },
};
