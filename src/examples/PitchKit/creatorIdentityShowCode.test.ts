import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  creatorIdentityOwnerCopySource,
  creatorIdentityPublicCopySource,
  creatorIdentityStripCopySource,
} from "./creatorIdentityCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKitCreatorIdentity.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitCreatorIdentity.tsx"),
  "utf8",
);
const usageSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const identityStyleKeys = [
  ...exampleSource.matchAll(/^\s+(pitchKit\w+(?:Classes|Px)),?$/gm),
].map((match) => match[1]);

const sharedStripStyleKeys = [
  "pitchKitIdentityRowClasses",
  "pitchKitIdentityCopyClasses",
  "pitchKitIdentityTitleRowClasses",
  "pitchKitIdentityNameClasses",
  "pitchKitSupportingClasses",
] as const;

const publicStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
  "pitchKitIdentityNameplateClasses",
  ...sharedStripStyleKeys,
] as const;

const ownerStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitTopbarEndClasses",
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
  "pitchKitHeaderSectionClasses",
  "pitchKitHeaderCopyClasses",
  "pitchKitSettingsCardClasses",
  "pitchKitSettingsBodyClasses",
  "pitchKitShareKitStackClasses",
  "pitchKitShareKitActionsClasses",
  "pitchKitSectionEyebrowClasses",
  "pitchKitConnectionMetaClasses",
  ...sharedStripStyleKeys,
] as const;

const outOfPattern = [
  "ExampleGridControls",
  "GridOverlay",
  "Coming soon",
  "label=\"Followers\"",
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
] as const;

describe("Pattern — creator identity Show code", () => {
  it("wires both Pattern stories to the shared freezes", () => {
    expect(storiesSource).toContain('name: "Pattern — creator identity (public)"');
    expect(storiesSource).toContain(
      'name: "Pattern — creator identity (owner settings)"',
    );
    expect(storiesSource).toContain("creatorIdentityPublicCopySource");
    expect(storiesSource).toContain("creatorIdentityOwnerCopySource");
    expect(usageSource).toContain("Pattern — creator identity (public)");
    expect(usageSource).toContain("Pattern — creator identity (owner settings)");
  });

  it("interpolates every identity-example pitchKitStyles token into a freeze", () => {
    expect(identityStyleKeys.length).toBeGreaterThan(12);
    const combined = `${creatorIdentityPublicCopySource}\n${creatorIdentityOwnerCopySource}\n${creatorIdentityStripCopySource}`;
    for (const key of identityStyleKeys) {
      if (key.endsWith("Px") || key.includes("Skeleton")) continue;
      const value = pitchKitStyles[key as keyof typeof pitchKitStyles];
      expect(String(value).length, key).toBeGreaterThan(0);
      expect(combined, key).toContain(String(value));
    }
  });

  it("locks public nameplate tokens on the public freeze", () => {
    for (const key of publicStyleKeys) {
      expect(creatorIdentityPublicCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(creatorIdentityPublicCopySource).toContain(
      "export function CreatorIdentityPublicPage",
    );
    expect(creatorIdentityPublicCopySource).toContain('nameAs="h1"');
    expect(creatorIdentityPublicCopySource).toContain("showProfessionalChip");
    expect(creatorIdentityPublicCopySource).toContain("Chip readOnly");
    expect(creatorIdentityPublicCopySource).not.toContain("Share kit");
    expect(creatorIdentityPublicCopySource).not.toContain("Connected Instagram");
    expect(creatorIdentityPublicCopySource).not.toContain("Last synced");
  });

  it("locks owner Settings tokens on the owner freeze", () => {
    for (const key of ownerStyleKeys) {
      expect(creatorIdentityOwnerCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(creatorIdentityOwnerCopySource).toContain(
      "export function CreatorIdentityOwnerSettingsPage",
    );
    expect(creatorIdentityOwnerCopySource).toContain("Connected Instagram");
    expect(creatorIdentityOwnerCopySource).toContain("Share kit");
    expect(creatorIdentityOwnerCopySource).toContain("`/k/${identity.handle}`");
    expect(creatorIdentityOwnerCopySource).toContain("Copy");
    expect(creatorIdentityOwnerCopySource).toContain("Last synced");
    expect(creatorIdentityOwnerCopySource).toContain('title="Settings"');
    expect(creatorIdentityOwnerCopySource).toContain('nameAs="p"');
    expect(creatorIdentityOwnerCopySource).toContain("toast.add");
  });

  it("keeps one fail-closed identity strip in both freezes", () => {
    expect(creatorIdentityPublicCopySource).toContain(
      creatorIdentityStripCopySource.trim(),
    );
    expect(creatorIdentityOwnerCopySource).toContain(
      creatorIdentityStripCopySource.trim(),
    );
    expect(creatorIdentityStripCopySource).toContain(
      "identity.displayName != null",
    );
    expect(creatorIdentityStripCopySource).toContain(
      "identity.followersCount == null",
    );
    expect(creatorIdentityStripCopySource).toContain(
      "identity.displayName ?? identity.handle",
    );
    expect(creatorIdentityStripCopySource).toContain("followers");
    expect(creatorIdentityStripCopySource).not.toContain("<Stat");
  });

  it("omits kit body, Insights, and Storybook-only chrome", () => {
    const combined = `${creatorIdentityPublicCopySource}\n${creatorIdentityOwnerCopySource}`;
    for (const token of outOfPattern) {
      expect(combined, token).not.toContain(token);
    }
  });
});

describe("creator identity fail-closed states", () => {
  it("omits unlocked Graph fields instead of inventing them", async () => {
    const { identityFromState } = await import("./pitchKitData");
    expect(identityFromState("loading")).toBeNull();
    expect(identityFromState("missingPhoto")?.profilePictureUrl).toBeUndefined();
    expect(identityFromState("missingPhoto")?.displayName).toBe("Avery Morgan");
    expect(identityFromState("missingName")?.displayName).toBeUndefined();
    expect(identityFromState("missingName")?.handle).toBe("averymorgan");
    expect(identityFromState("resolved")?.followersCount).toBe(84200);
  });
});
