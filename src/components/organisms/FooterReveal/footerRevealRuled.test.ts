import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  footerRevealRuledCreditCopyClasses,
  footerRevealRuledEmailClasses,
  footerRevealRuledFieldClasses,
  footerRevealRuledLinkClasses,
  footerRevealRuledLinkLabelClasses,
  footerRevealRuledLinkListClasses,
  footerRevealRuledMetaClasses,
  footerRevealRuledRootClasses,
  footerRevealRuledWordmarkClasses,
  footerRevealRuledWordmarkFrameClasses,
} from "./footerRevealStyles";
import {
  footerRevealRuledDefaultCopy,
  footerRevealRuledDefaultLinks,
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

describe("ruled footer contract", () => {
  it("paints brand ink on the page background and fits the wordmark to the footer", () => {
    expect(footerRevealRuledFieldClasses).toContain("bg-body");
    expect(footerRevealRuledFieldClasses).toContain("text-brand");
    expect(footerRevealRuledFieldClasses).toContain("footer-reveal-ruled-field");
    expect(footerRevealRuledRootClasses).toContain("flex-col");
    expect(footerRevealRuledRootClasses).toContain("items-center");
    expect(footerRevealRuledRootClasses).not.toContain("max-w-");
    expect(footerRevealRuledRootClasses).not.toContain("border");
    expect(footerRevealRuledLinkListClasses).toContain("items-center");
    expect(footerRevealRuledLinkListClasses).toContain("flex-col");
    expect(footerRevealRuledLinkClasses).toContain("focus-visible:ring-brand");
    expect(footerRevealRuledLinkClasses).not.toContain("border-dotted");
    expect(footerRevealRuledLinkLabelClasses).toContain("font-mono");
    expect(footerRevealRuledLinkLabelClasses).toContain("uppercase");
    expect(footerRevealRuledMetaClasses).toContain("md:grid-cols-3");
    expect(footerRevealRuledEmailClasses).toContain("focus-visible:ring-brand");
    expect(footerRevealRuledWordmarkFrameClasses).toContain("w-full");
    expect(footerRevealRuledWordmarkFrameClasses).toContain("overflow-visible");
    expect(footerRevealRuledWordmarkFrameClasses).not.toContain("overflow-hidden");
    expect(footerRevealRuledWordmarkFrameClasses).not.toContain("max-w-");
    expect(footerRevealRuledWordmarkClasses).toContain("text-brand");
    expect(footerRevealRuledWordmarkClasses).not.toContain("translate-");
    expect(footerRevealRuledCreditCopyClasses).toContain("font-mono");
    expect(footerRevealRuledCreditCopyClasses).toContain("break-words");

    const shell = [
      footerRevealRuledFieldClasses,
      footerRevealRuledRootClasses,
      footerRevealRuledLinkClasses,
      footerRevealRuledWordmarkClasses,
      footerRevealRuledWordmarkFrameClasses,
    ].join(" ");
    expect(shell).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it("keeps the dark field on the light on-brand surface", () => {
    const theme = readFileSync(new URL("../../../theme/theme.css", import.meta.url), "utf8");
    expect(theme).toContain('[data-theme="dark"] .footer-reveal-ruled-field');
    expect(theme).toContain("background-color: var(--color-on-brand)");
    expect(theme).toContain("color: var(--color-brand)");
  });

  it("uses WhatMatters placeholder copy and the centered nav", () => {
    expect(footerRevealRuledDefaultCopy.copyright).toBe("WhatMatters © 2026");
    expect(footerRevealRuledDefaultCopy.wordmark).toBe("WhatMatters");
    expect(footerRevealRuledDefaultCopy.mark).toBe("WM");
    expect(footerRevealRuledDefaultCopy.credit).toBe("Created by WhatMatters 2024\u20132026");
    expect("crop" in footerRevealRuledDefaultCopy).toBe(false);
    expect("socials" in footerRevealRuledDefaultCopy).toBe(false);
    expect(footerRevealRuledDefaultCopy.email).toBe("randy@whatmatters.so");
    expect(JSON.stringify(footerRevealRuledDefaultCopy)).not.toContain("What Matters");
    expect(footerRevealRuledDefaultLinks).toEqual([
      { label: "Services", href: "/services" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
    ]);
  });
});
