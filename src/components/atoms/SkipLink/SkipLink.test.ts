/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { focusSkipTarget, SkipLink, type SkipLinkProps } from "./SkipLink";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("SkipLink", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    document.body.innerHTML = "";
    root = undefined;
    container = undefined;
    vi.restoreAllMocks();
  });

  /** Renders the link, then a page region after it. */
  function render(props: SkipLinkProps = {}, region = '<main id="main"><button>First</button></main>') {
    container = document.createElement("div");
    document.body.append(container);
    document.body.insertAdjacentHTML("beforeend", region);
    root = createRoot(container);
    act(() => {
      root!.render(createElement(SkipLink, props));
    });
    return container.querySelector("a")!;
  }

  /** A real click, so the browser's default (following the hash) can be seen prevented or not. */
  function click(link: HTMLAnchorElement) {
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    act(() => {
      link.dispatchEvent(event);
    });
    return event;
  }

  it("is a link to #main that says Skip to content", () => {
    const link = render();
    expect(link.getAttribute("href")).toBe("#main");
    expect(link.textContent).toBe("Skip to content");
    expect(link.className).toContain("sr-only");
    expect(link.className).toContain("focus:not-sr-only");
  });

  it("takes its own target, words and attributes", () => {
    const link = render(
      { target: "results", children: "Skip to results", id: "skip", "aria-keyshortcuts": "S" } as SkipLinkProps,
      '<section id="results"></section>',
    );
    expect(link.getAttribute("href")).toBe("#results");
    expect(link.textContent).toBe("Skip to results");
    expect(link.id).toBe("skip");
    expect(link.getAttribute("aria-keyshortcuts")).toBe("S");
  });

  it("moves the focus to the region and leaves the URL alone", () => {
    const link = render();
    const main = document.getElementById("main")!;
    const event = click(link);
    expect(document.activeElement).toBe(main);
    expect(main.getAttribute("tabindex")).toBe("-1");
    expect(event.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe("");
  });

  it("keeps a tabindex the region already has", () => {
    const link = render({}, '<main id="main" tabindex="0"></main>');
    click(link);
    expect(document.getElementById("main")!.getAttribute("tabindex")).toBe("0");
    expect(document.activeElement).toBe(document.getElementById("main"));
  });

  it("adds no tabindex to a region that takes the focus by itself", () => {
    const link = render({ target: "search" }, '<input id="search" />');
    click(link);
    const field = document.getElementById("search")!;
    expect(field.hasAttribute("tabindex")).toBe(false);
    expect(document.activeElement).toBe(field);
  });

  it("stays a plain in-page link when the page has no such region", () => {
    const link = render({ target: "nowhere" });
    const event = click(link);
    expect(event.defaultPrevented).toBe(false);
  });

  it("runs the page's own onClick first, and stands down when that prevents the default", () => {
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const link = render({ onClick } as SkipLinkProps);
    click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(document.getElementById("main"));
  });
});

describe("focusSkipTarget", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("answers whether it found the region", () => {
    document.body.innerHTML = '<div id="content"></div>';
    expect(focusSkipTarget("content")).toBe(true);
    expect(document.activeElement?.id).toBe("content");
    expect(focusSkipTarget("missing")).toBe(false);
  });
});
