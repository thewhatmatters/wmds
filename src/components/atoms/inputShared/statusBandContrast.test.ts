import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, mixSrgb } from "../../../lib/contrast";

/**
 * Errors and validation V7: the status band's message clears 4.5:1 on the band, in light and dark, for
 * error, warning and success. Reads the tokens from colors.css, so a palette change re-checks itself.
 */
const css = readFileSync(path.resolve(__dirname, "../../../theme/colors.css"), "utf8");
const block = (selector: string) => css.slice(css.indexOf(selector)).split("}")[0];
const token = (scope: string, name: string) => block(scope).match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6,8})`, "i"))?.[1] ?? "";

describe("status band contrast (V7)", () => {
  for (const [theme, scope, page] of [["light", ":root {", "#f8f8f8"], ["dark", '[data-theme="dark"] {', "#1b1b1b"]] as const) {
    for (const tone of ["error", "warning", "success"] as const) {
      it(`${theme} ${tone}: message on its band ≥ 4.5:1`, () => {
        const ink = token(scope, tone);
        const muted = token(scope, `${tone}-muted`);
        const alpha = muted.length === 9 ? parseInt(muted.slice(7), 16) / 255 : 1;
        const band = mixSrgb(muted.slice(0, 7), alpha, page);
        expect(contrastRatio(ink, band)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
