/** @vitest-environment happy-dom */
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "./Toast";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("Toaster hydration", () => {
  it("renders nothing on the server and mounts its list after hydration, without a mismatch", async () => {
    const tree = () => createElement("main", null, createElement("p", null, "Page"), createElement(Toaster));
    const html = renderToString(tree());
    expect(html).not.toContain("Notifications");

    const errors: unknown[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      errors.push(args);
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = html;
    await act(async () => {
      hydrateRoot(container, tree(), { onRecoverableError: (error) => errors.push(error) });
    });

    expect(errors).toEqual([]);
    expect(document.body.querySelector("ol[aria-label='Notifications']")).not.toBeNull();
  });
});
