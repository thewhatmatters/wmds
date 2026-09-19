import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import { introOwnerCopySource, introPublicCopySource } from "./introCopySource";
import {
  PITCHKIT_INTRO_HARD_LIMIT,
  PITCHKIT_INTRO_SOFT_LIMIT,
  introFromState,
  pitchKitIntroAtLength,
  pitchKitIntroFilled,
  pitchKitIntroIsEmpty,
  pitchKitIntroStatus,
} from "./pitchKitData";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKitIntro.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitIntro.tsx"),
  "utf8",
);
const usageSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const introStyleKeys = [
  ...exampleSource.matchAll(/^\s+(pitchKit\w+(?:Classes|Px)),?$/gm),
].map((match) => match[1]);

const sharedStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
  "pitchKitIdentityNameplateClasses",
  "pitchKitIntroStackClasses",
] as const;

const outOfPattern = [
  "ExampleGridControls",
  "GridOverlay",
  "Coming soon",
  'label="Followers"',
  "Engagement rate",
  "Chart.",
  "Selected posts",
  "Past brands",
  "hello@averymorgan.com",
  "averymorgan.com",
  "Los Angeles",
  "heatmap",
  "EXAMPLE",
  "rates",
  "website",
  "biography",
] as const;

describe("Pattern — intro Show code", () => {
  it("wires both Pattern stories to the shared freezes", () => {
    expect(storiesSource).toContain('name: "Pattern — intro (owner)"');
    expect(storiesSource).toContain('name: "Pattern — intro (public)"');
    expect(storiesSource).toContain("introOwnerCopySource");
    expect(storiesSource).toContain("introPublicCopySource");
    expect(usageSource).toContain("Pattern — intro (owner)");
    expect(usageSource).toContain("Pattern — intro (public)");
  });

  it("interpolates every intro-example pitchKitStyles token into a freeze", () => {
    expect(introStyleKeys.length).toBeGreaterThan(3);
    const combined = `${introOwnerCopySource}\n${introPublicCopySource}`;
    for (const key of introStyleKeys) {
      const value = pitchKitStyles[key as keyof typeof pitchKitStyles];
      expect(String(value).length, key).toBeGreaterThan(0);
      expect(combined, key).toContain(String(value));
    }
  });

  it("locks owner editor copy, limits, and nameplate tokens", () => {
    for (const key of [...sharedStyleKeys, "pitchKitTopbarEndClasses"] as const) {
      expect(introOwnerCopySource, key).toContain(String(pitchKitStyles[key]));
    }
    expect(introOwnerCopySource).toContain("export function IntroOwnerPage");
    expect(introOwnerCopySource).toContain(creatorIdentityStripCopySource.trim());
    expect(introOwnerCopySource).toContain('label="Intro"');
    expect(introOwnerCopySource).toContain(
      "Shown on your Pitchkit. This is not your Instagram bio.",
    );
    expect(introOwnerCopySource).toContain(
      "What you create and who you create it for",
    );
    expect(introOwnerCopySource).toContain("Add an intro");
    expect(introOwnerCopySource).toContain('role="ghost"');
    expect(introOwnerCopySource).toContain("PITCHKIT_INTRO_SOFT_LIMIT = 160");
    expect(introOwnerCopySource).toContain("PITCHKIT_INTRO_HARD_LIMIT = 280");
    expect(introOwnerCopySource).toContain("maxLength={PITCHKIT_INTRO_HARD_LIMIT}");
    expect(introOwnerCopySource).toContain("<TextArea");
    expect(introOwnerCopySource).not.toContain("Connected Instagram");
    expect(introOwnerCopySource).not.toContain("Share kit");
  });

  it("locks public show/omit under the nameplate", () => {
    for (const key of [...sharedStyleKeys, "pitchKitIntroClasses"] as const) {
      expect(introPublicCopySource, key).toContain(String(pitchKitStyles[key]));
    }
    expect(introPublicCopySource).toContain("export function IntroPublicPage");
    expect(introPublicCopySource).toContain(creatorIdentityStripCopySource.trim());
    expect(introPublicCopySource).toContain("pitchKitIntroIsEmpty(intro) ? null");
    expect(introPublicCopySource).not.toContain("Add an intro");
    expect(introPublicCopySource).not.toContain("<TextArea");
    expect(introPublicCopySource).not.toContain("MoreMenu");
  });

  it("omits kit body, Insights, and Storybook-only chrome", () => {
    const combined = `${introOwnerCopySource}\n${introPublicCopySource}`;
    for (const token of outOfPattern) {
      expect(combined, token).not.toContain(token);
    }
    expect(combined).not.toContain("ExampleGridControls");
    expect(combined).not.toContain("parameters:");
    expect(combined).not.toContain("export const");
  });
});

describe("intro field contract", () => {
  it("treats blank copy as empty and caps status at the locked limits", () => {
    expect(pitchKitIntroIsEmpty("")).toBe(true);
    expect(pitchKitIntroIsEmpty("   ")).toBe(true);
    expect(pitchKitIntroIsEmpty(pitchKitIntroFilled)).toBe(false);
    expect(introFromState("empty")).toBe("");
    expect(introFromState("filled")).toBe(pitchKitIntroFilled);
    expect(introFromState("softLimit")).toBe(
      pitchKitIntroAtLength(PITCHKIT_INTRO_SOFT_LIMIT),
    );
    expect(introFromState("hardLimit")).toBe(
      pitchKitIntroAtLength(PITCHKIT_INTRO_HARD_LIMIT),
    );
    expect(introFromState("softLimit")).toHaveLength(PITCHKIT_INTRO_SOFT_LIMIT);
    expect(introFromState("hardLimit")).toHaveLength(PITCHKIT_INTRO_HARD_LIMIT);
    expect(pitchKitIntroStatus("short")).toBeUndefined();
    expect(pitchKitIntroStatus(introFromState("softLimit"))).toBe("warning");
    expect(pitchKitIntroStatus(introFromState("hardLimit"))).toBe("error");
    expect(pitchKitIntroFilled.length).toBeLessThan(PITCHKIT_INTRO_SOFT_LIMIT);
    expect(pitchKitIntroFilled.toLowerCase()).not.toContain("instagram");
  });
});
