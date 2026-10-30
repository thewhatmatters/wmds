import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell aside on the server", () => {
  it("renders no overlay for an open docked or inset aside before the desktop query runs (no hydration mismatch)", () => {
    for (const asideMode of ["docked", "inset"] as const) {
      const html = renderToString(
        createElement(AppShell, {
          title: "Gallery",
          asideMode,
          defaultAsideOpen: true,
          asideTitle: "Type panel",
          aside: createElement("p", null, "Font fields"),
          toolbar: createElement("p", null, "View toolbar"),
        }),
      );
      expect(html).not.toContain("Font fields");
      expect(html).toContain("View toolbar");
    }
  });
});
