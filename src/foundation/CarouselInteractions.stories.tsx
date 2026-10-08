import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Card } from "../components/molecules/Card/Card";
import { cardLayoutBodyOccupantRadiusClasses } from "../components/molecules/Card/cardStyles";
import { Carousel, type CarouselProgressPlacement } from "../components/organisms/Carousel/Carousel";

/**
 * Browser interaction tests for **Carousel** — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Carousel",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const tiles = [
  { id: "plan", src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { id: "focus", src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { id: "week", src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { id: "note", src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
  { id: "plan-2", src: "/hero-tiles/plan.svg", alt: "A second weekly plan" },
];

const onLinkClick = fn();

function Harness({
  label = "Selected work",
  count = tiles.length,
  linked = false,
  progress = "center",
}: {
  label?: string;
  count?: number;
  linked?: boolean;
  progress?: CarouselProgressPlacement;
}) {
  return (
    <div className="w-[56rem]">
      <Carousel aria-label={label} itemWidth={40} progress={progress}>
        {tiles.slice(0, count).map((tile) => {
          const card = (
            <Card variant="outlined" shape="rounded">
              <Card.Body>
                <img
                  className={`aspect-[4/3] w-full object-cover ${cardLayoutBodyOccupantRadiusClasses}`}
                  src={tile.src}
                  alt={tile.alt}
                />
              </Card.Body>
            </Card>
          );
          return (
            <Carousel.Item key={tile.id}>
              {linked ? (
                <a
                  href={`#${tile.id}`}
                  className="block"
                  onClick={(event) => {
                    event.preventDefault();
                    onLinkClick(tile.id);
                  }}
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}

function parts(canvasElement: HTMLElement) {
  const viewport = canvasElement.querySelector<HTMLElement>("[data-carousel-viewport]");
  const progress = canvasElement.querySelector<HTMLElement>("[data-carousel-progress]");
  const thumb = canvasElement.querySelector<HTMLElement>("[data-carousel-progress-thumb]");
  if (viewport == null || progress == null || thumb == null) throw new Error("Carousel parts are missing");
  const items = [...canvasElement.querySelectorAll<HTMLElement>("[data-carousel-item]")];
  return { viewport, progress, thumb, items };
}

function pointer(target: Element, type: "pointerdown" | "pointermove" | "pointerup", x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
    }),
  );
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Resolves with the scroll position once the row has stopped moving and held still for `quietMs`. */
async function settledScroll(viewport: HTMLElement, quietMs = 150): Promise<number> {
  const started = performance.now();
  let last = viewport.scrollLeft;
  let since = started;
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const now = performance.now();
    if (viewport.scrollLeft !== last || "moving" in viewport.dataset) {
      last = viewport.scrollLeft;
      since = now;
    } else if (now - since >= quietMs) {
      return last;
    }
    if (now - started > 8000) throw new Error("The row did not come to rest");
  }
}

/** Which item's leading edge sits on the row's leading edge, or -1. */
function restingItem(viewport: HTMLElement, items: HTMLElement[]): number {
  const edge = viewport.getBoundingClientRect().left;
  return items.findIndex((item) => Math.abs(item.getBoundingClientRect().left - edge) <= 1.5);
}

const maxScroll = (viewport: HTMLElement) => viewport.scrollWidth - viewport.clientWidth;

/** At rest the row has an item on its leading edge, or it is at its end. */
function isResting(viewport: HTMLElement, items: HTMLElement[]): boolean {
  return restingItem(viewport, items) >= 0 || Math.abs(viewport.scrollLeft - maxScroll(viewport)) <= 1.5;
}

/** Paints `colors` over each other and returns the resulting relative luminance. */
function luminance(...colors: string[]): number {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context == null) throw new Error("No canvas");
  for (const color of colors) {
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
  }
  const [r, g, b] = [...context.getImageData(0, 0, 1, 1).data].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export const Keys: Story = {
  name: "the row is a labelled region; arrows move one item, Home and End go to the ends",
  render: () => <Harness />,
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole("region", { name: "Selected work" });
    const { viewport, progress, thumb, items } = parts(canvasElement);
    expect(region).toBe(viewport);

    // Each item says its place.
    expect(within(region).getAllByRole("group")).toHaveLength(5);
    expect(within(region).getByRole("group", { name: "1 of 5" })).toBe(items[0]);
    expect(within(region).getByRole("group", { name: "5 of 5" })).toBe(items[4]);

    // The scrubber is for pointers: hidden from assistive tech, and not a tab stop.
    expect(progress).toHaveAttribute("aria-hidden", "true");
    expect(progress.querySelector("[tabindex], a, button, input")).toBeNull();
    expect(progress.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);

    await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "true"));
    expect(viewport.scrollLeft).toBe(0);
    expect(restingItem(viewport, items)).toBe(0);
    const track = thumb.parentElement;
    if (track == null) throw new Error("Scrubber track is missing");
    expect(thumb.getBoundingClientRect().left).toBeCloseTo(track.getBoundingClientRect().left, 0);

    await userEvent.tab();
    expect(viewport).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    await settledScroll(viewport);
    expect(restingItem(viewport, items)).toBe(1);

    await userEvent.keyboard("{ArrowRight}");
    await settledScroll(viewport);
    expect(restingItem(viewport, items)).toBe(2);

    await userEvent.keyboard("{ArrowLeft}");
    await settledScroll(viewport);
    expect(restingItem(viewport, items)).toBe(1);

    await userEvent.keyboard("{End}");
    expect(await settledScroll(viewport)).toBeCloseTo(maxScroll(viewport), 0);
    // At the end, the filled part reaches the end of its track.
    expect(thumb.getBoundingClientRect().right).toBeCloseTo(track.getBoundingClientRect().right, 0);
    // Right at the end stays put.
    await userEvent.keyboard("{ArrowRight}");
    expect(await settledScroll(viewport)).toBeCloseTo(maxScroll(viewport), 0);

    await userEvent.keyboard("{Home}");
    expect(await settledScroll(viewport)).toBe(0);
    expect(restingItem(viewport, items)).toBe(0);

    // Nothing here scrolls the page sideways.
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const Drag: Story = {
  name: "a drag moves the row and the scrubber together, settles on an item, and never clicks a link",
  render: () => <Harness linked />,
  play: async ({ canvas, canvasElement }) => {
    onLinkClick.mockClear();
    const { viewport, thumb, items } = parts(canvasElement);
    await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "true"));

    const link = canvas.getByRole("link", { name: "Blue focus card" });
    const image = within(link).getByRole("img");
    const start = image.getBoundingClientRect();
    const x = start.left + start.width / 2;
    const y = start.top + start.height / 2;
    const thumbStart = thumb.getBoundingClientRect().left;

    pointer(image, "pointerdown", x, y);
    // A press that has not moved is not a drag yet.
    pointer(image, "pointermove", x - 2, y);
    expect(viewport).not.toHaveAttribute("data-dragging");
    expect(viewport.scrollLeft).toBe(0);

    pointer(image, "pointermove", x - 10, y);
    expect(viewport).toHaveAttribute("data-dragging");
    for (let step = 1; step <= 6; step += 1) {
      pointer(viewport, "pointermove", x - 10 - step * 25, y);
      // In step: the row and the filled part have both moved before the next frame.
      expect(viewport.scrollLeft).toBeCloseTo(step * 25, 0);
      expect(thumb.getBoundingClientRect().left).toBeGreaterThan(thumbStart);
      await nextFrame();
    }

    pointer(viewport, "pointerup", x - 160, y);
    expect(viewport).not.toHaveAttribute("data-dragging");
    // The click the browser sends after a drag does not reach the link.
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(onLinkClick).not.toHaveBeenCalled();

    // It glides on and rests with an item on the row's leading edge (or at the row's end).
    const rest = await settledScroll(viewport);
    expect(rest).toBeGreaterThan(0);
    expect(isResting(viewport, items)).toBe(true);
    expect(restingItem(viewport, items)).not.toBe(0);

    // A plain click still follows a link.
    const rowEdges = viewport.getBoundingClientRect();
    const visible = canvas.getAllByRole("link").find((candidate) => {
      const box = candidate.getBoundingClientRect();
      return box.left >= rowEdges.left - 1 && box.right <= rowEdges.right + 1;
    });
    if (visible == null) throw new Error("No link is fully in view");
    await userEvent.click(visible);
    expect(onLinkClick).toHaveBeenCalledTimes(1);

    // A dragged row past its start comes back to rest at the start.
    viewport.focus();
    await userEvent.keyboard("{Home}");
    await settledScroll(viewport);
    pointer(viewport, "pointerdown", x, y);
    pointer(viewport, "pointermove", x + 10, y);
    pointer(viewport, "pointermove", x + 120, y);
    expect(viewport.scrollLeft).toBe(0);
    pointer(viewport, "pointerup", x + 120, y);
    expect(await settledScroll(viewport)).toBe(0);
    expect(restingItem(viewport, items)).toBe(0);

    // Tabbing to a link out of view brings it in.
    const lastLink = canvas.getByRole("link", { name: "A second weekly plan" });
    lastLink.focus();
    await settledScroll(viewport);
    const linkBox = lastLink.getBoundingClientRect();
    const rowBox = viewport.getBoundingClientRect();
    expect(linkBox.left).toBeGreaterThanOrEqual(rowBox.left - 1);
    expect(linkBox.right).toBeLessThanOrEqual(rowBox.right + 1);
  },
};

export const Scrub: Story = {
  name: "dragging the filled part scrubs the row; a press on the track moves it there",
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const { viewport, progress, thumb, items } = parts(canvasElement);
    await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "true"));
    const track = thumb.parentElement;
    if (track == null) throw new Error("Scrubber track is missing");

    // The filled part is as wide as the share of the row in view.
    const trackBox = track.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    expect(thumbBox.width / trackBox.width).toBeCloseTo(viewport.clientWidth / viewport.scrollWidth, 1);

    const travel = trackBox.width - thumbBox.width;
    const max = maxScroll(viewport);
    const x = thumbBox.left + thumbBox.width / 2;
    // Anywhere in the 44px hit area counts, not only the slim track.
    const y = progress.getBoundingClientRect().top + 4;

    pointer(progress, "pointerdown", x, y);
    expect(progress).toHaveAttribute("data-scrubbing");
    for (let step = 1; step <= 5; step += 1) {
      pointer(progress, "pointermove", x + step * 10, y);
      // In step, both ways: the row is where the filled part says, before the next frame.
      expect(viewport.scrollLeft).toBeCloseTo(((step * 10) / travel) * max, -1);
      expect(thumb.getBoundingClientRect().left - trackBox.left).toBeCloseTo(step * 10, 0);
      await nextFrame();
    }
    // It stops at the end of the track.
    pointer(progress, "pointermove", x + 2000, y);
    expect(viewport.scrollLeft).toBeCloseTo(max, 0);
    pointer(progress, "pointermove", x + 50, y);

    pointer(progress, "pointerup", x + 50, y);
    expect(progress).not.toHaveAttribute("data-scrubbing");
    await settledScroll(viewport);
    expect(isResting(viewport, items)).toBe(true);

    // A press on the track, away from the filled part, moves the row there.
    pointer(progress, "pointerdown", trackBox.right - 2, y);
    pointer(progress, "pointerup", trackBox.right - 2, y);
    expect(await settledScroll(viewport)).toBeCloseTo(max, 0);
    pointer(progress, "pointerdown", trackBox.left + 2, y);
    pointer(progress, "pointerup", trackBox.left + 2, y);
    expect(await settledScroll(viewport)).toBe(0);
  },
};

export const EverythingFits: Story = {
  name: "when every item fits, the scrubber hides and the row leaves the tab order",
  render: () => <Harness count={2} />,
  play: async ({ canvas, canvasElement }) => {
    const { viewport, progress } = parts(canvasElement);
    await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "false"));
    expect(getComputedStyle(progress).visibility).toBe("hidden");
    // Its space stays, so the page under it does not move when the row starts to overflow.
    expect(progress.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    expect(viewport).not.toHaveAttribute("tabindex");
    expect(canvas.getByRole("group", { name: "2 of 2" })).toBeVisible();
  },
};

export const NoScrubber: Story = {
  name: 'progress="none" leaves the scrubber out',
  render: () => <Harness progress="none" />,
  play: async ({ canvas, canvasElement }) => {
    expect(canvasElement.querySelector("[data-carousel-progress]")).toBeNull();
    const viewport = canvas.getByRole("region", { name: "Selected work" });
    await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "true"));
    viewport.focus();
    await userEvent.keyboard("{End}");
    expect(await settledScroll(viewport)).toBeCloseTo(maxScroll(viewport), 0);
  },
};

export const RightToLeft: Story = {
  name: "right to left: the row starts at the right and the arrows swap",
  render: () => (
    <div dir="rtl">
      <Harness />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const { viewport, thumb, items } = parts(canvasElement);
    await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "true"));
    const track = thumb.parentElement;
    if (track == null) throw new Error("Scrubber track is missing");
    const rowBox = viewport.getBoundingClientRect();
    expect(items[0].getBoundingClientRect().right).toBeCloseTo(rowBox.right, 0);
    expect(thumb.getBoundingClientRect().right).toBeCloseTo(track.getBoundingClientRect().right, 0);

    viewport.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await settledScroll(viewport);
    expect(items[1].getBoundingClientRect().right).toBeCloseTo(rowBox.right, 0);
    expect(thumb.getBoundingClientRect().right).toBeLessThan(track.getBoundingClientRect().right - 1);

    await userEvent.keyboard("{ArrowRight}");
    await settledScroll(viewport);
    expect(items[0].getBoundingClientRect().right).toBeCloseTo(rowBox.right, 0);

    await userEvent.keyboard("{End}");
    await settledScroll(viewport);
    expect(thumb.getBoundingClientRect().left).toBeCloseTo(track.getBoundingClientRect().left, 0);
  },
};

export const ScrubberContrast: Story = {
  name: "the filled part stands out from its track and the page, in light and dark",
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-testid="light" className="bg-body p-4">
        <Harness label="Selected work, light" />
      </div>
      <div data-testid="dark" data-theme="dark" className="bg-body p-4">
        <Harness label="Selected work, dark" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const theme of ["light", "dark"]) {
      const surface = canvas.getByTestId(theme);
      const { viewport, thumb } = parts(surface);
      await waitFor(() => expect(viewport).toHaveAttribute("data-overflowing", "true"));
      const track = thumb.parentElement;
      if (track == null) throw new Error("Scrubber track is missing");
      const page = getComputedStyle(surface).backgroundColor;
      const trackTone = luminance(page, getComputedStyle(track).backgroundColor);
      const thumbTone = luminance(page, getComputedStyle(thumb).backgroundColor);
      // WCAG 1.4.11: 3:1 for the part that carries the state.
      expect(contrast(thumbTone, trackTone)).toBeGreaterThanOrEqual(3);
      expect(contrast(thumbTone, luminance(page))).toBeGreaterThanOrEqual(3);
    }
  },
};
