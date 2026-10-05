// @thewhatmatters/wmds@0.4.3 · Pattern — marketing hero with sequenced gallery
// Storybook: Components/FooterReveal → Pattern — marketing hero with sequenced gallery (?path=/story/components-footerreveal--sequenced-marketing-hero)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

"use client";

// npm install @rive-app/react-canvas gsap @gsap/react
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { Sparkles } from "lucide-react";
import { Button, FooterReveal, GridOverlay, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav, TextSequence, footerRevealFieldClasses } from "@thewhatmatters/wmds";

const socialLinks = [
  { label: "Contra", href: "#contra-TODO" },
  { label: "Instagram", href: "https://www.instagram.com/thewhatmatters" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/randymdaniel" },
  { label: "X", href: "#x-TODO" },
] as const;

const tiles = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
];

const projects = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];

// Opens the multi-step project form. There is no /start route.
function openProjectModal() {}

export function SequencedMarketingHeroPage() {
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
        <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full shrink-0 flex-col items-center justify-center-safe overflow-x-clip overflow-y-visible bg-body py-12 text-center">
          <div className="flex w-full flex-col items-center gap-6">
          <HeroIntro
            step="display"
            lead={
              <TextSequence idle emphasis="none" stagger={0.07}>
                {"An "}
                <span className="whitespace-nowrap">
                  Austin,&nbsp;TX{" "}
                  <RiveHand hand="rock" inline idle entrance="none" aria-hidden />
                  {" "}
                </span>
                {"studio specializing in brand and product design."}
              </TextSequence>
            }
          />
            <div className="w-full px-[var(--grid-margin)]">
            <HeroTileStack tiles={tiles} />
            </div>
          </div>
        </section>
        <ScrollHorizontal
          items={projects}
          expandLast
          intro={
            <ScrollHorizontal.Intro
              eyebrow="SELECTED WORK"
              statement={
                <>
                  {"Every screen"}
                  <TextSequence.Shape variant="asterisk" />
                  {" is a first impression "}
                  <RiveHand hand="point" inline idle entrance="none" aria-hidden />
                  {" and we make yours"}
                  <TextSequence.Shape variant="diamond" tone="accent" />
                  {" the one they remember."}
                </>
              }
              action={{ label: "Start a project", onClick: openProjectModal }}
            />
          }
        />
        <main className="grid-page bg-body !py-0">
          <GridOverlay visible keyboardShortcut={false} />
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
