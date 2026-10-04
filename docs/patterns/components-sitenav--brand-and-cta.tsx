// @thewhatmatters/wmds@0.4.0 · Pattern — brand + CTA
// Storybook: Components/SiteNav → Pattern — brand + CTA (?path=/story/components-sitenav--brand-and-cta)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, SiteNav } from "@thewhatmatters/wmds";
import { Sparkles } from "lucide-react";

export function BrandAndCtaNav() {
  return (
    <SiteNav
      start={
        <SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />
      }
      end={<Button role="primary" size="sm" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>}
    />
  );
}
