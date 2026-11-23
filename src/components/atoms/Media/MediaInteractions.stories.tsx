import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { Media } from "./Media";

/**
 * Browser interaction tests for Media — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Media",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const viewports = {
  phone390: { name: "Phone 390", styles: { width: "390px", height: "844px" }, type: "mobile" as const },
  desktop1280: { name: "Desktop 1280", styles: { width: "1280px", height: "800px" }, type: "desktop" as const },
};

const box = (element: Element) => element.getBoundingClientRect();
const frames = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="frame"]')];

export const HoldsItsShape: Story = {
  name: "the frame holds its ratio before the picture loads, and the picture fills it at the crop point",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="grid grid-cols-3 items-start gap-6 p-4">
      <Media src="/sample/media-dish.svg" alt="A plate of roasted vegetables" loading="eager" />
      <Media src="/sample/media-room.svg" alt="A dining room" ratio="16/9" focus={{ x: 50, y: 20 }} loading="eager" />
      <Media alt="The patio in summer" ratio="1/1" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [standard, wide, square] = frames(canvasElement);
    // Each frame has its shape with or without a picture.
    expect(box(standard!).width / box(standard!).height).toBeCloseTo(4 / 3, 1);
    expect(box(wide!).width / box(wide!).height).toBeCloseTo(16 / 9, 1);
    expect(box(square!).width / box(square!).height).toBeCloseTo(1, 1);

    const image = canvas.getByRole("img", { name: "A dining room" });
    await waitFor(() => expect((image as HTMLImageElement).naturalWidth).toBeGreaterThan(0));
    expect(Math.abs(box(image).width - box(wide!).width)).toBeLessThan(1);
    expect(Math.abs(box(image).height - box(wide!).height)).toBeLessThan(1);
    expect(getComputedStyle(image).objectFit).toBe("cover");
    expect(getComputedStyle(image).objectPosition).toBe("50% 20%");
    // The corner follows the surface radius knob and clips the picture.
    expect(getComputedStyle(wide!).overflow).toBe("hidden");
    expect(parseFloat(getComputedStyle(wide!).borderTopLeftRadius)).toBeGreaterThan(0);

    // No picture: a named, tinted box of the same shape.
    const empty = canvas.getByRole("img", { name: "The patio in summer" });
    expect(empty.tagName).toBe("SPAN");
    expect(getComputedStyle(square!).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};

export const FailedPicture: Story = {
  name: "a picture that fails to load becomes the tinted fallback, and the frame keeps its shape",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="max-w-md p-4">
      <Media src="/sample/does-not-exist.jpg" alt="The kitchen" loading="eager" caption="The kitchen, before service" tag="Stock photo" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [frame] = frames(canvasElement);
    await waitFor(() => expect(frame!.dataset.status).toBe("fallback"));
    expect(canvasElement.querySelector("img")).toBeNull();
    expect(canvas.getByRole("img", { name: "The kitchen" })).toBeVisible();
    expect(box(frame!).width / box(frame!).height).toBeCloseTo(4 / 3, 1);
    expect(canvas.getByText("Stock photo")).toBeVisible();
  },
};

export const LegendOnAPhone: Story = {
  name: "at 390 a long caption wraps and the tag drops under it, with no sideways scroll",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-4">
      <Media
        src="/sample/media-patio.svg"
        alt="The patio"
        loading="eager"
        caption="The patio in late summer, set for the Sunday supper that runs from May to the first frost"
        tag="Stock photo"
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    const [frame] = frames(canvasElement);
    const caption = canvasElement.querySelector('[data-slot="caption"]')!;
    const tag = canvas.getByText("Stock photo");
    expect(box(caption).top).toBeGreaterThanOrEqual(box(frame!).bottom);
    expect(box(caption).right).toBeLessThanOrEqual(box(frame!).right + 0.5);
    expect(box(tag).top).toBeGreaterThanOrEqual(box(caption).bottom - 0.5);
    expect(box(tag).right).toBeLessThanOrEqual(box(frame!).right + 0.5);
    // The tag is small mono capitals, the caption is not.
    expect(getComputedStyle(tag).textTransform).toBe("uppercase");
    expect(getComputedStyle(caption).textTransform).toBe("none");
  },
};
