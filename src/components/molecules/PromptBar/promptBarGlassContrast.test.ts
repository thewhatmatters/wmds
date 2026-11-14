import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, mixSrgb, textContrastMinimum } from "../../../lib/contrast";
import { promptBarGlassPlaceholderStrength } from "./promptBarStyles";

/** Reads the tokens from the CSS, so a palette or tint change re-checks itself. */
describe("PromptBar glass contrast", () => {
  it("keeps the placeholder and typed text at AA over any backdrop, at the default tints", () => {
    const colors = readFileSync(new URL("../../../theme/colors.css", import.meta.url), "utf8");
    const themes = { light: ':root,\n[data-theme="light"] {', dark: '[data-theme="dark"] {' };
    for (const selector of Object.values(themes)) {
      const block = colors.slice(colors.indexOf(selector)).split("}")[0]!;
      const read = (name: string) => block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})\\b`, "i"))?.[1] ?? "";
      const surface = read("color-background-surface");
      const text = read("color-text-primary");
      const tint = Number.parseFloat(block.match(/--card-glass-tint-default:\s*([\d.]+)%/)?.[1] ?? "") / 100;
      expect(surface && text && tint).toBeTruthy();
      for (const backdrop of ["#ffffff", "#000000"]) {
        const pane = mixSrgb(surface, tint, backdrop);
        const placeholder = mixSrgb(text, promptBarGlassPlaceholderStrength, pane);
        expect(contrastRatio(placeholder, pane)).toBeGreaterThanOrEqual(textContrastMinimum);
        expect(contrastRatio(text, pane)).toBeGreaterThanOrEqual(textContrastMinimum);
      }
    }
  });
});
