import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  footerRevealRuledBandClasses,
  footerRevealRuledBandTopClasses,
  footerRevealRuledContactClasses,
  footerRevealRuledContactRowClasses,
  footerRevealRuledCreditCopyClasses,
  footerRevealRuledEmailClasses,
  footerRevealRuledFieldClasses,
  footerRevealRuledGridClasses,
  footerRevealRuledLinkClasses,
  footerRevealRuledPlusClasses,
  footerRevealRuledRootClasses,
  footerRevealRuledSocialCellClasses,
  footerRevealRuledWordmarkClasses,
} from "./footerRevealStyles";
import {
  footerRevealRuledDefaultCopy,
  footerRevealRuledDefaultLinks,
  footerRevealRuledDefaultSocials,
  footerRevealRuledEmailHref,
} from "./FooterRevealRuled";

describe("footerRevealRuledEmailHref", () => {
  it("uses mailto when no href is passed", () => {
    expect(footerRevealRuledEmailHref("randy@whatmatters.so")).toBe("mailto:randy@whatmatters.so");
  });

  it("keeps an explicit href", () => {
    expect(footerRevealRuledEmailHref("randy@whatmatters.so", "/contact")).toBe("/contact");
  });
});

describe("ruled grid footer contract", () => {
  it("paints brand ink on the page background with 1px brand rules", () => {
    expect(footerRevealRuledFieldClasses).toContain("bg-body");
    expect(footerRevealRuledFieldClasses).toContain("text-brand");
    expect(footerRevealRuledFieldClasses).toContain("footer-reveal-ruled-field");
    expect(footerRevealRuledBandClasses).toContain("border-b");
    expect(footerRevealRuledBandClasses).toContain("border-brand");
    expect(footerRevealRuledBandClasses).not.toContain("max-w-");
    expect(footerRevealRuledBandTopClasses).toBe("border-t");
    expect(footerRevealRuledGridClasses).toContain("border-x");
    expect(footerRevealRuledGridClasses).toContain("border-brand");
    expect(footerRevealRuledGridClasses).toContain(
      "w-[calc(100%-2*var(--grid-margin))]",
    );
    expect(footerRevealRuledGridClasses).toContain(
      "max-w-[calc(var(--grid-max)-2*var(--grid-margin))]",
    );
    expect(footerRevealRuledGridClasses).not.toMatch(/(?:^|\s)w-full(?:\s|$)/);
    expect(footerRevealRuledRootClasses).not.toContain("max-w-");
    expect(footerRevealRuledRootClasses).not.toContain("border");
    expect(footerRevealRuledPlusClasses).toContain("max-md:hidden");
    expect(footerRevealRuledPlusClasses).toContain("md:inline-flex");
    expect(footerRevealRuledPlusClasses).not.toMatch(/(?:^|\s)hidden(?:\s|$)/);
    expect(footerRevealRuledPlusClasses).not.toMatch(/(?:^|\s)inline-flex(?:\s|$)/);
    expect(footerRevealRuledLinkClasses).toContain("border-dotted");
    expect(footerRevealRuledLinkClasses).toContain("border-brand");
    expect(footerRevealRuledLinkClasses).toContain("focus-visible:ring-brand");
    expect(footerRevealRuledSocialCellClasses).toContain("focus-visible:ring-brand");
    expect(footerRevealRuledSocialCellClasses).toContain("h-full");
    expect(footerRevealRuledSocialCellClasses).toContain("min-h-[max(100%,2.75rem)]");
    expect(footerRevealRuledSocialCellClasses).toContain("self-stretch");
    expect(footerRevealRuledContactClasses).toContain("items-start");
    expect(footerRevealRuledContactClasses).toContain("text-left");
    expect(footerRevealRuledContactClasses).toContain("p-[var(--grid-pad)]");
    expect(footerRevealRuledContactClasses).not.toContain("justify-center");
    expect(footerRevealRuledContactRowClasses).toContain("items-start");
    expect(footerRevealRuledContactRowClasses).toContain("text-left");
    expect(footerRevealRuledContactRowClasses).toContain("w-fit");
    expect(footerRevealRuledContactRowClasses).not.toContain("justify-between");
    expect(footerRevealRuledContactRowClasses).not.toContain("justify-center");
    expect(footerRevealRuledEmailClasses).toContain("focus-visible:ring-brand");
    expect(footerRevealRuledWordmarkClasses).toContain("text-brand");
    expect(footerRevealRuledCreditCopyClasses).toContain("font-mono");
    expect(footerRevealRuledCreditCopyClasses).toContain("break-words");

    const shell = [
      footerRevealRuledFieldClasses,
      footerRevealRuledRootClasses,
      footerRevealRuledBandClasses,
      footerRevealRuledGridClasses,
      footerRevealRuledLinkClasses,
      footerRevealRuledSocialCellClasses,
    ].join(" ");
    expect(shell).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it("keeps the dark field on the light on-brand surface", () => {
    const theme = readFileSync(new URL("../../../theme/theme.css", import.meta.url), "utf8");
    expect(theme).toContain('[data-theme="dark"] .footer-reveal-ruled-field');
    expect(theme).toContain("background-color: var(--color-on-brand)");
    expect(theme).toContain("color: var(--color-brand)");
  });

  it("uses WhatMatters placeholder copy and five social cells", () => {
    expect(footerRevealRuledDefaultCopy.copyright).toBe("WhatMatters © 2026");
    expect(footerRevealRuledDefaultCopy.wordmark).toBe("WhatMatters");
    expect(footerRevealRuledDefaultCopy.mark).toBe("WM");
    expect(footerRevealRuledDefaultCopy.credit).toBe("Created by WhatMatters 2024\u20132026");
    expect("crop" in footerRevealRuledDefaultCopy).toBe(false);
    expect(footerRevealRuledDefaultCopy.email).toBe("randy@whatmatters.so");
    expect(JSON.stringify(footerRevealRuledDefaultCopy)).not.toContain("What Matters");
    expect(footerRevealRuledDefaultLinks).toEqual([
      { label: "Services", href: "/services" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
    ]);
    expect(footerRevealRuledDefaultSocials).toHaveLength(5);
    for (const social of footerRevealRuledDefaultSocials) {
      expect(social.label.length).toBeGreaterThan(0);
      expect(social.href.length).toBeGreaterThan(0);
    }
    expect(footerRevealRuledDefaultSocials.map((social) => social.label)).toEqual([
      "WhatMatters on X",
      "WhatMatters on Dribbble",
      "WhatMatters on Instagram",
      "WhatMatters on LinkedIn",
      "WhatMatters highlights",
    ]);
  });
});
