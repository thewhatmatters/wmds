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
  PITCHKIT_BRAND_RESULT_MAX,
  isPitchKitBrandLogoKey,
  movePastBrand,
  normalizePastBrandResult,
  pastBrandIdFromName,
  pastBrandLogoMonogram,
  pastBrandResultIssues,
  pastBrandsFromState,
  pitchKitBrandLogoKeys,
  pitchKitPastBrands,
  pitchKitPastBrandsOverflow,
  reorderPastBrand,
  resolvePastBrandLogoKey,
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
  "logo upload",
  "logoUrl",
  "logo_url",
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
    expect(pastBrandsOwnerCopySource).toContain('label="Result"');
    expect(pastBrandsOwnerCopySource).toContain('label="Logo"');
    expect(pastBrandsOwnerCopySource).toContain('? "Add" : "Save"');
    expect(pastBrandsOwnerCopySource).toContain("PITCHKIT_BRANDS_MAX = 8");
    expect(pastBrandsOwnerCopySource).toContain("PITCHKIT_BRAND_NAME_MAX = 40");
    expect(pastBrandsOwnerCopySource).toContain("PITCHKIT_BRAND_RESULT_MAX = 24");
    expect(pastBrandsOwnerCopySource).toContain("maxLength={PITCHKIT_BRAND_NAME_MAX}");
    expect(pastBrandsOwnerCopySource).toContain("maxLength={PITCHKIT_BRAND_RESULT_MAX}");
    expect(pastBrandsOwnerCopySource).toContain("<Dialog");
    expect(pastBrandsOwnerCopySource).toContain("<MoreMenu");
    expect(pastBrandsOwnerCopySource).toContain("Add result");
    expect(pastBrandsOwnerCopySource).toContain("Clear result");
    expect(pastBrandsOwnerCopySource).toContain("Move ");
    expect(pastBrandsOwnerCopySource).toContain("draggable");
    expect(pastBrandsOwnerCopySource).toContain('size="sm"');
    expect(pastBrandsOwnerCopySource).toContain("<Avatar name={name} size=\"sm\" />");
    expect(pastBrandsOwnerCopySource).toContain("logo_key");
    expect(pastBrandsOwnerCopySource).toContain("result_label");
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

  it("locks public show/omit, letter fallback, result omit, and overflow-only marquee", () => {
    expect(pastBrandsPublicCopySource).toContain("export function PastBrandsPublicPage");
    expect(pastBrandsPublicCopySource).toContain(creatorIdentityStripCopySource.trim());
    expect(pastBrandsPublicCopySource).toContain("Past brands");
    expect(pastBrandsPublicCopySource).toContain("if (brands.length === 0) return null");
    expect(pastBrandsPublicCopySource).toContain('<Avatar name={name} size="sm" />');
    expect(pastBrandsPublicCopySource).toContain("prefers-reduced-motion");
    expect(pastBrandsPublicCopySource).toContain("marquee-track");
    expect(pastBrandsPublicCopySource).toContain("BrandResultChip");
    expect(pastBrandsPublicCopySource).toContain("normalizePastBrandResult");
    expect(pastBrandsPublicCopySource).not.toContain("Add brands you've worked with");
    expect(pastBrandsPublicCopySource).not.toContain("<MoreMenu");
    expect(pastBrandsPublicCopySource).not.toContain("<Dialog");
    expect(pastBrandsPublicCopySource).not.toContain("draggable");
    expect(pastBrandsPublicCopySource).not.toContain("Add result");
    expect(pastBrandsPublicCopySource).not.toContain("ExampleGridControls");
  });

  it("omits invented brand fields, Graph KPIs, and Storybook-only chrome", () => {
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
  it("keeps items to ordered { id, name, logo_key?, result_label? } and enforces max 8 / name 40 / result 24", () => {
    expect(PITCHKIT_BRANDS_MAX).toBe(8);
    expect(PITCHKIT_BRAND_NAME_MAX).toBe(40);
    expect(PITCHKIT_BRAND_RESULT_MAX).toBe(24);
    expect(pitchKitBrandLogoKeys).toHaveLength(32);
    expect(pastBrandsFromState("empty")).toEqual([]);
    expect(pastBrandsFromState("filled")).toEqual(pitchKitPastBrands);
    expect(pastBrandsFromState("overflow")).toEqual(pitchKitPastBrandsOverflow);
    for (const brand of [...pitchKitPastBrands, ...pitchKitPastBrandsOverflow]) {
      expect(["id", "name", "logo_key", "result_label"]).toEqual(
        expect.arrayContaining(Object.keys(brand)),
      );
      expect(brand.name.length).toBeGreaterThan(0);
      expect(brand.name.length).toBeLessThanOrEqual(PITCHKIT_BRAND_NAME_MAX);
      if (brand.logo_key != null) {
        expect(isPitchKitBrandLogoKey(brand.logo_key)).toBe(true);
      }
      if (brand.result_label != null) {
        expect(brand.result_label.trim().length).toBeGreaterThan(0);
        expect(brand.result_label.length).toBeLessThanOrEqual(PITCHKIT_BRAND_RESULT_MAX);
        expect(pastBrandResultIssues(brand.result_label)).toBeUndefined();
      }
    }
    expect(pitchKitPastBrands.length).toBeLessThanOrEqual(PITCHKIT_BRANDS_MAX);
    expect(pitchKitPastBrandsOverflow.length).toBe(PITCHKIT_BRANDS_MAX);
    expect(pitchKitPastBrands.some((brand) => brand.result_label != null)).toBe(true);
    expect(pitchKitPastBrands.some((brand) => brand.result_label == null)).toBe(true);
    expect(pitchKitPastBrands.some((brand) => brand.logo_key != null)).toBe(true);
    expect(pitchKitPastBrands.some((brand) => brand.logo_key == null)).toBe(true);
  });

  it("resolves logo_key with letter fallback and validates result_label", () => {
    expect(resolvePastBrandLogoKey(undefined)).toBeUndefined();
    expect(resolvePastBrandLogoKey("letter")).toBeUndefined();
    expect(resolvePastBrandLogoKey("not-a-brand")).toBeUndefined();
    expect(resolvePastBrandLogoKey("nike")).toBe("nike");
    expect(pastBrandLogoMonogram("nike")).toBe("N");
    expect(pastBrandLogoMonogram("coca-cola")).toBe("CC");
    expect(normalizePastBrandResult("   ")).toBeUndefined();
    expect(normalizePastBrandResult("  3.2x ROAS  ")).toBe("3.2x ROAS");
    expect(normalizePastBrandResult("x".repeat(30))).toHaveLength(24);
    expect(pastBrandResultIssues("https://example.com")).toBeDefined();
    expect(pastBrandResultIssues("ping @agency")).toBeDefined();
    expect(pastBrandResultIssues("line\nbreak")).toBeDefined();
    expect(pastBrandResultIssues("🔥🔥🔥")).toBeDefined();
    expect(pastBrandResultIssues("+12% CTR")).toBeUndefined();
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
