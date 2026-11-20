// @thewhatmatters/wmds@0.4.54 · Variant — glass
// Storybook: Components/SiteNav → Variant — glass (?path=/story/components-sitenav--glass)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, SiteNav } from "@thewhatmatters/wmds";

export function GlassNav() {
  return (
    <SiteNav
      variant="glass"
      overMedia
      start={<SiteNav.Brand href="/">Cinder &amp; Sotol</SiteNav.Brand>}
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="/menu">Menu</SiteNav.Link>
          <SiteNav.Link href="/visit">Visit</SiteNav.Link>
        </SiteNav.Links>
      }
      end={
        <Button role="primary" size="sm" render={<a href="/book" />}>
          Book a table
        </Button>
      }
    />
  );
}
