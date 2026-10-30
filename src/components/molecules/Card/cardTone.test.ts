import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

const card = (tone?: "default" | "inverse" | "field" | "light") =>
  renderToString(createElement(Card, { tone, padding: "md", children: "Quote" }));

describe("Card tone", () => {
  it("sets the same scopes Band uses, so everything inside re-skins", () => {
    expect(card("inverse")).toMatch(/data-tone="inverse"/);
    expect(card("inverse")).toMatch(/data-theme="dark"/);
    expect(card("field")).toMatch(/data-tone="field"/);
    expect(card("field")).not.toMatch(/data-theme=/);
    expect(card("light")).toMatch(/data-theme="light"/);
  });

  it("adds nothing by default: the card takes its section's colours", () => {
    expect(card()).not.toMatch(/data-tone=|data-theme=/);
    expect(card("default")).not.toMatch(/data-tone=|data-theme=/);
  });

  it("can scope the light palette, so a light card sits on a dark or toned section", () => {
    for (const sheet of ["../../../theme/colors.css", "../../../theme/stateColors.css"]) {
      const css = readFileSync(new URL(sheet, import.meta.url), "utf8");
      expect(css, sheet).toMatch(/:root,\s*\[data-theme="light"\]\s*\{/);
    }
  });
});
