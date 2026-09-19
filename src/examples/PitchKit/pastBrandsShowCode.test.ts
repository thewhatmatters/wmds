import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pastBrandsOwnerCopySource,
  pastBrandsPublicCopySource,
} from "./pastBrandsCopySource";
import { cardLayoutHeaderEndClasses } from "../../components/molecules/Card/cardStyles";
import {
  PITCHKIT_BRANDS_MAX,
  PITCHKIT_BRAND_NAME_MAX,
  movePastBrand,
  pastBrandIdFromName,
  pastBrandsFromState,
  pitchKitPastBrands,
  reorderPastBrand,
} from "./pitchKitData";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKitPastBrands.stories.tsx"),
  "utf8",
);
const exampleSource = readFileSync(
  join(import.meta.dirname, "PitchKitPastBrands.tsx"),
  "utf8",
);
const usageSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);

const brandStyleKeys = [
  ...exampleSource.matchAll(/^\s+(pitchKit\w+(?:Classes|Px)),?$/gm),
].map((match) => match[1]);

const inventedFields = [
  "year",
  "summary",
  "logo",
  "reach",
  "label=\"Followers\"",
  "Engagement rate",
  "Chart.",
  "Selected posts",
  "hello@averymorgan.com",
  "rates",
  "website",
  "biography",
] as const;

describe("Pattern — past brands Show code", () => {
  it("wires both Pattern stories to the shared freezes", () => {
    expect(storiesSource).toContain('name: "Pattern — past brands (owner)"');
    expect(storiesSource).toContain('name: "Pattern — past brands (public)"');
    expect(storiesSource).toContain("pastBrandsOwnerCopySource");
    expect(storiesSource).toContain("pastBrandsPublicCopySource");
    expect(usageSource).toContain("Pattern — past brands (owner)");
    expect(usageSource).toContain("Pattern — past brands (public)");
  });

  it("interpolates every past-brands-example pitchKitStyles token into a freeze", () => {
    expect(brandStyleKeys.length).toBeGreaterThan(8);
    const combined = `${pastBrandsOwnerCopySource}\n${pastBrandsPublicCopySource}`;
    for (const key of brandStyleKeys) {
      const value = pitchKitStyles[key as keyof typeof pitchKitStyles];
      expect(String(value).length, key).toBeGreaterThan(0);
      expect(combined, key).toContain(String(value));
    }
  });

  it("locks owner add/edit/reorder contract and trailing MoreMenu", () => {
    expect(pastBrandsOwnerCopySource).toContain("export function PastBrandsOwnerPage");
    expect(pastBrandsOwnerCopySource).toContain(creatorIdentityStripCopySource.trim());
    expect(pastBrandsOwnerCopySource).toContain("Past brands");
    expect(pastBrandsOwnerCopySource).toContain("Add brands you've worked with");
    expect(pastBrandsOwnerCopySource).toContain('label="Brand name"');
    expect(pastBrandsOwnerCopySource).toContain('? "Add" : "Save"');
    expect(pastBrandsOwnerCopySource).toContain("PITCHKIT_BRANDS_MAX = 8");
    expect(pastBrandsOwnerCopySource).toContain("PITCHKIT_BRAND_NAME_MAX = 40");
    expect(pastBrandsOwnerCopySource).toContain("maxLength={PITCHKIT_BRAND_NAME_MAX}");
    expect(pastBrandsOwnerCopySource).toContain("<Dialog");
    expect(pastBrandsOwnerCopySource).toContain("<MoreMenu");
    expect(pastBrandsOwnerCopySource).toContain("Move ");
    expect(pastBrandsOwnerCopySource).toContain("draggable");
    expect(pastBrandsOwnerCopySource).toContain('size="sm"');
    expect(pastBrandsOwnerCopySource).toContain("<Avatar name={name} size=\"sm\" />");
    expect(pastBrandsOwnerCopySource).toContain(
      `<Card.Header
                start={`,
    );
    expect(pastBrandsOwnerCopySource).toContain("end={");
    expect(exampleSource).toContain(
      `<Card.Header
                start={`,
    );
    expect(exampleSource).toContain("end={");
    expect(cardLayoutHeaderEndClasses).toContain("ml-auto");
    expect(pastBrandsOwnerCopySource).not.toContain("ExampleGridControls");
    expect(pastBrandsOwnerCopySource).not.toContain("GridOverlay");
  });

  it("locks public show/omit and name + letter Avatar only", () => {
    expect(pastBrandsPublicCopySource).toContain("export function PastBrandsPublicPage");
    expect(pastBrandsPublicCopySource).toContain(creatorIdentityStripCopySource.trim());
    expect(pastBrandsPublicCopySource).toContain("Past brands");
    expect(pastBrandsPublicCopySource).toContain("if (brands.length === 0) return null");
    expect(pastBrandsPublicCopySource).toContain('<Avatar name={brand.name} size="sm" />');
    expect(pastBrandsPublicCopySource).not.toContain("Add brands you've worked with");
    expect(pastBrandsPublicCopySource).not.toContain("<MoreMenu");
    expect(pastBrandsPublicCopySource).not.toContain("<Dialog");
    expect(pastBrandsPublicCopySource).not.toContain("draggable");
    expect(pastBrandsPublicCopySource).not.toContain("ExampleGridControls");
  });

  it("omits invented brand fields, KPIs, and Storybook-only chrome", () => {
    const combined = `${pastBrandsOwnerCopySource}\n${pastBrandsPublicCopySource}`;
    for (const token of inventedFields) {
      expect(combined, token).not.toContain(token);
    }
    expect(combined).not.toContain("parameters:");
    expect(combined).not.toContain("export const");
    expect(combined).not.toContain("Campaigns already shipped");
  });
});

describe("past brands field contract", () => {
  it("keeps items to ordered { id, name } and enforces max 8 / name 40", () => {
    expect(PITCHKIT_BRANDS_MAX).toBe(8);
    expect(PITCHKIT_BRAND_NAME_MAX).toBe(40);
    expect(pastBrandsFromState("empty")).toEqual([]);
    expect(pastBrandsFromState("filled")).toEqual(pitchKitPastBrands);
    for (const brand of pitchKitPastBrands) {
      expect(Object.keys(brand).sort()).toEqual(["id", "name"]);
      expect(brand.name.length).toBeLessThanOrEqual(PITCHKIT_BRAND_NAME_MAX);
    }
    expect(pitchKitPastBrands.length).toBeLessThanOrEqual(PITCHKIT_BRANDS_MAX);
  });

  it("reorders by index or drop target without inventing fields", () => {
    const moved = movePastBrand(pitchKitPastBrands, "studio-line", -1);
    expect(moved.map((brand) => brand.id)).toEqual([
      "studio-line",
      "hearth-home",
      "market-co",
    ]);
    const dropped = reorderPastBrand(pitchKitPastBrands, "market-co", "hearth-home");
    expect(dropped.map((brand) => brand.id)).toEqual([
      "market-co",
      "hearth-home",
      "studio-line",
    ]);
    expect(movePastBrand(pitchKitPastBrands, "hearth-home", -1)).toEqual(
      pitchKitPastBrands,
    );
    expect(pastBrandIdFromName("Hearth & Home", ["hearth-home"])).toBe(
      "hearth-home-2",
    );
  });
});
