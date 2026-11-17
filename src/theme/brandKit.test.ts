import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, mixSrgb, textContrastMinimum } from "../lib/contrast";
import { brandKitClient, brandKitPaper } from "../foundation/brandKitClient";

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

  it("the page-colour knobs feed the light roles, with the WMDS greys as the fallbacks", () => {
    const colors = css("colors.css");
    const light = colors.slice(0, colors.indexOf('[data-theme="dark"] {'));
    for (const role of [
      "--color-background-body: var(--color-paper, #f8f8f8);",
      "--color-background-muted: var(--color-paper, #f8f8f8);",
      "--color-text-primary: var(--color-on-paper, #171717);",
      "--color-text-secondary: var(--paper-muted, #404040);",
      "--color-text-placeholder: var(--paper-muted, #6e6e6e);",
      "--color-border: var(--color-paper-rule, rgb(42 36 28 / 6%));",
      "--color-border-emphasized: var(--color-paper-rule, var(--paper-rule, #d9d9d9));",
      "--color-border-control: var(--paper-control, #8c8c8c);",
    ]) {
      expect(light, role).toContain(role);
    }
    // The derived steps mix with a bare var(--color-paper): unset, the mix is invalid and the grey fallback wins.
    for (const step of ["--paper-rule", "--paper-fill", "--paper-control"]) {
      expect(light).toMatch(new RegExp(`${step}: color-mix\\(in srgb, var\\(--color-on-paper, #171717\\) \\d+%, var\\(--color-paper\\)\\);`));
    }
    expect(light.replace(/\s+/g, " ")).toContain(
      "--paper-muted: var( --color-on-paper-muted, color-mix(in srgb, var(--color-on-paper, #171717) 72%, var(--color-paper)) );",
    );
    // Dark, soft and the tones keep their own page.
    expect(colors.slice(colors.indexOf('[data-theme="dark"] {'))).not.toMatch(/--color-(on-)?paper\b|--paper-/);
  });

  it("the steps derived from a paper clear contrast: muted text 4.5:1, control edges 3:1", () => {
    const papers = [
      { paper: brandKitPaper.paper, ink: brandKitPaper.ink },
      // A paper alone keeps the WMDS ink.
      { paper: brandKitPaper.paper, ink: "#171717" },
      { paper: "#eeede6", ink: "#171717" },
      { paper: "#fbf3e4", ink: "#3a1d14" },
    ];
    for (const { paper, ink } of papers) {
      const muted = mixSrgb(ink, 0.72, paper);
      expect(contrastRatio(muted, paper), `muted on ${paper}`).toBeGreaterThanOrEqual(textContrastMinimum);
      expect(contrastRatio(muted, "#ffffff"), `muted on a card`).toBeGreaterThanOrEqual(textContrastMinimum);
      expect(contrastRatio(mixSrgb(ink, 0.52, paper), paper), `control edge on ${paper}`).toBeGreaterThanOrEqual(3);
      // The rule and the fill stay quiet: seen, never a second ink.
      expect(contrastRatio(mixSrgb(ink, 0.16, paper), paper)).toBeGreaterThan(1.2);
      expect(contrastRatio(mixSrgb(ink, 0.06, paper), paper)).toBeGreaterThan(1.05);
    }
  });

  it("the reference paper clears 4.5:1 for its ink and muted text, on the page and on a card", () => {
    for (const ink of [brandKitPaper.ink, brandKitPaper.muted]) {
      expect(contrastRatio(ink, brandKitPaper.paper), ink).toBeGreaterThanOrEqual(textContrastMinimum);
      expect(contrastRatio(ink, "#ffffff"), ink).toBeGreaterThanOrEqual(textContrastMinimum);
    }
    expect(contrastRatio(brandKitPaper.rule, brandKitPaper.paper)).toBeGreaterThan(1.2);
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
