// @thewhatmatters/wmds@0.4.9 · Pattern — centered links
// Storybook: Components/SiteNav → Pattern — centered links (?path=/story/components-sitenav--centered-links)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { SiteNav } from "@thewhatmatters/wmds";

export function CenteredLinksNav() {
  return (
    <SiteNav
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="/work" current>Work</SiteNav.Link>
          <SiteNav.Link href="/about">About</SiteNav.Link>
          <SiteNav.Link href="/journal">Journal</SiteNav.Link>
          <SiteNav.Link href="/contact">Contact</SiteNav.Link>
        </SiteNav.Links>
      }
    />
  );
}
