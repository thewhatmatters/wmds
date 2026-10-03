import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ownerPitchKitBodyCopySource,
  ownerPitchKitPageCopySource,
} from "./ownerPitchKitCopySource";
import { cardLayoutHeaderEndClasses } from "../../components/molecules/Card/cardStyles";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);
const ownerSource = readFileSync(
  join(import.meta.dirname, "PitchKitOwner.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitExample.tsx"),
  "utf8",
);

const ownerStyleKeys = [
  ...ownerSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

const pageStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitTopbarEndClasses",
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
] as const;

const ownerStoryStart = storiesSource.indexOf(
  'name: "Pattern — owner PitchKit"',
);

describe("Pattern — owner PitchKit Show code", () => {
  it("wires the Pattern story to the owner freeze", () => {
    expect(ownerStoryStart).toBeGreaterThan(-1);
    expect(storiesSource).toContain("ownerPitchKitPageCopySource");
    expect(storiesSource).toContain("Pattern — owner PitchKit");
    expect(exampleSource).toContain("<OwnerPitchKit");
    expect(exampleSource).not.toContain("Coming soon");
  });

  it("interpolates every OwnerPitchKit pitchKitStyles token", () => {
    expect(ownerStyleKeys.length).toBeGreaterThan(12);
    for (const key of ownerStyleKeys) {
      expect(ownerPitchKitBodyCopySource, key).toContain(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]),
      );
    }
  });

  it("locks owner page chrome and kit sections on the Pattern freeze", () => {
    for (const key of pageStyleKeys) {
      expect(ownerPitchKitPageCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(ownerPitchKitPageCopySource).toContain(
      "export function OwnerPitchKitPage",
    );
    expect(ownerPitchKitPageCopySource).toContain("<OwnerPitchKit");
    expect(ownerPitchKitPageCopySource).toContain("PitchKit primary navigation");
    expect(ownerPitchKitPageCopySource).toContain("My account");
    expect(ownerPitchKitPageCopySource).toContain("Privacy");
    expect(ownerPitchKitBodyCopySource).toContain("CreatorIdentityStrip");
    expect(ownerPitchKitBodyCopySource).toContain("Your Pitchkit");
    expect(ownerPitchKitBodyCopySource).toContain("Edit what brands see");
    expect(ownerPitchKitBodyCopySource).toContain("Instagram performance summary");
    expect(ownerPitchKitBodyCopySource).toContain("Selected posts");
    expect(ownerPitchKitBodyCopySource).toContain("Past brands");
    expect(ownerPitchKitBodyCopySource).toContain(
      "Creator-entered details for brand outreach",
    );
    expect(ownerPitchKitBodyCopySource).toContain('label="Followers"');
    expect(ownerPitchKitBodyCopySource).toContain('label="Engagement rate"');
    expect(ownerPitchKitBodyCopySource).toContain('label="Typical reach"');
    expect(ownerPitchKitBodyCopySource).toContain('label="Typical saves"');
    expect(ownerPitchKitBodyCopySource).toContain("Reach over 30 days");
    expect(ownerPitchKitBodyCopySource).toContain("Top countries");
    expect(ownerPitchKitBodyCopySource).toContain("Hide from kit");
    expect(ownerPitchKitBodyCopySource).toContain("Manage selected post");
    expect(ownerPitchKitBodyCopySource).toContain("toast.add");
    expect(ownerPitchKitBodyCopySource).toContain("<Card.Header");
    expect(ownerPitchKitBodyCopySource).toContain(
      `<Card.Header
                end={`,
    );
    expect(ownerSource).toContain(
      `<Card.Header
                end={`,
    );
    expect(cardLayoutHeaderEndClasses).toContain("ml-auto");
  });

  it("keeps the fail-closed identity strip and omits public Verified chips", () => {
    expect(ownerPitchKitBodyCopySource).toContain("identity.displayName != null");
    expect(ownerPitchKitBodyCopySource).toContain("showProfessionalChip");
    expect(ownerPitchKitBodyCopySource).not.toContain(">Verified<");
    expect(ownerPitchKitBodyCopySource).not.toContain("Instagram</Chip>");
  });

  it("omits swap, identity editors, theme tab chrome, and Storybook-only chrome", () => {
    const combined = `${ownerPitchKitBodyCopySource}\n${ownerPitchKitPageCopySource}`;
    expect(combined).not.toContain("ExampleGridControls");
    expect(combined).not.toContain("GridOverlay");
    expect(combined).not.toContain("Coming soon");
    expect(combined).not.toContain("Swap post");
    expect(combined).not.toContain("bio");
    expect(combined).not.toContain("rates");
    expect(combined).not.toContain('aria-label="Kit theme"');
    expect(combined).not.toContain("Save theme");
    expect(ownerPitchKitPageCopySource).not.toContain("export const");
    expect(ownerPitchKitPageCopySource).not.toContain("parameters:");
  });
});
