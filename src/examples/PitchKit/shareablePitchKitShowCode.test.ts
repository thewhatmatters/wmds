import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);
const shareableSource = readFileSync(
  join(import.meta.dirname, "PitchKitShareable.tsx"),
  "utf8",
);

const kitFreezeStart = storiesSource.indexOf(
  "const shareablePitchKitCopySource",
);
const kitFreezeEnd = storiesSource.indexOf("const dataStates");
const kitFreezeSource = storiesSource.slice(kitFreezeStart, kitFreezeEnd);

const shareableStoryStart = storiesSource.indexOf(
  'name: "Pattern — shareable PitchKit"',
);
const ownerStoryStart = storiesSource.indexOf(
  'name: "Pattern — owner PitchKit"',
);
const shareableStorySource = storiesSource.slice(
  shareableStoryStart,
  ownerStoryStart > shareableStoryStart ? ownerStoryStart : undefined,
);

const shareableContractSource = `${kitFreezeSource}\n${shareableStorySource}`;

const shareableStyleKeys = [
  ...shareableSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

describe("Pattern — shareable PitchKit Show code", () => {
  it("extracts the shared kit freeze and the Pattern story", () => {
    expect(kitFreezeStart).toBeGreaterThan(-1);
    expect(kitFreezeEnd).toBeGreaterThan(kitFreezeStart);
    expect(shareableStoryStart).toBeGreaterThan(kitFreezeEnd);
  });

  it("interpolates every PitchKitShareable pitchKitStyles token", () => {
    expect(shareableStyleKeys.length).toBeGreaterThan(15);
    for (const key of shareableStyleKeys) {
      expect(shareableContractSource, key).toContain(`\${${key}}`);
      expect(
        pitchKitStyles[key as keyof typeof pitchKitStyles].length,
        key,
      ).toBeGreaterThan(0);
    }
  });

  it("freezes public kit chrome, identity, outreach, and proof", () => {
    expect(shareableStorySource).toContain("export function ShareablePitchKitPage");
    expect(shareableStorySource).toContain("<ShareablePitchKit");
    expect(kitFreezeSource).toContain("Verified Instagram summary");
    expect(kitFreezeSource).toContain("Selected posts");
    expect(kitFreezeSource).toContain("Past brands");
    expect(kitFreezeSource).toContain("Creator-entered details for brand outreach");
    expect(kitFreezeSource).toContain("TextLink");
    expect(kitFreezeSource).toContain("Chip readOnly");
    expect(kitFreezeSource).toContain('label="Followers"');
    expect(kitFreezeSource).toContain('label="Engagement rate"');
  });

  it("omits owner management and Storybook-only chrome", () => {
    expect(shareableContractSource).not.toContain("ExampleGridControls");
    expect(shareableContractSource).not.toContain("GridOverlay");
    expect(shareableContractSource).not.toContain("Coming soon");
    expect(shareableContractSource).not.toContain("MoreMenu");
    expect(shareableContractSource).not.toContain("Hide from kit");
    expect(shareableContractSource).not.toContain("Swap post");
    expect(shareableStorySource).not.toContain("SegmentedControl");
  });
});
