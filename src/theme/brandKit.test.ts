import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, mixSrgb, textContrastMinimum } from "../lib/contrast";
import { brandKitClient } from "../foundation/brandKitClient";

const css = (name: string) => readFileSync(path.resolve(__dirname, name), "utf8");

describe("brand kit", () => {
  it("defaults clear 4.5:1: navy brand surface, primary field, in both themes", () => {
    const navy = "#011272";
    expect(contrastRatio("#ffffff", navy)).toBeGreaterThan(textContrastMinimum);
    expect(contrastRatio(mixSrgb("#ffffff", 0.72, navy), navy)).toBeGreaterThan(textContrastMinimum);
    // Field defaults to the primary pair; its muted step is the ink itself.
    expect(contrastRatio("#fafafa", "#39485c")).toBeGreaterThan(textContrastMinimum);
    expect(contrastRatio("#fafaf8", "#5a6d85")).toBeGreaterThan(textContrastMinimum);
  });

  it("defaults are wired the way the contrast test assumes", () => {
    const colors = css("colors.css");
    // The navy itself (not var(--color-brand), which is lifted in dark), set once on :root.
    expect(colors).toContain("--color-brand-surface: #011272;");
    expect(colors).toContain("--color-on-brand-surface: var(--color-on-brand);");
    expect(colors.replace(/\s+/g, " ")).toContain(
      "--color-on-brand-surface-muted, color-mix(in srgb, var(--color-on-brand-surface) 72%, var(--color-brand-surface))",
    );
    expect(colors).toContain("--color-field: var(--color-primary);");
    expect(colors).toContain("var(--color-on-field-muted, var(--color-on-field))");
  });

  it("the reference client clears 4.5:1 on every pair", () => {
    for (const pair of brandKitClient.pairs) {
      expect(contrastRatio(pair.ink, pair.background), `${pair.label}`).toBeGreaterThanOrEqual(textContrastMinimum);
    }
  });

  it("tones remap the roles components read, including the ones stateColors derives on :root", () => {
    const colors = css("colors.css");
    const tone = colors.slice(colors.indexOf('[data-tone="inverse"],\n[data-tone="field"] {'));
    for (const role of [
      "--color-background-body",
      "--color-background-surface",
      "--color-text-primary",
      "--color-text-secondary",
      "--color-border",
      "--color-border-control",
      "--color-focus-ring",
      "--color-ghost-foreground",
      "--color-secondary-hover",
      "--color-skeleton",
    ]) {
      expect(tone).toContain(`${role}:`);
    }
  });

  it("every display step reads the display knobs", () => {
    const typography = css("typography.css");
    for (const step of ["hero", "xl", "1", "2", "3"]) {
      const block = typography.slice(typography.indexOf(`@utility type-display-${step} {`)).split("}")[0];
      expect(block).toContain("var(--font-display, var(--font-family-heading))");
      expect(block).toContain("var(--font-display-weight,");
      expect(block).toContain("var(--font-display-tracking");
      expect(block).toContain("var(--font-display-case)");
    }
  });
});
