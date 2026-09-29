import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  footerRevealRuledCreditCopyClasses,
  footerRevealRuledEmailClasses,
  footerRevealRuledFieldClasses,
  footerRevealRuledLinkListClasses,
  footerRevealRuledNavLinkClasses,
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
    expect(footerRevealRuledLinkListClasses).toContain("font-sans");
    expect(footerRevealRuledLinkListClasses).toContain("text-[length:var(--font-size-4xl)]");
    expect(footerRevealRuledLinkListClasses).toContain("sm:text-[4rem]");
    expect(footerRevealRuledLinkListClasses).not.toContain("font-mono");
    expect(footerRevealRuledLinkListClasses).not.toContain("uppercase");
    expect(footerRevealRuledLinkListClasses).not.toContain("var(--font-size-6xl)");
    expect(footerRevealRuledLinkListClasses).not.toContain("var(--font-size-base)");
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
      footerRevealRuledLinkListClasses,
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
    const ruled = readFileSync(new URL("./FooterRevealRuled.tsx", import.meta.url), "utf8");
    expect(ruled).toContain("<TextLink");
    expect(ruled).not.toContain("footerRevealRuledLinkClasses");
    expect(ruled).toContain("className={footerRevealRuledNavLinkClasses}");
    expect(footerRevealRuledNavLinkClasses).toBe("!text-brand");
    const stories = readFileSync(new URL("./FooterReveal.stories.tsx", import.meta.url), "utf8");
    expect(stories).toContain('<TextLink href="/services" className="!text-brand">Services</TextLink>');
    expect(stories).toContain('<TextLink href="/resources" className="!text-brand">Resources</TextLink>');
    expect(stories).toContain('<TextLink href="/about" className="!text-brand">About</TextLink>');
  });
});
