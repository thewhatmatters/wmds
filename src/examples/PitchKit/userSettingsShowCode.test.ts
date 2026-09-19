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
] as const;

const outOfPattern = [
  "ExampleGridControls",
  "GridOverlay",
  "Coming soon",
  "Connected Instagram",
  "Share kit",
  "Last synced",
  "MoreMenu",
  "Hide from kit",
  "Swap post",
  "bio",
  "rates",
  "website",
] as const;

describe("Pattern — user settings (owner) Show code", () => {
  it("wires the Pattern story to the freeze", () => {
    expect(storiesSource).toContain('name: "Pattern — user settings (owner)"');
    expect(storiesSource).toContain("export const UserSettingsOwner");
    expect(storiesSource).toContain("userSettingsOwnerCopySource");
    expect(usageSource).toContain("Pattern — user settings (owner)");
    expect(storiesSource).toContain("remove footer delete");
    expect(usageSource).toContain("remove footer delete");
  });

  it("interpolates every UserSettings example pitchKitStyles token", () => {
    expect(exampleStyleKeys.length).toBeGreaterThan(4);
    for (const key of exampleStyleKeys) {
      expect(userSettingsOwnerCopySource, key).toContain(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]),
      );
    }
  });

  it("locks owner chrome, Dialog, and destructive delete confirm", () => {
    for (const key of pageStyleKeys) {
      expect(userSettingsOwnerCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(userSettingsOwnerCopySource).toContain(
      "export function UserSettingsOwnerPage",
    );
    expect(userSettingsOwnerCopySource).toContain('aria-label="Open user settings"');
    expect(userSettingsOwnerCopySource).toContain('title="User settings"');
    expect(userSettingsOwnerCopySource).toContain("Account details for this PitchKit.");
    expect(userSettingsOwnerCopySource).toContain("{account.displayName}");
    expect(userSettingsOwnerCopySource).toContain("{account.email}");
    expect(userSettingsOwnerCopySource).toContain("{account.profilePictureUrl}");
    expect(userSettingsOwnerCopySource).toContain("Delete account");
    expect(userSettingsOwnerCopySource).toContain('title="Delete account?"');
    expect(userSettingsOwnerCopySource).toContain('confirmRole="destructive"');
    expect(userSettingsOwnerCopySource).toContain("from \"@whatmatters/wmds\"");
  });

  it("omits Connected Instagram, kit editors, and Storybook-only chrome", () => {
    for (const token of outOfPattern) {
      expect(userSettingsOwnerCopySource, token).not.toContain(token);
    }
  });
});
