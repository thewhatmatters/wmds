// @thewhatmatters/wmds@0.4.53 · Pattern — brand nav links
// Storybook: Components/TextLink → Pattern — brand nav links (?path=/story/components-textlink--brand-nav)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TextLink } from "@thewhatmatters/wmds";

export function FooterNav() {
  return (
    <nav aria-label="Footer">
      <ul className="type-display-3 m-0 flex list-none flex-col gap-2 p-0">
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
