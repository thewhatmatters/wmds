import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createPitchKitProfileCalloutCopySource } from "./createProfileCalloutCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKitAccount.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitCreateProfileCallout.tsx"),
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
  "pitchKitContentBandClasses",
  "pitchKitContentClasses",
  "pitchKitCalloutCardClasses",
  "pitchKitCalloutBodyClasses",
  "pitchKitCalloutActionsClasses",
] as const;

const outOfPattern = [
  "ExampleGridControls",
  "GridOverlay",
  "Coming soon",
  "MoreMenu",
  "Hide from kit",
  "Swap post",
  "SegmentedControl",
  "Open user settings",
  "Delete account",
  "Connected Instagram",
] as const;

describe("Pattern — create PitchKit profile callout Show code", () => {
  it("wires the Pattern story to the freeze", () => {
    expect(storiesSource).toContain(
      'name: "Pattern — create PitchKit profile callout"',
    );
    expect(storiesSource).toContain("export const CreatePitchKitProfileCallout");
    expect(storiesSource).toContain("createPitchKitProfileCalloutCopySource");
    expect(usageSource).toContain("Pattern — create PitchKit profile callout");
  });

  it("interpolates every callout-example pitchKitStyles token", () => {
    expect(exampleStyleKeys.length).toBeGreaterThan(12);
    for (const key of exampleStyleKeys) {
      expect(createPitchKitProfileCalloutCopySource, key).toContain(
        String(pitchKitStyles[key as keyof typeof pitchKitStyles]),
      );
    }
  });

  it("locks public chrome, truncated kit, and the profile callout", () => {
    for (const key of pageStyleKeys) {
      expect(createPitchKitProfileCalloutCopySource, key).toContain(
        String(pitchKitStyles[key]),
      );
    }
    expect(createPitchKitProfileCalloutCopySource).toContain(
      "export function CreatePitchKitProfileCalloutPage",
    );
    expect(createPitchKitProfileCalloutCopySource).toContain(
      "Create your PitchKit Profile",
    );
    expect(createPitchKitProfileCalloutCopySource).toContain("Get started");
    expect(createPitchKitProfileCalloutCopySource).toContain("UserPlus");
    expect(createPitchKitProfileCalloutCopySource).toContain(
      "<TruncatedShareablePitchKit",
    );
    expect(createPitchKitProfileCalloutCopySource).toContain(
      "Verified Instagram summary",
    );
    expect(createPitchKitProfileCalloutCopySource).toContain("Selected posts");
    expect(createPitchKitProfileCalloutCopySource).toContain('label="Followers"');
    expect(createPitchKitProfileCalloutCopySource).toContain(
      'label="Engagement rate"',
    );
    expect(createPitchKitProfileCalloutCopySource).toContain(
      "from \"@whatmatters/wmds\"",
    );
    expect(createPitchKitProfileCalloutCopySource).toContain(
      "from \"lucide-react\"",
    );
    expect(createPitchKitProfileCalloutCopySource).not.toContain("Past brands");
    expect(createPitchKitProfileCalloutCopySource).not.toContain("Contact");
  });

  it("omits owner management and Storybook-only chrome", () => {
    for (const token of outOfPattern) {
      expect(createPitchKitProfileCalloutCopySource, token).not.toContain(token);
    }
    expect(createPitchKitProfileCalloutCopySource).not.toContain(
      "pitchKitTopbarEndClasses",
    );
  });
});
