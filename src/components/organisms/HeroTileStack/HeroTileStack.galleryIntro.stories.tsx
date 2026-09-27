import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { expect } from "storybook/test";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
import { scrollHorizontalIntroStatementNodes } from "../ScrollHorizontal/scrollHorizontalIntroStatement";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroTileStack } from "./HeroTileStack";
import { ScrollHorizontal } from "../ScrollHorizontal/ScrollHorizontal";
import { scrollHorizontalIntroStatement, scrollHorizontalMarketingItems } from "../ScrollHorizontal/scrollHorizontalExamples";
import { SiteNav } from "../SiteNav/SiteNav";

const meta = {
  title: "Components/Layout/HeroTileStack",
  component: HeroTileStack,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
} satisfies Meta<typeof HeroTileStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const heroTiles = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
];

const projects = scrollHorizontalMarketingItems;

const marketingHeroWithGalleryIntroCopySource = `
"use client";

// npm install @rive-app/react-canvas
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge, Button, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav, TextSequence } from "@whatmatters/wmds";

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

export function MarketingHeroWithGalleryIntro() {
  const [handsActive, setHandsActive] = useState(false);
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
      <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body py-16 text-center">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="w-full px-[var(--grid-margin)]">
          <h1
            className="type-display-1 isolate text-fg"
            tabIndex={0}
            onMouseEnter={() => setHandsActive(true)}
            onMouseLeave={() => setHandsActive(false)}
            onFocus={() => setHandsActive(true)}
            onBlur={() => setHandsActive(false)}
          >
            {[
              <span key="lead" className="relative inline-block whitespace-nowrap">{[
                <span key="gap" className="absolute inset-y-0 right-0 w-0">{[
                  <span key="clip" className="absolute z-10 overflow-clip -right-[0.94em] -top-[0.17em] bottom-[0.22em] w-[1.7em] md:-right-[1.07em] md:-top-[0.54em] md:w-[2.2em]">{[
                    <RiveHand key="rock" hand="rock" size="2.2em" active={handsActive} idle entrance="slide-up" className="absolute top-0 max-md:!h-[1.7em] max-md:!w-[1.7em]" />,
                  ]}</span>,
                ]}</span>,
                "We Ar",
                <span key="e" className="relative z-20">e</span>,
              ]}</span>,
              " ",
              <span key="brand" className="relative inline-block whitespace-nowrap">{[
                <span key="w" className="relative z-0">W</span>,
                "hatMatter",
                <span key="s" className="relative">{[
                  "s",
                  <RiveHand key="point" hand="point" size="2.2em" active={handsActive} idle entrance="grow" className="absolute z-10 -right-[1.2em] -top-[0.4em] max-md:!h-[1.7em] max-md:!w-[1.7em] md:-right-[1.53em] md:-top-[0.7em]" />,
                ]}</span>,
              ]}</span>,
            ]}
          </h1>
          </div>
          <HeroIntro lead="We're a design and product studio based in Austin, Texas.">
            We help brands stand out{" "}
            <Badge variant="info" size="md" emphasis="muted" className="align-middle" avatar={{ src: "/hero-badges/globe.svg", alt: "" }}>online</Badge>
            {" "}with bold ideas, fresh approaches, and products people actually love to use.
          </HeroIntro>
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
                {" is a first impression"}
                <TextSequence.Shape variant="pill" tone="brand-soft" />
                {" and we make yours"}
                <TextSequence.Shape variant="diamond" tone="accent" />
                {" the one they remember."}
              </>
            }
            action={{ label: "Start a project" }}
          />
        }
      />
    </>
  );
}

`.trim();

function GalleryIntroHero() {
  const [handsActive, setHandsActive] = useState(false);
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
      <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body py-16 text-center">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="w-full px-[var(--grid-margin)]">
          <h1
            className="type-display-1 isolate text-fg"
            tabIndex={0}
            onMouseEnter={() => setHandsActive(true)}
            onMouseLeave={() => setHandsActive(false)}
            onFocus={() => setHandsActive(true)}
            onBlur={() => setHandsActive(false)}
          >
            {[
              <span key="lead" className="relative inline-block whitespace-nowrap">{[
                <span key="gap" className="absolute inset-y-0 right-0 w-0">{[
                  <span key="clip" className="absolute z-10 overflow-clip -right-[0.94em] -top-[0.17em] bottom-[0.22em] w-[1.7em] md:-right-[1.07em] md:-top-[0.54em] md:w-[2.2em]">{[
                    <RiveHand key="rock" hand="rock" size="2.2em" active={handsActive} idle entrance="slide-up" className="absolute top-0 max-md:!h-[1.7em] max-md:!w-[1.7em]" />,
                  ]}</span>,
                ]}</span>,
                "We Ar",
                <span key="e" className="relative z-20">e</span>,
              ]}</span>,
              " ",
              <span key="brand" className="relative inline-block whitespace-nowrap">{[
                <span key="w" className="relative z-0">W</span>,
                "hatMatter",
                <span key="s" className="relative">{[
                  "s",
                  <RiveHand key="point" hand="point" size="2.2em" active={handsActive} idle entrance="grow" className="absolute z-10 -right-[1.2em] -top-[0.4em] max-md:!h-[1.7em] max-md:!w-[1.7em] md:-right-[1.53em] md:-top-[0.7em]" />,
                ]}</span>,
              ]}</span>,
            ]}
          </h1>
          </div>
          <HeroIntro lead="We're a design and product studio based in Austin, Texas.">
            We help brands stand out{" "}
            <Badge variant="info" size="md" emphasis="muted" className="align-middle" avatar={{ src: "/hero-badges/globe.svg", alt: "" }}>online</Badge>
            {" "}with bold ideas, fresh approaches, and products people actually love to use.
          </HeroIntro>
            <div className="w-full px-[var(--grid-margin)]">
            <HeroTileStack tiles={heroTiles} />
            </div>
        </div>
      </section>
      <ScrollHorizontal
        items={projects}
        expandLast
        intro={
          <ScrollHorizontal.Intro
            eyebrow="SELECTED WORK"
            statement={scrollHorizontalIntroStatementNodes()}
            action={{ label: "Start a project" }}
          />
        }
      />
    </>
  );
}

export const MarketingHeroWithGalleryIntro: Story = {
  name: "Marketing hero with gallery intro",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Same marketing hero as Pattern — marketing hero, with ScrollHorizontal.Intro as the first gallery panel. The eyebrow names the section. expandLast is unchanged: the last tile still grows to the viewport. The default Pattern — marketing hero stays on the sr-only Selected work heading.",
        },
      },
    },
    marketingHeroWithGalleryIntroCopySource,
  ),
  render: () => <GalleryIntroHero />,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    expect(section.getAttribute("data-expand-last")).toBe("true");
    expect(section.getAttribute("data-has-intro")).toBe("true");
    const intro = section.querySelector("[data-scroll-horizontal-intro]");
    const track = section.querySelector("[data-scroll-horizontal-track]");
    expect(track?.firstElementChild).toBe(intro);
    expect(section.querySelector("[data-pattern='eyebrow']")?.textContent).toBe("SELECTED WORK");
    expect(section.textContent?.replace(/\s+/g, " ")).toContain(scrollHorizontalIntroStatement);
    expect(section.textContent).not.toContain("Selected work");
  },
};
