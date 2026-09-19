import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PITCHKIT_THEME_DEFAULT,
  pitchKitThemes,
} from "./pitchKitData";
import * as pitchKitStyles from "./pitchKitStyles";
import { themePickerOwnerCopySource } from "./themePickerCopySource";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKitTheme.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitThemePicker.tsx"),
  "utf8",
);
const usageSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const themeStyleKeys = [
  ...exampleSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

describe("Pattern — theme picker (owner) Show code", () => {
  it("wires the Pattern story and catalog", () => {
    expect(storiesSource).toContain('name: "Pattern — theme picker (owner)"');
    expect(storiesSource).toContain("themePickerOwnerCopySource");
    expect(storiesSource).toContain("export const ThemePickerOwner");
    expect(usageSource).toContain("Pattern — theme picker (owner)");
  });

  it("interpolates every theme-picker pitchKitStyles token", () => {
    expect(themeStyleKeys.length).toBeGreaterThan(8);
    for (const key of themeStyleKeys) {
      const value = pitchKitStyles[key as keyof typeof pitchKitStyles];
      expect(String(value).length, key).toBeGreaterThan(0);
      expect(themePickerOwnerCopySource, key).toContain(String(value));
    }
  });

  it("freezes explicit Save, enum, and public-kit preview", () => {
    expect(themePickerOwnerCopySource).toContain("export function ThemePickerOwnerPage");
    expect(themePickerOwnerCopySource).toContain("Save theme");
    expect(themePickerOwnerCopySource).toContain('aria-label="Kit theme"');
    expect(themePickerOwnerCopySource).toContain('["light", "dark", "soft"]');
    expect(themePickerOwnerCopySource).toContain('useState("light")');
    expect(themePickerOwnerCopySource).toContain("data-theme={draftTheme}");
    expect(themePickerOwnerCopySource).toContain("showCreateBand={false}");
    expect(themePickerOwnerCopySource).toContain("<ShareablePitchKit");
    expect(themePickerOwnerCopySource).toContain("Public kit preview");
    expect(themePickerOwnerCopySource).toContain("Changes apply when you save.");
    expect(themePickerOwnerCopySource).toContain("disabled={!dirty}");
    expect(themePickerOwnerCopySource).toContain("Theme saved");
  });

  it("omits auto-save, invented metrics, and Storybook-only chrome", () => {
    expect(themePickerOwnerCopySource).not.toContain("ExampleGridControls");
    expect(themePickerOwnerCopySource).not.toContain("GridOverlay");
    expect(themePickerOwnerCopySource).not.toContain("heatmap");
    expect(themePickerOwnerCopySource).not.toContain("EXAMPLE");
    expect(themePickerOwnerCopySource).not.toContain("impressions");
    expect(exampleSource).toContain("Save theme");
    expect(exampleSource).not.toContain("onValueChange={setSavedTheme}");
  });
});

describe("kit theme enum", () => {
  it("locks light | dark | soft with default light", () => {
    expect(pitchKitThemes).toEqual(["light", "dark", "soft"]);
    expect(PITCHKIT_THEME_DEFAULT).toBe("light");
  });
});
