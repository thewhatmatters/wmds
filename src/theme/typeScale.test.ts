import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { geometricScale } from "../lib/typography";

/** The size ramp: the steps typography.css declares are the ones the docs list, and 4rem is one of them. */
const css = readFileSync(path.resolve(__dirname, "typography.css"), "utf8");
const declared = [...css.matchAll(/^\s*(--font-size-[\w-]+):\s*([\d.]+rem);/gm)].map(([, token, value]) => ({ token, value }));

describe("type scale", () => {
  it("lists every --font-size step with the value typography.css sets", () => {
    expect(declared.length).toBeGreaterThan(0);
    expect(geometricScale.map(({ token, value }) => ({ token, value }))).toEqual(declared);
  });

  it("has a 4rem step, so a 64px link or heading needs no raw size", () => {
    expect(declared).toContainEqual({ token: "--font-size-7xl", value: "4rem" });
  });

  it("only grows", () => {
    const sizes = declared.map(({ value }) => Number(value.replace("rem", "")));
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });
});
