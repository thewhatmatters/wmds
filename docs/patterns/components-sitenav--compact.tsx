// @thewhatmatters/wmds@0.4.5 · Pattern — compact (scrolled)
// Storybook: Components/SiteNav → Pattern — compact (scrolled) (?path=/story/components-sitenav--compact)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, SiteNav } from "@thewhatmatters/wmds";
import { Sparkles } from "lucide-react";

// Controlled state — useful for tests and static specimens. Omit `state` to let scroll drive it.
export function CompactNav() {
  return (
    <SiteNav
      state="compact"
      start={<SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />}
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="/work" current>Work</SiteNav.Link>
          <SiteNav.Link href="/about">About</SiteNav.Link>
          <SiteNav.Link href="/journal">Journal</SiteNav.Link>
        </SiteNav.Links>
      }
      end={<Button role="primary" size="sm" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>}
    />
  );
}
