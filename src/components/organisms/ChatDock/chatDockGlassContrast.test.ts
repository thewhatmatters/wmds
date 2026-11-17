import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, mixSrgb, textContrastMinimum } from "../../../lib/contrast";
import { chatDockGlassWindowTintDefault } from "./chatDockStyles";

/** Reads the tokens from the CSS, so a palette change re-checks itself. */
describe("ChatDock glass window contrast", () => {
  it("keeps primary and secondary text at AA over any page, at the default tint", () => {
    const colors = readFileSync(new URL("../../../theme/colors.css", import.meta.url), "utf8");
    for (const selector of [':root,\n[data-theme="light"] {', '[data-theme="dark"] {']) {
      const block = colors.slice(colors.indexOf(selector)).split("}")[0]!;
      // The value, or the fallback of a brand-kit knob: `var(--color-on-paper, #171717)` reads as #171717.
      const read = (name: string) =>
        block.match(new RegExp(`--${name}:\\s*(?:var\\([^#;]*)?(#[0-9a-f]{6})\\b`, "i"))?.[1] ?? "";
      const surface = read("color-background-surface");
      const texts = [read("color-text-primary"), read("color-text-secondary")];
      expect(surface && texts.every(Boolean)).toBeTruthy();
      for (const backdrop of ["#ffffff", "#000000"]) {
        const pane = mixSrgb(surface, chatDockGlassWindowTintDefault, backdrop);
        for (const text of texts) expect(contrastRatio(text, pane)).toBeGreaterThanOrEqual(textContrastMinimum);
      }
    }
  });
});
