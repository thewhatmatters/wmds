import type { Meta, StoryObj } from "@storybook/react-vite";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { LinkTile } from "../components/molecules/LinkTile/LinkTile";
import { TileGrid, type TileGridLayout } from "../components/molecules/TileGrid/TileGrid";
import { FilteredGrid, sampleResourceGroups, sampleResources } from "../guides/FilterPanel/FilterPanelExample";

/**
 * Browser interaction tests for **TileGrid**, **LinkTile**, and **Guides/Filter panel → Pattern —
 * filtered grid** — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Tile grid",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Harness({ layout = "masonry" }: { layout?: TileGridLayout }) {
  return (
    <div className="w-[56rem]">
      <TileGrid aria-label="Resources" layout={layout} columns={3}>
        {sampleResources.map((item) => (
          <TileGrid.Item key={item.id}>
            <LinkTile
              title={item.title}
              href={item.href}
              external={item.external}
              meta={item.meta}
              ratio={layout === "uniform" ? 4 / 3 : undefined}
              media={<img src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} />}
            />
          </TileGrid.Item>
        ))}
      </TileGrid>
    </div>
  );
}

const titles = sampleResources.map((item) => item.title);

function tiles(canvasElement: HTMLElement) {
  return within(within(canvasElement).getByRole("list", { name: "Resources" })).getAllByRole("link");
}

/** Tab from the top of the canvas through every tile; the titles in the order focus reached them. */
async function tabThrough(canvasElement: HTMLElement) {
  const links = tiles(canvasElement);
  const order: string[] = [];
  links[0].focus();
  for (let index = 0; index < links.length; index++) {
    const focused = document.activeElement as HTMLElement;
    order.push(focused.querySelector("[id$='-title']")?.textContent ?? "");
    if (index < links.length - 1) await userEvent.tab();
  }
  return order;
}

export const MasonryReadingOrder: Story = {
  name: "masonry packs, and the tab order runs across and then down",
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list", { name: "Resources" });
    await waitFor(() => {
      expect(list).toHaveAttribute("data-packed");
    });
    const links = tiles(canvasElement);
    expect(links).toHaveLength(9);

    // Three columns, and the tiles packed: something in the second row starts above the foot of
    // the first row's tallest tile.
    const boxes = links.map((link) => link.getBoundingClientRect());
    expect(new Set(boxes.map((box) => Math.round(box.left))).size).toBe(3);
    const firstRowFoot = Math.max(...boxes.slice(0, 3).map((box) => box.bottom));
    expect(Math.min(...boxes.slice(3).map((box) => box.top))).toBeLessThan(firstRowFoot);

    // No tile overlaps another in its column.
    for (const [index, box] of boxes.entries()) {
      for (const other of boxes.slice(index + 1)) {
        if (Math.round(other.left) === Math.round(box.left)) expect(other.top).toBeGreaterThanOrEqual(box.bottom);
      }
    }

    // Tab order is the order of the items, and on screen it never goes back up the page.
    expect(await tabThrough(canvasElement)).toEqual(titles);
    const tops = boxes.map((box) => Math.round(box.top));
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    // The first row reads left to right.
    expect(boxes[0].left).toBeLessThan(boxes[1].left);
    expect(boxes[1].left).toBeLessThan(boxes[2].left);
  },
};

export const UniformReadingOrder: Story = {
  name: "uniform rows are level, in the same order",
  render: () => <Harness layout="uniform" />,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list", { name: "Resources" });
    expect(list).not.toHaveAttribute("data-packed");
    const boxes = tiles(canvasElement).map((link) => link.getBoundingClientRect());
    for (const row of [0, 3, 6]) {
      expect(Math.round(boxes[row + 1].top)).toBe(Math.round(boxes[row].top));
      expect(Math.round(boxes[row + 2].top)).toBe(Math.round(boxes[row].top));
      expect(Math.round(boxes[row + 1].height)).toBe(Math.round(boxes[row].height));
    }
    expect(await tabThrough(canvasElement)).toEqual(titles);
  },
};

export const TileSpokenName: Story = {
  name: "a tile is one link: title, meta, tag, then the new-tab hint",
  render: () => (
    <FilteredGrid title="Resources" caption="Library" items={sampleResources} groups={sampleResourceGroups} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list", { name: "Library" });
    const external = within(list).getByRole("link", {
      name: "Grid notes gridnotes.example Free (opens in a new tab)",
    });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    // One link per tile, nothing nested, and the image keeps its place before it loads.
    expect(external.querySelector("a, button")).toBeNull();
    const image = external.querySelector("img");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "1000");

    // A page in the same app stays in this tab and says nothing about a new one.
    const internal = within(list).getByRole("link", { name: "Our brief template whatmatters.so Free" });
    expect(internal).not.toHaveAttribute("target");
    expect(within(list).getAllByRole("link")).toHaveLength(9);
  },
};

export const GridFiltersAndClears: Story = {
  name: "the panel filters the grid, the empty slot covers no matches, and Clear all restores it",
  render: () => (
    <FilteredGrid title="Resources" caption="Library" items={sampleResources} groups={sampleResourceGroups} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvasElement.querySelector<HTMLElement>("aside");
    if (panel == null) throw new Error("Filter panel is missing");
    const status = canvas.getByRole("status");
    expect(status).toHaveTextContent("9 resources");

    within(panel).getByRole("checkbox", { name: "Fonts (2 resources)", hidden: true }).click();
    await waitFor(() => {
      expect(status).toHaveTextContent("2 resources");
    });
    // The tiles that stay keep their order; the ones that left are gone once they have faded.
    await waitFor(() => {
      expect(
        within(canvas.getByRole("list", { name: "Library" }))
          .getAllByRole("link")
          .map((link) => link.querySelector("[id$='-title']")?.textContent),
      ).toEqual(["Serif library", "Mono faces worth setting"]);
    });

    within(panel).getByRole("checkbox", { name: "Paid (2 resources)", hidden: true }).click();
    await waitFor(() => {
      expect(status).toHaveTextContent("0 resources");
    });
    expect(canvas.getByText("No resources match these filters.")).toBeInTheDocument();
    expect(canvas.queryByRole("list", { name: "Library" })).toBeNull();

    within(panel).getByRole("button", { name: "Clear all", hidden: true }).click();
    await waitFor(() => {
      expect(status).toHaveTextContent("9 resources");
    });
    expect(within(canvas.getByRole("list", { name: "Library" })).getAllByRole("link")).toHaveLength(9);
  },
};

export const GridLoading: Story = {
  name: "a loading grid is busy, says so, and has no links",
  render: () => (
    <FilteredGrid title="Resources" caption="Library" items={[]} groups={sampleResourceGroups} loading />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent("Loading");
    const list = canvas.getByRole("list", { name: "Library" });
    expect(list).toHaveAttribute("aria-busy", "true");
    expect(within(list).queryAllByRole("link")).toHaveLength(0);
    expect(list.querySelectorAll("[data-loading]")).toHaveLength(6);
  },
};

/** Server markup hydrated in the browser: what a visitor to a server-rendered page gets. */
async function hydrateHarness(canvasElement: HTMLElement, layout: TileGridLayout) {
  const host = document.createElement("div");
  host.innerHTML = renderToString(<Harness layout={layout} />);
  canvasElement.append(host);
  const links = () => [...host.querySelectorAll<HTMLElement>("[data-link-tile]")];
  const tops = () => links().map((link) => Math.round(link.getBoundingClientRect().top));
  const serverTops = tops();

  // Every frame for half a second after hydration: is any tile mid-move?
  const moving: string[] = [];
  let frames = 0;
  const errors: unknown[] = [];
  const root = hydrateRoot(host, <Harness layout={layout} />, { onRecoverableError: (error) => errors.push(error) });
  await new Promise<void>((resolve) => {
    const started = performance.now();
    const watch = () => {
      frames++;
      for (const item of host.querySelectorAll<HTMLElement>("li")) {
        const { transform, opacity } = getComputedStyle(item);
        if ((transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)") || opacity !== "1") {
          moving.push(`${transform} ${opacity}`);
        }
      }
      if (performance.now() - started < 500) requestAnimationFrame(watch);
      else resolve();
    };
    requestAnimationFrame(watch);
  });
  return { host, root, serverTops, tops, moving, frames, errors };
}

export const MasonryHydratesWithoutAnimation: Story = {
  name: "the first masonry pack after hydration is instant: no tile slides or fades",
  render: () => <div />,
  play: async ({ canvasElement }) => {
    const { host, root, serverTops, tops, moving, frames, errors } = await hydrateHarness(canvasElement, "masonry");
    expect(errors).toEqual([]);
    expect(frames).toBeGreaterThan(5);
    expect(host.querySelector("ul")).toHaveAttribute("data-packed");
    // The tiles did close up, and none was ever transformed or faded on the way.
    expect(tops()).not.toEqual(serverTops);
    expect(moving).toEqual([]);
    root.unmount();
    host.remove();
  },
};

export const UniformHydratesInPlace: Story = {
  name: "a uniform grid is where the server put it: nothing moves at hydration",
  render: () => <div />,
  play: async ({ canvasElement }) => {
    const { host, root, serverTops, tops, moving, errors } = await hydrateHarness(canvasElement, "uniform");
    expect(errors).toEqual([]);
    expect(host.querySelector("ul")).not.toHaveAttribute("data-packed");
    expect(tops()).toEqual(serverTops);
    expect(moving).toEqual([]);
    root.unmount();
    host.remove();
  },
};
