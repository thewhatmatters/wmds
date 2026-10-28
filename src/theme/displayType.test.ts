import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./typography.css", import.meta.url), "utf8");
const token = (name: string) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();

describe("Display rule D1/D2 tokens (Product Designer, 2026-10-28)", () => {
  it.each([
    ["text-display-1-leading", "1.05"],
    ["text-display-2-leading", "1.1"],
    ["text-display-3-leading", "1.15"],
    ["text-display-hero-tracking", "-0.03em"],
    ["text-display-1-tracking", "-0.03em"],
    ["text-display-2-tracking", "-0.02em"],
    ["text-display-3-tracking", "-0.01em"],
  ])("%s is %s", (name, value) => expect(token(name)).toBe(value));

  it("every display step reads its own tracking unless a brand sets the knob", () => {
    for (const step of ["hero", "xl", "1", "2", "3"]) {
      const block = css.slice(css.indexOf(`@utility type-display-${step} {`));
      expect(block.slice(0, block.indexOf("}"))).toContain(`var(--font-display-tracking, var(--text-display-${step}-tracking))`);
    }
  });
});
