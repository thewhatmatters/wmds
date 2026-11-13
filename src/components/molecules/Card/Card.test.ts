/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Card, type CardBodyProps, type CardProps } from "./Card";

describe("Card pinned height with Footer", () => {
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

  it("scrolls Body between Header and Footer when the root height is pinned", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        createElement(
          Card,
          { padding: "none", variant: "surface", className: "h-[280px]" } as CardProps,
          createElement(Card.Header, { start: createElement("h2", null, "Title") }),
          createElement(
            Card.Body,
            null,
            createElement("div", { "data-occupant": "" }, "Long body"),
          ),
          createElement(Card.Footer, null, createElement("button", { type: "button" }, "Next")),
        ),
      );
    });

    const card = container.firstElementChild;
    expect(card?.className).toContain("h-[280px]");
    expect(card?.className).toContain("overflow-hidden");
    expect(card?.className).toContain("min-h-0");

    const header = card?.querySelector(":scope > header");
    const footer = card?.querySelector(":scope > footer");
    const body = [...(card?.children ?? [])].find(
      (el) => el instanceof HTMLElement && el.tagName === "DIV",
    );

    expect(header?.className).toContain("shrink-0");
    expect(footer?.className).toContain("shrink-0");
    expect(body?.className).toContain("px-[2px]");
    expect(body?.className).toContain("flex-1");
    expect(body?.className).toContain("overflow-y-auto");
    expect(body?.className).not.toContain("[&>*]:flex-1");
  });

  it("keeps terminal Body fill when Footer is omitted", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        createElement(
          Card,
          { padding: "none", variant: "surface", className: "h-[280px]" } as CardProps,
          createElement(Card.Header, { start: createElement("h2", null, "Title") }),
          createElement(
            Card.Body,
            null,
            createElement("div", { "data-occupant": "" }, "Fill"),
          ),
        ),
      );
    });

    const card = container.firstElementChild;
    const body = [...(card?.children ?? [])].find(
      (el) => el instanceof HTMLElement && el.tagName === "DIV",
    );
    expect(body?.className).toContain("flex-1");
    expect(body?.className).toContain("[&>*]:flex-1");
    expect(body?.className).not.toContain("overflow-y-auto");
  });
});

describe("Card.Body terminal frame", () => {
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

  function renderFrame(props: CardBodyProps) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        createElement(
          Card,
          { padding: "none" } as CardProps,
          createElement(Card.Header, { start: createElement("h2", null, "Session") }),
          createElement(Card.Body, props),
        ),
      );
    });
  }

  it("embeds a dark read-only frame without treating bodyTerminal as the variant", () => {
    renderFrame({
      variant: "terminal",
      title: "session.log",
      src: "https://example.com/term",
      height: "sm",
      readOnly: true,
    });

    const card = container?.firstElementChild;
    expect(card?.className).toContain("pb-0");
    expect(card?.className).not.toContain("pb-[2px]");

    const frame = container?.querySelector("[data-variant='terminal']");
    expect(frame?.getAttribute("data-theme")).toBe("dark");
    expect(frame?.getAttribute("data-state")).toBe("ready");
    expect(frame?.textContent).toContain("Read only");
    const iframe = frame?.querySelector("iframe");
    expect(iframe?.getAttribute("title")).toBe("session.log");
    expect(iframe?.getAttribute("src")).toBe("https://example.com/term");
  });

  it("shows a skeleton while loading and a status line when disconnected", () => {
    renderFrame({ variant: "terminal", title: "session.log", state: "loading" });
    const loading = container?.querySelector("[data-variant='terminal']");
    expect(loading?.getAttribute("data-state")).toBe("loading");
    expect(loading?.querySelector("iframe")).toBeNull();
    expect(loading?.getAttribute("aria-busy") ?? loading?.querySelector("[aria-busy='true']")).toBeTruthy();

    act(() => {
      root?.render(
        createElement(
          Card,
          { padding: "none" } as CardProps,
          createElement(Card.Header, { start: createElement("h2", null, "Session") }),
          createElement(Card.Body, {
            variant: "terminal",
            title: "session.log",
            state: "disconnected",
            message: "Session disconnected",
          } as CardBodyProps),
        ),
      );
    });

    const offline = container?.querySelector("[data-variant='terminal']");
    expect(offline?.querySelector("iframe")).toBeNull();
    expect(offline?.textContent).toContain("Session disconnected");
  });

  it("says there is no session when ready without a source", () => {
    renderFrame({ variant: "terminal", title: "session.log" });
    expect(container?.textContent).toContain("No session");
    expect(container?.querySelector("iframe")).toBeNull();
  });
});

describe("Card glass", () => {
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

  function renderCard(props: Partial<CardProps>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Card, { variant: "glass", ...props } as CardProps, "Glass"));
    });
    return container.firstElementChild as HTMLElement;
  }

  it("tints with the surface token, blurs the backdrop and keeps a solid fallback", () => {
    for (const padding of ["md", "none"] as const) {
      const card = renderCard({ padding });
      expect(card.getAttribute("data-variant")).toBe("glass");
      expect(card.className).toContain("var(--color-background-surface)_var(--card-glass-tint,var(--card-glass-tint-default,70%))");
      expect(card.className).toContain("backdrop-blur-[var(--card-glass-blur,12px)]");
      expect(card.className).toContain("[@supports_not_(backdrop-filter:blur(0))]:bg-surface");
      expect(card.className).toContain("[@media(prefers-reduced-transparency:reduce)]:bg-surface");
      expect(card.className).toContain("[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none");
      act(() => root?.unmount());
      container?.remove();
    }
  });

  it("takes a tone, so the glass follows the card's own colour pair", () => {
    const card = renderCard({ padding: "md", tone: "inverse" });
    expect(card.getAttribute("data-tone")).toBe("inverse");
    expect(card.getAttribute("data-theme")).toBe("dark");
    expect(card.className).toContain("var(--color-background-surface)");
  });
});
