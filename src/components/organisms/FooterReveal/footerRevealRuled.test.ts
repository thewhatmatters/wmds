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
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { FooterRevealRuled, footerRevealRuledEmailHref } from "./FooterRevealRuled";
import { footerRevealRuledSample } from "../../../storybook/footerRevealSample";

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
    expect(footerRevealRuledFieldClasses).toContain("min-h-[100vh]");
    expect(footerRevealRuledFieldClasses).not.toContain("max-h-");
    expect(footerRevealRuledFieldClasses).not.toContain("overflow-hidden");
    expect(footerRevealRuledRootClasses).toContain("min-h-[100vh]");
    expect(footerRevealRuledRootClasses).toContain(
      "pt-[calc(var(--site-nav-height)+var(--spacing)*4)]",
    );
    expect(footerRevealRuledRootClasses).toContain("pb-[var(--grid-pad)]");
    expect(footerRevealRuledRootClasses).not.toMatch(/pt-\[\d/);
    expect(footerRevealRuledRootClasses).toContain("flex-col");
    expect(footerRevealRuledRootClasses).toContain("items-center");
    expect(footerRevealRuledRootClasses).toContain("justify-center-safe");
    expect(footerRevealRuledRootClasses).not.toContain("max-h-");
    expect(footerRevealRuledRootClasses).not.toContain("overflow-hidden");
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

  it("ships no content defaults: only the wordmark renders when nothing else is passed", () => {
    const bare = renderToString(createElement(FooterRevealRuled, { wordmark: "Acme" }));
    expect(bare).toContain("Acme");
    expect(bare).not.toContain("mailto:");
    expect(bare).not.toContain("WhatMatters");
    expect(bare).not.toContain('aria-label="Footer"');

    const full = renderToString(createElement(FooterRevealRuled, footerRevealRuledSample));
    expect(full).toContain("mailto:randy@whatmatters.so");
    expect(full).toContain('aria-label="Footer"');
    expect(full).toContain(footerRevealRuledSample.copyright);
    expect(full).toContain(footerRevealRuledSample.credit);
    expect(JSON.stringify(footerRevealRuledSample)).not.toContain("What Matters");
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
