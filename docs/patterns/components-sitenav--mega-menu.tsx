// @thewhatmatters/wmds@0.3.0 · Pattern — mega menu
// Storybook: Components/SiteNav → Pattern — mega menu (?path=/story/components-sitenav--mega-menu)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { SiteNav } from "@thewhatmatters/wmds";
import { BookOpen, FileText, History, Mic, Target, Video } from "lucide-react";

export function ResourcesMenu() {
  return (
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
  );
}
