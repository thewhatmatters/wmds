/** @vitest-environment happy-dom */
import { createElement, type ComponentProps } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Search } from "./Search";

describe("Search", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  function mount(props: Partial<ComponentProps<typeof Search>>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(createElement(Search, { label: "Email address", actionLabel: "Subscribe", ...props }));
    });
    const shell = container.querySelector<HTMLElement>("[data-variant]");
    const field = container.querySelector("input");
    const action = container.querySelector("button");
    if (shell == null || field == null || action == null) throw new Error("Search did not render its pill, field and action");
    return { shell, field, action };
  }

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
  });

  it("is a solid pill with the control border by default", () => {
    const { shell, field } = mount({});
    expect(shell.dataset.variant).toBe("surface");
    expect(shell.className).toContain("bg-surface");
    expect(shell.className).toContain("border-border-control");
    expect(shell.className).not.toContain("backdrop-blur");
    expect(field.className).not.toContain("color-text-primary");
  });

  it("glass: the frosted fill, a hairline edge and a stronger placeholder", () => {
    const { shell, field } = mount({ variant: "glass" });
    expect(shell.dataset.variant).toBe("glass");
    expect(shell.className).toContain("--card-glass-tint");
    expect(shell.className).toContain("backdrop-blur-[var(--card-glass-blur,12px)]");
    expect(shell.className).toContain("border-elevation-edge");
    expect(shell.className).not.toContain("border-border-control");
    // cn() doesn't merge: the solid fill must not ride along as its own class.
    expect(shell.className.split(/\s+/)).not.toContain("bg-surface");
    expect(field.className).toContain("placeholder:!text-[color-mix(in_srgb,var(--color-text-primary)_80%,transparent)]");
  });

  it("glass: a validation status still colours the border", () => {
    const { shell } = mount({ variant: "glass", status: "error", message: "Enter an email address, like name@example.com." });
    expect(shell.className).toContain("border-error");
    expect(shell.className).not.toContain("border-elevation-edge");
  });

  it("lg: a 56px pill with a 40px inset action", () => {
    const { shell, action } = mount({ size: "lg" });
    expect(shell.className).toContain("h-14");
    expect(action.className).toContain("h-10");
    expect(action.className).toContain("!min-h-10");
    expect(action.className).not.toContain("h-8");
  });

  it("actionType submit makes the inset action the form's submit button", () => {
    expect(mount({ actionType: "submit" }).action.getAttribute("type")).toBe("submit");
  });

  it("without actionStatus the action is the plain button", () => {
    const { action } = mount({});
    expect(action.dataset.status).toBeUndefined();
    expect(action.className).not.toContain("!overflow-visible");
  });

  it("actionStatus idle: the status button, its box left open for the touch layer", () => {
    const { action } = mount({ actionStatus: "idle", actionStatusLabels: { loading: "Sending…" } });
    expect(action.dataset.status).toBe("idle");
    expect(action.textContent).toBe("Subscribe");
    expect(action.getAttribute("aria-busy")).toBeNull();
    const classes = action.className.split(/\s+/);
    expect(classes).toContain("!overflow-visible");
    expect(classes).toContain("pointer-coarse:after:-inset-1.5");
  });

  it("actionStatus loading: busy, still focusable, and a press does nothing", () => {
    let presses = 0;
    const { action } = mount({
      actionStatus: "loading",
      actionStatusLabels: { loading: "Sending…" },
      onAction: () => {
        presses += 1;
      },
    });
    expect(action.getAttribute("aria-busy")).toBe("true");
    expect(action.getAttribute("aria-disabled")).toBe("true");
    expect(action.hasAttribute("disabled")).toBe(false);
    expect(action.textContent).toBe("Sending…");
    act(() => {
      action.click();
    });
    expect(presses).toBe(0);
  });

  it("actionStatus loading on a submit action: the form isn't sent again", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    let sends = 0;
    act(() => {
      root?.render(
        createElement(
          "form",
          {
            onSubmit: (event: { preventDefault: () => void }) => {
              event.preventDefault();
              sends += 1;
            },
          },
          createElement(Search, {
            label: "Email address",
            actionLabel: "Subscribe",
            actionType: "submit",
            actionStatus: "loading",
            actionStatusLabels: { loading: "Sending…" },
          }),
        ),
      );
    });
    act(() => {
      container?.querySelector("button")?.click();
    });
    expect(sends).toBe(0);
  });

  it("actionStatus in lg keeps the 40px track height", () => {
    const { action } = mount({ size: "lg", actionStatus: "success", actionStatusLabels: { success: "Sent" } });
    const classes = action.className.split(/\s+/);
    expect(action.textContent).toBe("Sent");
    expect(classes).toContain("!min-h-10");
    expect(classes).toContain("!overflow-visible");
  });
});
