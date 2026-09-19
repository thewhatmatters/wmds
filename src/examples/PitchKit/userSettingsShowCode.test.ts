import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { userSettingsOwnerCopySource } from "./userSettingsCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKitAccount.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitUserSettings.tsx"),
  "utf8",
);
const usageSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const exampleStyleKeys = [
  ...exampleSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

const pageStyleKeys = [
  "pitchKitPageClasses",
  "pitchKitTopbarBandClasses",
  "pitchKitTopbarClasses",
  "pitchKitBrandClasses",
  "pitchKitTopbarEndClasses",
  "pitchKitUserSettingsBodyClasses",
  "pitchKitSettingsCardClasses",
  "pitchKitSettingsBodyClasses",
  "pitchKitShareKitStackClasses",
  "pitchKitShareKitActionsClasses",
  "pitchKitUserSettingsActionsClasses",
] as const;

const outOfPattern = [
  "ExampleGridControls",
  "GridOverlay",
  "Coming soon",
  "MoreMenu",
  "Hide from kit",
  "Swap post",
  "bio",
  "rates",
  "website",
] as const;

describe("Pattern — account settings (owner) Show code", () => {
  it("wires the Pattern story to the freeze", () => {
    expect(storiesSource).toContain('name: "Pattern — account settings (owner)"');
    expect(storiesSource).toContain("export const AccountSettingsOwner");
    expect(storiesSource).toContain("userSettingsOwnerCopySource");
    expect(usageSource).toContain("Pattern — account settings (owner)");
    expect(storiesSource.toLowerCase()).toContain("remove footer delete");
    expect(usageSource.toLowerCase()).toContain("remove footer delete");
  });

  it("interpolates every Account settings example pitchKitStyles token", () => {
    expect(exampleStyleKeys.length).toBeGreaterThan(6);
    for (const key of exampleStyleKeys) {
      expect(userSettingsOwnerCopySource, key).toContain(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]),
      );
    }
  });

  it("locks chrome, Connected Instagram, Share kit, and delete confirm copy", () => {
    for (const key of pageStyleKeys) {
      expect(userSettingsOwnerCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(userSettingsOwnerCopySource).toContain(
      "export function AccountSettingsOwnerPage",
    );
    expect(userSettingsOwnerCopySource).toContain('aria-label="Account settings"');
    expect(userSettingsOwnerCopySource).toContain('title="Account settings"');
    expect(userSettingsOwnerCopySource).toContain("Connected Instagram");
    expect(userSettingsOwnerCopySource).toContain("CreatorIdentityStrip");
    expect(userSettingsOwnerCopySource).toContain("showProfessionalChip");
    expect(userSettingsOwnerCopySource).toContain("Share kit");
    expect(userSettingsOwnerCopySource).toContain("Sign out");
    expect(userSettingsOwnerCopySource).toContain("Disconnect");
    expect(userSettingsOwnerCopySource).toContain("Delete account");
    expect(userSettingsOwnerCopySource).toContain(
      'title="Delete your Pitchkit account?"',
    );
    expect(userSettingsOwnerCopySource).toContain(
      "This permanently deletes your kit, stored media copies, and connection. Your Instagram account is not deleted. This cannot be undone.",
    );
    expect(userSettingsOwnerCopySource).toContain('cancelLabel="Cancel"');
    expect(userSettingsOwnerCopySource).toContain('confirmRole="destructive"');
    expect(userSettingsOwnerCopySource).toContain("from \"@whatmatters/wmds\"");
    expect(userSettingsOwnerCopySource).toContain("from \"lucide-react\"");

    const signOutAt = userSettingsOwnerCopySource.indexOf("Sign out");
    const disconnectAt = userSettingsOwnerCopySource.indexOf("Disconnect");
    const deleteAt = userSettingsOwnerCopySource.lastIndexOf("Delete account");
    expect(signOutAt).toBeGreaterThan(-1);
    expect(disconnectAt).toBeGreaterThan(signOutAt);
    expect(deleteAt).toBeGreaterThan(disconnectAt);
  });

  it("omits kit editors and Storybook-only chrome", () => {
    for (const token of outOfPattern) {
      expect(userSettingsOwnerCopySource, token).not.toContain(token);
    }
  });
});
