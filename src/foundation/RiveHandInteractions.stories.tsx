import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RiveHand } from "../components/atoms/RiveHand/RiveHand";

/**
 * Browser interaction tests — `npm run test:interactions`.
 * The point hand grows from scale 0. Its canvas must still rasterize at layout size.
 */
const meta = {
  title: "Internal/Interactions/RiveHand",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function PointGrowFixture() {
  return (
    <MotionConfig reducedMotion="never">
      <div data-point-hand-scale="" style={{ fontSize: 48, padding: 48 }}>
        <span style={{ position: "relative", display: "inline-block" }}>
          s
          <RiveHand hand="point" size="2em" entrance="grow" idle={false} />
        </span>
      </div>
    </MotionConfig>
  );
}

function findHandCanvas(root: ParentNode): HTMLCanvasElement | null {
  const direct = root.querySelector("canvas");
  if (direct) return direct;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const nested = findHandCanvas(el.shadowRoot);
      if (nested) return nested;
    }
  }
  return null;
}

function handHasInk(canvas: HTMLCanvasElement): boolean {
  if (canvas.width < 2 || canvas.height < 2) return false;
  if (canvas.clientWidth < 2 || canvas.width < canvas.clientWidth) return false;
  const context = canvas.getContext("2d");
  if (!context) return false;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index] ?? 0;
    const green = pixels[index + 1] ?? 0;
    const blue = pixels[index + 2] ?? 0;
    const alpha = pixels[index + 3] ?? 0;
    if (red + green + blue + alpha > 0) return true;
  }
  return false;
}

function OffscreenPointGrow() {
  return (
    <MotionConfig reducedMotion="never">
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: "140vh" }} />
        <div data-offscreen-point="" style={{ fontSize: 48, padding: 48 }}>
          <span style={{ position: "relative", display: "inline-block" }}>
            s
            <RiveHand hand="point" size="2em" entrance="grow" idle={false} />
          </span>
        </div>
      </div>
    </MotionConfig>
  );
}

export const PointGrowOffscreen: Story = {
  name: "point grow from offscreen",
  parameters: { wmdsLayout: "fullscreen" },
  render: () => <OffscreenPointGrow />,
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView;
    if (!view) throw new Error("viewport missing");
    view.scrollTo(0, 0);
    const target = canvasElement.querySelector<HTMLElement>("[data-offscreen-point]");
    expect(target).not.toBeNull();
    expect(target!.getBoundingClientRect().top).toBeGreaterThan(view.innerHeight);

    await new Promise((resolve) => {
      view.setTimeout(resolve, 1600);
    });

    target!.scrollIntoView({ block: "center" });

    await waitFor(
      () => {
        const canvasNode = findHandCanvas(canvasElement);
        expect(canvasNode).not.toBeNull();
        const host = (canvasNode!.getRootNode() as ShadowRoot).host as HTMLElement;
        expect(host.getBoundingClientRect().width).toBeGreaterThan(host.offsetWidth * 0.9);
        expect(handHasInk(canvasNode!)).toBe(true);
      },
      { timeout: 8000 },
    );
  },
};

export const PointGrowCanvas: Story = {
  name: "point grow canvas",
  render: () => <PointGrowFixture />,
  play: async ({ canvasElement }) => {
    let canvasNode: HTMLCanvasElement | null = null;
    await waitFor(
      () => {
        canvasNode = findHandCanvas(canvasElement);
        expect(canvasNode).not.toBeNull();
        const host = (canvasNode!.getRootNode() as ShadowRoot).host as HTMLElement;
        expect(handHasInk(canvasNode!)).toBe(true);
        expect(host.getBoundingClientRect().width).toBeGreaterThan(host.offsetWidth * 0.9);
      },
      { timeout: 8000 },
    );

    const settled = canvasNode as HTMLCanvasElement | null;
    expect(settled).not.toBeNull();
    const before = settled!.width;
    const scale = canvasElement.querySelector<HTMLElement>("[data-point-hand-scale]");
    expect(scale).not.toBeNull();
    scale!.style.fontSize = "96px";

    await waitFor(
      () => {
        const next = findHandCanvas(canvasElement);
        expect(next).not.toBeNull();
        const host = (next!.getRootNode() as ShadowRoot).host as HTMLElement;
        expect(host.offsetWidth).toBeGreaterThan(140);
        expect(next!.width).toBeGreaterThan(before * 1.4);
        expect(handHasInk(next!)).toBe(true);
      },
      { timeout: 8000 },
    );
  },
};
