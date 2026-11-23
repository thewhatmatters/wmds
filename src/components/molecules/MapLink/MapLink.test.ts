/** @vitest-environment happy-dom */
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { MapLink, mapLinkHref, mapLinkQuery } from "./MapLink";

describe("mapLinkHref", () => {
  it("asks Google for directions by default, with the place encoded", () => {
    expect(mapLinkHref("1201 S Lamar Blvd, Austin, TX 78704")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=1201%20S%20Lamar%20Blvd%2C%20Austin%2C%20TX%2078704",
    );
  });

  it("shows the place on the map with mode search", () => {
    expect(mapLinkHref("Round Rock, TX", { mode: "search" })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Round%20Rock%2C%20TX",
    );
  });

  it("writes Apple Maps addresses", () => {
    expect(mapLinkHref("Round Rock, TX", { provider: "apple" })).toBe("https://maps.apple.com/?daddr=Round%20Rock%2C%20TX");
    expect(mapLinkHref("Round Rock, TX", { provider: "apple", mode: "search" })).toBe(
      "https://maps.apple.com/?q=Round%20Rock%2C%20TX",
    );
  });

  it("puts an address typed on two lines on one, and keeps signs a query would trip on", () => {
    expect(mapLinkQuery("  1201 S Lamar Blvd\n  Austin, TX  ")).toBe("1201 S Lamar Blvd Austin, TX");
    expect(mapLinkHref("Busby's Café & Bar #2\nAustin")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=Busby's%20Caf%C3%A9%20%26%20Bar%20%232%20Austin",
    );
  });

  it("gives no address for an empty place", () => {
    expect(mapLinkHref("")).toBeUndefined();
    expect(mapLinkHref(" \n ")).toBeUndefined();
  });
});

describe("MapLink", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
  });

  function render(props: ComponentProps<typeof MapLink>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(MapLink, props));
    });
    return container;
  }

  const slot = (view: HTMLElement, name: string) => view.querySelector<HTMLElement>(`[data-slot="${name}"]`);

  it("shows the address as text and links to directions there", () => {
    const view = render({ address: "1201 S Lamar Blvd\nAustin, TX 78704" });
    const address = view.querySelector("address")!;
    expect(address.textContent).toBe("1201 S Lamar Blvd\nAustin, TX 78704");
    const link = view.querySelector("a")!;
    expect(link.textContent).toContain("Get directions");
    expect(link.getAttribute("href")).toBe(mapLinkHref("1201 S Lamar Blvd Austin, TX 78704"));
    // Same tab by default: a phone hands the link to its maps app.
    expect(link.hasAttribute("target")).toBe(false);
    // No embedded map, ever.
    expect(view.querySelector("iframe")).toBeNull();
    expect(slot(view, "areas")).toBeNull();
  });

  it("asks the map for place when given, and still shows the address", () => {
    const view = render({ address: "1201 S Lamar Blvd", place: "Busby's, 1201 S Lamar Blvd, Austin" });
    expect(view.querySelector("address")!.textContent).toBe("1201 S Lamar Blvd");
    expect(view.querySelector("a")!.getAttribute("href")).toBe(mapLinkHref("Busby's, 1201 S Lamar Blvd, Austin"));
  });

  it("lists the areas served under a name, with a map of the home town", () => {
    const view = render({
      place: "Round Rock, TX",
      mode: "search",
      areas: ["Round Rock", "Cedar Park", "Leander"],
      areasLabel: "Towns we serve",
    });
    const list = slot(view, "areas")!;
    expect(list.tagName).toBe("UL");
    expect(list.getAttribute("aria-label")).toBe("Towns we serve");
    expect([...list.querySelectorAll("li")].map((item) => item.textContent)).toEqual(["Round Rock", "Cedar Park", "Leander"]);
    expect(view.querySelector("address")).toBeNull();
    const link = view.querySelector("a")!;
    expect(link.textContent).toContain("See it on the map");
    expect(link.getAttribute("href")).toBe(mapLinkHref("Round Rock, TX", { mode: "search" }));
  });

  it("draws no link without a place, and no empty rows", () => {
    const view = render({ areas: ["Round Rock"] });
    expect(view.querySelector("a")).toBeNull();
    expect(slot(view, "actions")).toBeNull();
    expect(slot(view, "areas")).not.toBeNull();
    const empty = render({ address: "   ", areas: [] });
    expect(empty.querySelector("address")).toBeNull();
    expect(slot(empty, "areas")).toBeNull();
    expect(slot(empty, "actions")).toBeNull();
  });

  it("takes its own words, a new tab, Apple Maps and more actions", () => {
    const view = render({
      address: "1201 S Lamar Blvd, Austin",
      label: "Directions to the bar",
      provider: "apple",
      newTab: true,
      actions: createElement("a", { href: "tel:+15125550100" }, "Call"),
    });
    const [link, call] = [...slot(view, "actions")!.querySelectorAll("a")];
    expect(link!.textContent).toContain("Directions to the bar");
    expect(link!.getAttribute("href")).toBe("https://maps.apple.com/?daddr=1201%20S%20Lamar%20Blvd%2C%20Austin");
    expect(link!.getAttribute("target")).toBe("_blank");
    expect(link!.getAttribute("rel")).toContain("noopener");
    expect(call!.getAttribute("href")).toBe("tel:+15125550100");
  });

  it("passes className and data attributes to its root", () => {
    const view = render({ address: "1 Main St", className: "md:col-span-4", "data-section": "visit" } as ComponentProps<
      typeof MapLink
    >);
    const rootElement = slot(view, "map-link")!;
    expect(rootElement.className).toContain("md:col-span-4");
    expect(rootElement.getAttribute("data-section")).toBe("visit");
  });
});
