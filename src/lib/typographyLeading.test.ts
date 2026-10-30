import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { astryxTypeScale } from "./typography";

const css = readFileSync(new URL("../theme/typography.css", import.meta.url), "utf8");

describe("type scale metadata", () => {
  it("lists the same line heights (to two places) as typography.css", () => {
    for (const { type, leading } of astryxTypeScale) {
      const value = css.match(new RegExp(`--text-${type}-leading:\\s*([0-9.]+);`))?.[1];
      // The table rounds to two places (1.3333 is listed as 1.33).
      if (value) expect(Number(leading), type).toBeCloseTo(Number(value), 2);
    }
  });
});
