import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./colors.css", import.meta.url), "utf8");

/** The declarations of the first rule whose selector is exactly `selector`. */
function ruleBody(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf("}", start));
}

describe("color-scheme", () => {
  it("follows the theme, so native scrollbars, controls and autofill match", () => {
    expect(ruleBody(":root")).toContain("color-scheme: light;");
    expect(ruleBody('[data-theme="dark"]')).toContain("color-scheme: dark;");
  });
});
