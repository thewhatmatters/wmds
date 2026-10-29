import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Container width (rule 10): the page caps at --grid-max with its margins inside the cap, so the
 * content is 1232px wide and keeps 24px or more of margin at every desktop width, 1232–1280px
 * included (W5, W6). The cap is a max width, never a fixed width (W4).
 */
const css = readFileSync(path.resolve(__dirname, "grid.css"), "utf8");
const block = (selector: string) => css.slice(css.indexOf(selector)).split("}")[0];
const baseline = 8;

describe("container width", () => {
  it("caps at 80rem with the margin inside the cap: 1232px of content (W5)", () => {
    expect(css).toMatch(/--grid-max:\s*80rem;/);
    const page = block("@utility grid-page {");
    expect(page).toMatch(/max-width:\s*var\(--grid-max\)/);
    expect(page).toMatch(/width:\s*100%/);
    expect(page).toMatch(/padding-inline:\s*var\(--grid-margin\)/);
    expect(page).not.toMatch(/(^|[^-])width:\s*\d+(px|rem)/);
    expect(1280 - 2 * 3 * baseline).toBe(1232);
  });

  it("margins: 16px on phones, 24px from md, so 1232–1280px keeps 24px (W3, W6)", () => {
    expect(css).toMatch(/--grid-margin:\s*calc\(var\(--grid-baseline\) \* 2\);/);
    const md = css.slice(css.indexOf("@media (min-width: 768px)")).split("}")[0];
    expect(md).toMatch(/--grid-margin:\s*calc\(var\(--grid-baseline\) \* 3\);/);
    // Nothing above md shrinks the margin again.
    expect(css.match(/--grid-margin:/g)).toHaveLength(2);
  });
});
