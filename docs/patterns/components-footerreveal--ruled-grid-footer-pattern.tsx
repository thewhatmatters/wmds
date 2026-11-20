// @thewhatmatters/wmds@0.4.54 · Pattern — ruled grid footer
// Storybook: Components/FooterReveal → Pattern — ruled grid footer (?path=/story/components-footerreveal--ruled-grid-footer-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { FooterReveal, TextLink, footerRevealRuledFieldClasses } from "@thewhatmatters/wmds";

export function RuledGridFooter() {
  return (
    <div className={footerRevealRuledFieldClasses}>
      <FooterReveal.Ruled
        wordmark="WhatMatters"
        mark="WM"
        copyright="WhatMatters © 2026"
        links={[
          { label: "Services", href: "/services" },
          { label: "Resources", href: "/resources" },
          { label: "About", href: "/about" },
        ]}
        email="randy@whatmatters.so"
        credit="Created by WhatMatters 2024–2026"
      />
    </div>
  );
}

export function FooterRevealRuledNav() {
  return (
    <nav aria-label="Footer">
      <ul className="m-0 flex list-none flex-col items-center gap-3 whitespace-nowrap p-0 font-sans text-[length:var(--font-size-4xl)] leading-none md:text-[length:var(--font-size-7xl)]">
        <li>
          <TextLink href="/services" tone="brand">Services</TextLink>
        </li>
        <li>
          <TextLink href="/resources" tone="brand">Resources</TextLink>
        </li>
        <li>
          <TextLink href="/about" tone="brand">About</TextLink>
        </li>
      </ul>
    </nav>
  );
}
