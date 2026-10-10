/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LinkTile } from "../LinkTile/LinkTile";
import { TileGrid } from "./TileGrid";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const tile = (id: string, external = false) =>
  createElement(
    TileGrid.Item,
    { key: id },
    createElement(LinkTile, {
      title: `Tile ${id}`,
      href: `https://${id}.example`,
      meta: `${id}.example`,
      external,
      media: createElement("img", { src: `/${id}.png`, alt: `${id} home page`, width: 800, height: 600 }),
    }),
  );

const tree = (props: Partial<Parameters<typeof TileGrid>[0]> = {}) =>
  createElement(TileGrid, { "aria-label": "Resources", ...props }, tile("a", true), tile("b"), tile("c"));

describe("TileGrid on the server", () => {
  it("renders the items in order, in a named list, not yet packed", () => {
    const html = renderToString(tree());
    expect(html).toContain('role="list"');
    expect(html).toContain('aria-label="Resources"');
    expect(html.indexOf("Tile a")).toBeLessThan(html.indexOf("Tile b"));
    expect(html.indexOf("Tile b")).toBeLessThan(html.indexOf("Tile c"));
    expect(html).not.toContain("data-packed");
    expect(html).not.toContain("grid-row-end");
    // Tiles are visible in the server markup, not waiting on an entrance.
    expect(html).not.toContain("opacity:0");
  });

  it("writes columns per breakpoint, each falling back to the one below", () => {
    expect(renderToString(tree())).toContain(
      "--tile-grid-cols:1;--tile-grid-cols-sm:2;--tile-grid-cols-md:2;--tile-grid-cols-lg:3;--tile-grid-cols-xl:3",
    );
    expect(renderToString(tree({ columns: { base: 2, md: 4 } }))).toContain(
      "--tile-grid-cols:2;--tile-grid-cols-sm:2;--tile-grid-cols-md:4;--tile-grid-cols-lg:4;--tile-grid-cols-xl:4",
    );
  });

  it("shows the empty slot when there are no items", () => {
    const html = renderToString(
      createElement(TileGrid, { "aria-label": "Resources", empty: createElement("p", null, "No resources.") }),
    );
    expect(html).toContain("No resources.");
    expect(html).not.toContain("<ul");
  });

  it("marks a loading grid busy", () => {
    expect(renderToString(tree({ busy: true }))).toContain('aria-busy="true"');
    expect(renderToString(tree())).not.toContain("aria-busy");
  });
});

describe("LinkTile on the server", () => {
  it("is one link named by its title, its meta, then the new-tab hint", () => {
    const html = renderToString(tile("a", true));
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    const labelledBy = html.match(/aria-labelledby="([^"]+)"/)?.[1].split(" ") ?? [];
    expect(labelledBy).toHaveLength(3);
    const text = (id: string) => html.match(new RegExp(`id="${id}"[^>]*>([^<]*)`))?.[1];
    expect(labelledBy.map(text)).toEqual(["Tile a", "a.example", "(opens in a new tab)"]);
  });

  it("stays in the same tab without external", () => {
    const html = renderToString(tile("b"));
    expect(html).not.toContain("target=");
    expect(html).not.toContain("opens in a new tab");
  });

  it("fixes the frame's ratio when asked", () => {
    const html = renderToString(
      createElement(LinkTile, {
        title: "Fixed",
        href: "/fixed",
        ratio: 4 / 3,
        media: createElement("img", { src: "/fixed.png", alt: "", width: 800, height: 1000 }),
      }),
    );
    expect(html).toContain("aspect-ratio:1.3333333333333333");
  });

  it("renders a placeholder that is not a link while loading", () => {
    const html = renderToString(createElement(LinkTile, { loading: true }));
    expect(html).not.toContain("<a ");
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("TileGrid hydration", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates the server markup without a mismatch", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const onRecoverableError = vi.fn();
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree());
    document.body.append(container);

    const root = await act(async () => hydrateRoot(container, tree(), { onRecoverableError }));

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelectorAll("li")).toHaveLength(3);
    await act(async () => root.unmount());
  });
});
