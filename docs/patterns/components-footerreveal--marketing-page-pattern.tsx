// @thewhatmatters/wmds@0.4.1 · Pattern — marketing page
// Storybook: Components/FooterReveal → Pattern — marketing page (?path=/story/components-footerreveal--marketing-page-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, FooterReveal, SiteNav, footerRevealFieldClasses } from "@thewhatmatters/wmds";
import { Sparkles } from "lucide-react";

const socialLinks = [
  { label: "Contra", href: "#contra-TODO" },
  { label: "Instagram", href: "https://www.instagram.com/thewhatmatters" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/randymdaniel" },
  { label: "X", href: "#x-TODO" },
] as const;

// Opens the multi-step project form. There is no /start route.
function openProjectModal() {}

export function MarketingPage() {
  return (
    <FooterReveal>
      <FooterReveal.Content>
        <SiteNav
          start={<SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles strokeWidth={2} />} />}
          middle={
            <SiteNav.Links>
              <SiteNav.Link href="/product" current>Product</SiteNav.Link>
              <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
              <SiteNav.Link href="/customers">Customers</SiteNav.Link>
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
            </>
          }
        />
        <main className="grid-page">
          <div className="band pt-10">
            <div className="col-span-full flex flex-col gap-4 lg:col-span-8 lg:col-start-3">
              <p className="type-supporting font-medium uppercase tracking-wider text-muted">WhatMatters</p>
              <h1 className="type-display-2 text-fg">Plan the week around what matters.</h1>
              <p className="type-body max-w-prose text-muted">
                WhatMatters turns a noisy backlog into one calm list. Set priorities once and let the week reshuffle itself.
              </p>
            </div>
          </div>
          <div className="band py-16">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">Scroll to the end of the cover</h2>
              <p className="type-body max-w-prose text-muted">
                The footer sits underneath. It starts soft and blurred, then sharpens across its own height.
              </p>
            </div>
          </div>
        </main>
      </FooterReveal.Content>
      <FooterReveal.Footer className={footerRevealFieldClasses}>
        <FooterReveal.Brand
          headline="We Build WhatMatters"
          ctaLabel="Start a project"
          onCtaClick={openProjectModal}
          wordmark="WHATMATTERS"
          socialLinks={socialLinks}
        />
      </FooterReveal.Footer>
    </FooterReveal>
  );
}
