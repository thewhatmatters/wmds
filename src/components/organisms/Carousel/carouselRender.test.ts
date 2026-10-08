import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Carousel } from "./Carousel";

function render(props: Partial<Parameters<typeof Carousel>[0]> = {}) {
  return renderToString(
    createElement(
      Carousel,
      { "aria-label": "Selected work", ...props } as Parameters<typeof Carousel>[0],
      createElement(Carousel.Item, { key: "a" }, "First"),
      createElement(Carousel.Item, { key: "b" }, "Second"),
      createElement(Carousel.Item, { key: "c" }, "Third"),
    ),
  );
}

describe("Carousel on the server", () => {
  it("renders the row at its start with the scrubber at zero", () => {
    const html = render();
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Selected work"');
    // Not measured yet: the row is a tab stop, the scrubber is in place with nothing filled.
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("data-carousel-progress");
    expect(html).not.toContain("--carousel-progress:");
    expect(html).not.toContain("--carousel-thumb:");
    expect(html).not.toContain("data-overflowing");
    // At the start nothing is clipped on the leading edge, so it is not faded there.
    expect(html).toContain("--scroll-fade-s:0px");
  });

  it("names each item by its place", () => {
    const html = render();
    expect(html).toContain('aria-label="1 of 3"');
    expect(html).toContain('aria-label="3 of 3"');
    expect(render({ labels: { item: (position, count) => `${position} sur ${count}` } })).toContain(
      'aria-label="2 sur 3"',
    );
  });

  it("writes item widths per breakpoint, each falling back to the one below", () => {
    expect(render()).toContain("--carousel-item:80;--carousel-item-sm:55;--carousel-item-md:55;--carousel-item-lg:40");
    expect(render({ itemWidth: 60 })).toContain(
      "--carousel-item:60;--carousel-item-sm:60;--carousel-item-md:60;--carousel-item-lg:60",
    );
    expect(render({ itemWidth: { base: 90, md: 45 } })).toContain(
      "--carousel-item:90;--carousel-item-sm:90;--carousel-item-md:45;--carousel-item-lg:45",
    );
  });

  it("leaves the scrubber, the snap, and the fade out when they are turned off", () => {
    const html = render({ progress: "none", snap: false, fade: false });
    expect(html).not.toContain("data-carousel-progress");
    expect(html).not.toContain("snap-mandatory");
    expect(html).not.toContain("scroll-fade-x");
  });
});
