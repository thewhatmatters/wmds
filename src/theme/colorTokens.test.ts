import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../lib/contrast";

/**
 * Colour fixes found by building every component in light and dark (Wonder import, 2026-10-29).
 * Reads the tokens from the CSS, so a palette change re-checks itself.
 */
const colors = readFileSync(new URL("./colors.css", import.meta.url), "utf8");
const state = readFileSync(new URL("./stateColors.css", import.meta.url), "utf8");
const block = (css: string, selector: string) => css.slice(css.indexOf(selector)).split("}")[0]!;
const token = (scope: string, name: string) =>
  block(colors, scope).match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})\\b`, "i"))?.[1] ?? "";

const LIGHT = ':root,\n[data-theme="light"] {';
const DARK = '[data-theme="dark"] {';

describe("colour tokens", () => {
  it("never mixes above 100% (the browser drops the whole declaration)", () => {
    for (const css of [colors, state]) {
      for (const [, percent] of css.matchAll(/(\d+(?:\.\d+)?)%/g)) expect(Number(percent)).toBeLessThanOrEqual(100);
    }
  });

  for (const scope of [LIGHT, DARK]) {
    it(`secondary fill separates from the body and the surface (${scope.includes("dark") ? "dark" : "light"})`, () => {
      const fill = token(scope, "accent-muted");
      expect(fill).not.toBe("");
      expect(contrastRatio(fill, token(scope, "background-body"))).toBeGreaterThanOrEqual(1.1);
      expect(contrastRatio(fill, token(scope, "background-surface"))).toBeGreaterThanOrEqual(1.1);
    });
  }

  it("dark brand reads on the dark body and surface, and white reads on it", () => {
    const brand = token(DARK, "brand");
    expect(contrastRatio(brand, token(DARK, "background-body"))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(brand, token(DARK, "background-surface"))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(token(DARK, "on-brand"), brand)).toBeGreaterThanOrEqual(4.5);
    // Inverse bands keep the deep navy in dark: the surface is set once on :root, not per theme,
    // so a client's own --color-brand-surface still wins inside an inverse band (it carries data-theme="dark").
    expect(token(LIGHT, "brand-surface")).toBe("#011272");
    expect(block(colors, DARK)).not.toContain("--color-brand-surface:");
  });

  it("inverts the primary on a field band, so a primary Button never matches the band", () => {
    const field = block(colors, '[data-tone="field"] {');
    expect(field).toContain("--tone-action: var(--tone-fg);");
    expect(field).toContain("--tone-on-action: var(--tone-bg);");
    const tones = block(colors, '[data-tone="inverse"],\n[data-tone="field"] {');
    expect(tones).toContain("--color-primary: var(--tone-action);");
    expect(tones).toContain("--color-on-primary: var(--tone-on-action);");
    // Hover and active follow the band after stateColors.css's theme blocks (an inverse band is also dark).
    const states = state;
    const toneStates = block(states, '[data-tone="inverse"],\n[data-tone="field"] {');
    expect(states.lastIndexOf('[data-tone="inverse"]')).toBeGreaterThan(states.lastIndexOf('[data-theme="dark"]'));
    expect(toneStates).toMatch(/--color-primary-hover: color-mix\([^;]*var\(--tone-action\)/);
    expect(toneStates).toMatch(/--color-primary-active: color-mix\([^;]*var\(--tone-action\)/);
  });

  it("inverts the primary on an inverse band too, unless the brand kit sets its own (gap 4)", () => {
    const inverse = block(colors, '[data-tone="inverse"] {');
    expect(inverse).toContain("--tone-action: var(--color-brand-surface-primary, var(--tone-fg));");
    expect(inverse).toContain("--tone-on-action: var(--color-on-brand-surface-primary, var(--tone-bg));");
  });
});
