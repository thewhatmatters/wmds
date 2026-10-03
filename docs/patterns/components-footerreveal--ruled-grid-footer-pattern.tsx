// @whatmatters/wmds@0.2.0 · Pattern — ruled grid footer
// Storybook: Components/FooterReveal → Pattern — ruled grid footer (?path=/story/components-footerreveal--ruled-grid-footer-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { FooterReveal, TextLink, footerRevealRuledFieldClasses } from "@whatmatters/wmds";

export function RuledGridFooter() {
  return (
    <div className={footerRevealRuledFieldClasses}>
      <FooterReveal.Ruled />
    </div>
  );
}

export function FooterRevealRuledNav() {
  return (
    <nav aria-label="Footer">
      <ul className="m-0 flex list-none flex-col items-center gap-3 whitespace-nowrap p-0 font-sans text-[length:var(--font-size-4xl)] leading-none sm:text-[4rem]">
        <li>
          <TextLink href="/services" className="!text-brand">Services</TextLink>
        </li>
        <li>
          <TextLink href="/resources" className="!text-brand">Resources</TextLink>
        </li>
        <li>
          <TextLink href="/about" className="!text-brand">About</TextLink>
        </li>
      </ul>
    </nav>
  );
}
