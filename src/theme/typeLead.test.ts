import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { typographyClass } from "../lib/typography";

/** Lead paragraph rule L7: about 1.2–1.3× the 17px reading body, regular weight, never a one-off size. */
const css = readFileSync(path.resolve(__dirname, "typography.css"), "utf8");
const rem = (value: string) => Number(value.replace("rem", "")) * 16;

describe("type-lead (L7)", () => {
  it("runs 18px on phones to 21px, 1.2–1.3× the 17px body at its widest", () => {
    const [, min, , max] = css.match(/--text-lead-size:\s*clamp\(([\d.]+rem),\s*(calc\([^)]*\)),\s*([\d.]+rem)\)/) ?? [];
    expect(rem(min)).toBe(18);
    expect(rem(max) / 17).toBeGreaterThanOrEqual(1.2);
    expect(rem(max) / 17).toBeLessThanOrEqual(1.3);
  });

  it("is regular weight and has its utility and role", () => {
    expect(css).toMatch(/--text-lead-weight:\s*var\(--font-weight-normal\)/);
    expect(css).toMatch(/@utility type-lead \{/);
    expect(typographyClass("lead")).toContain("type-lead");
  });

  it("sets running text steps to text-wrap: pretty, so a lone word doesn't end a paragraph", () => {
    for (const step of ["lead", "large", "body", "reading"]) {
      const block = css.slice(css.indexOf(`@utility type-${step} {`));
      expect(block.slice(0, block.indexOf("}")), step).toMatch(/text-wrap:\s*pretty/);
    }
  });
});
