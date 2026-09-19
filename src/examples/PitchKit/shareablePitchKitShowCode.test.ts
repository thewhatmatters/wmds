import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PITCHKIT_MISSING_VALUE,
  PITCHKIT_PUBLIC_COUNTRIES_MAX,
  PITCHKIT_PUBLIC_POSTS_MAX,
  pitchKitAudience,
  pitchKitPublicCountries,
  pitchKitSelectedPosts,
  publicCountries,
  publicEngagementRate,
  publicTypicalReach,
} from "./pitchKitData";
import {
  shareablePitchKitBodyCopySource,
  shareablePitchKitPageCopySource,
} from "./shareablePitchKitCopySource";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);
const shareableSource = readFileSync(
  join(import.meta.dirname, "PitchKitShareable.tsx"),
  "utf8",
);

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

const shareableContractSource = `${shareablePitchKitBodyCopySource}\n${shareablePitchKitPageCopySource}\n${shareableStorySource}`;

const shareableStyleKeys = [
  ...shareableSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

describe("Pattern — shareable PitchKit Show code", () => {
  it("wires the Pattern story to the shared freeze", () => {
    expect(shareableStoryStart).toBeGreaterThan(-1);
    expect(shareableStorySource).toContain("shareablePitchKitPageCopySource");
    expect(shareableStorySource).toContain("Pattern — shareable PitchKit");
  });

  it("interpolates every PitchKitShareable pitchKitStyles token", () => {
    expect(shareableStyleKeys.length).toBeGreaterThan(15);
    for (const key of shareableStyleKeys) {
      const value = pitchKitStyles[key as keyof typeof pitchKitStyles];
      expect(String(value).length, key).toBeGreaterThan(0);
      expect(shareableContractSource, key).toContain(String(value));
    }
  });

  it("freezes public kit Graph KPIs, reach, countries, identity, outreach, and proof", () => {
    expect(shareablePitchKitPageCopySource).toContain(
      "export function ShareablePitchKitPage",
    );
    expect(shareablePitchKitPageCopySource).toContain("<ShareablePitchKit");
    expect(shareablePitchKitBodyCopySource).toContain(
      "Instagram performance summary",
    );
    expect(shareablePitchKitBodyCopySource).toContain("Selected posts");
    expect(shareablePitchKitBodyCopySource).toContain("Past brands");
    expect(shareablePitchKitBodyCopySource).toContain(
      "Creator-entered details for brand outreach",
    );
    expect(shareablePitchKitBodyCopySource).toContain("TextLink");
    expect(shareablePitchKitBodyCopySource).toContain("CreatorIdentityStrip");
    expect(shareablePitchKitBodyCopySource).toContain('label="Followers"');
    expect(shareablePitchKitBodyCopySource).toContain('label="Engagement rate"');
    expect(shareablePitchKitBodyCopySource).toContain('label="Typical reach"');
    expect(shareablePitchKitBodyCopySource).toContain('label="Typical saves"');
    expect(shareablePitchKitBodyCopySource).toContain("Chart.Cartesian");
    expect(shareablePitchKitBodyCopySource).toContain("Chart.RankedBars");
    expect(shareablePitchKitBodyCopySource).toContain("Top countries");
    expect(shareablePitchKitBodyCopySource).toContain("countries.slice(0, 3)");
    expect(shareablePitchKitBodyCopySource).toContain("Create your Pitchkit");
    expect(shareablePitchKitBodyCopySource).toContain(
      "Turn your Instagram into a shareable media kit.",
    );
    expect(shareablePitchKitBodyCopySource).toContain(
      "Continue with Instagram",
    );
    expect(shareablePitchKitBodyCopySource).toContain("showCreateBand");
    expect(shareablePitchKitBodyCopySource).toContain("PublicIntro");
    expect(shareablePitchKitBodyCopySource).toContain("PublicPastBrands");
    expect(shareablePitchKitBodyCopySource).not.toContain("Get started");
    expect(shareablePitchKitBodyCopySource).not.toContain(
      "Create your PitchKit Profile",
    );
    expect(shareableStorySource).toContain("showCreateBand");
  });

  it("omits owner management, invented metrics, and Storybook-only chrome", () => {
    expect(shareableContractSource).not.toContain("ExampleGridControls");
    expect(shareableContractSource).not.toContain("GridOverlay");
    expect(shareableContractSource).not.toContain("Coming soon");
    expect(shareableContractSource).not.toContain("MoreMenu");
    expect(shareableContractSource).not.toContain("Hide from kit");
    expect(shareableContractSource).not.toContain("Swap post");
    expect(shareablePitchKitBodyCopySource).not.toContain("EXAMPLE %");
    expect(shareablePitchKitBodyCopySource).not.toContain("heatmap");
    expect(shareablePitchKitBodyCopySource).not.toContain("impressions");
    expect(shareableStorySource).not.toContain("SegmentedControl");
  });
});

describe("public kit Graph KPI contract", () => {
  it("caps proof posts and countries", () => {
    expect(pitchKitSelectedPosts.length).toBeLessThanOrEqual(
      PITCHKIT_PUBLIC_POSTS_MAX,
    );
    expect(pitchKitPublicCountries).toHaveLength(PITCHKIT_PUBLIC_COUNTRIES_MAX);
    expect(publicCountries(pitchKitAudience.countries)).toHaveLength(3);
    expect(publicCountries([])).toEqual([]);
  });

  it("hides engagement rate and dashes typical reach when reach is insufficient", () => {
    expect(publicEngagementRate("resolved")).toBe("5.8%");
    expect(publicEngagementRate("insufficient")).toBeNull();
    expect(publicTypicalReach("resolved")).toBe("9.3K");
    expect(publicTypicalReach("insufficient")).toBe(PITCHKIT_MISSING_VALUE);
  });
});
