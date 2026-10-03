// @thewhatmatters/wmds@0.3.0 · Pattern — marketing header
// Storybook: Components/SiteNav → Pattern — marketing header (?path=/story/components-sitenav--marketing-header)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, SiteNav } from "@thewhatmatters/wmds";
import { BookOpen, FileText, History, Mic, Sparkles, Target, Video } from "lucide-react";

export function MarketingHeader() {
  return (
    <>
      <SiteNav
        start={
          <SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />
        }
        middle={
          <SiteNav.Links>
            <SiteNav.Link href="/product" current>Product</SiteNav.Link>
            <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
            <SiteNav.Link href="/customers">Customers</SiteNav.Link>
            <SiteNav.Menu label="Resources">
              <SiteNav.MenuSection label="Featured">
                <SiteNav.Featured
                  media={<SiteNav.MenuMedia variant="featured" label="Featured story imagery" />}
                  title="WhatMatters named a Best Software Award winner"
                  description="How teams cut meeting load without losing alignment — and what we shipped next."
                  href="/featured"
                />
              </SiteNav.MenuSection>
              <SiteNav.MenuSection label="Read">
                <ul className="m-0 flex list-none flex-col p-0">
                  <li className="-mx-6 border-b border-border px-6 pb-5">
                    <SiteNav.ReadRow
                      media={<SiteNav.MenuMedia label="Docs imagery" />}
                      title="Docs"
                      description="Patterns and APIs for building calm product surfaces."
                      href="/docs"
                    />
                  </li>
                  <li className="px-0 pt-5">
                    <SiteNav.ReadRow
                      media={<SiteNav.MenuMedia label="Opinion imagery" />}
                      title="Opinion articles"
                      description="Notes on focus, backlog shape, and shipping what matters."
                      href="/opinion"
                    />
                  </li>
                </ul>
              </SiteNav.MenuSection>
              <SiteNav.MenuSection label="Links">
                <SiteNav.MenuLinkGrid>
                  <SiteNav.MenuLink href="/podcast" icon={<Mic />}>Podcast</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="https://youtube.com" icon={<Video />} external>YouTube</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/webinars" icon={<Target />}>Webinars</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/changelog" icon={<History />}>Changelog</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/blog" icon={<FileText />}>Blog</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/docs" icon={<BookOpen />}>Docs</SiteNav.MenuLink>
                </SiteNav.MenuLinkGrid>
              </SiteNav.MenuSection>
            </SiteNav.Menu>
          </SiteNav.Links>
        }
        end={
          <>
            <Button role="ghost" size="sm" render={<a href="/signin" />} className="whitespace-nowrap">Sign in</Button>
            <Button role="primary" size="sm" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>
          </>
        }
        mobile={
          <>
            <SiteNav.MobileLink href="/product" current>Product</SiteNav.MobileLink>
            <SiteNav.MobileLink href="/pricing">Pricing</SiteNav.MobileLink>
            <SiteNav.MobileLink href="/customers">Customers</SiteNav.MobileLink>
            <SiteNav.MobileLink href="/blog">Blog</SiteNav.MobileLink>
          </>
        }
      />
      <main className="grid-page">{/* page content — no pt-16; SiteNav is in flow */}</main>
    </>
  );
}
