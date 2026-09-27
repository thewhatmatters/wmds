import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { GridOverlay } from "../../../lib/GridOverlay";
import { stickyFooterInFlowTop } from "../../../lib/gridOverlayUtils";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
import { TextSequence } from "../../molecules/TextSequence/TextSequence";
import { HeroTileStack } from "../HeroTileStack/HeroTileStack";
import { ScrollHorizontal } from "../ScrollHorizontal/ScrollHorizontal";
import { scrollHorizontalMarketingItems } from "../ScrollHorizontal/scrollHorizontalExamples";
import { SiteNav } from "../SiteNav/SiteNav";
import { FooterReveal } from "./FooterReveal";
import { footerRevealFieldClasses } from "./footerRevealStyles";

const meta = {
  title: "Components/Layout/FooterReveal",
  component: FooterReveal,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: { wmdsLayout: "fullscreen" },
} satisfies Meta<typeof FooterReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

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

const projects = scrollHorizontalMarketingItems;

const openProjectModal = fn();

const marketingHeroWithGalleryIntroCopySource = `
"use client";

// npm install @rive-app/react-canvas
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge, Button, FooterReveal, GridOverlay, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav, TextSequence, footerRevealFieldClasses } from "@whatmatters/wmds";

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

export function MarketingHeroWithGalleryIntroPage() {
  const [handsActive, setHandsActive] = useState(false);
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

`.trim();

function GalleryIntroHeroPage() {
  const [handsActive, setHandsActive] = useState(false);
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


function documentBottom(el: HTMLElement): number {
  return el.getBoundingClientRect().bottom + window.scrollY;
}

function expectEdgesMeet(a: number, b: number) {
  expect(Math.abs(a - b)).toBeLessThanOrEqual(1);
}

function clipInsets(clip: string): number[] {
  const match = /inset\(([^)]+)\)/.exec(clip);
  if (!match?.[1]) return [Number.POSITIVE_INFINITY];
  const body = match[1].replace(/round[\s\S]*$/, "").trim();
  const parts = body.split(/\s+/).map((part) => Number.parseFloat(part));
  if (parts.length === 1 && Number.isFinite(parts[0])) return [parts[0], parts[0], parts[0], parts[0]];
  return parts;
}

/** Last tile at the end of `expandLast`: the sticky window, no neighbors, then a flush footer. */
async function expectLastTileFillsViewport(canvasElement: HTMLElement) {
  const section = canvasElement.querySelector("[data-scroll-horizontal]");
  if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
  expect(section.getAttribute("data-expand-last")).toBe("true");
  expect(section.getAttribute("data-has-intro")).toBe("true");
  const track = section.querySelector("[data-scroll-horizontal-track]");
  if (!(track instanceof HTMLElement)) throw new Error("intro track missing");
  expect(track.className).not.toMatch(/(?:^|\s)p-0(?:\s|$)/);
  expect(track.className).not.toContain("pl-[");
  expect(track.className).toContain("ps-[");

  const sticky = section.firstElementChild;
  if (!(sticky instanceof HTMLElement)) throw new Error("sticky missing");
  const footer = canvasElement.querySelector("[data-footer-reveal='sticky']");
  if (!(footer instanceof HTMLElement)) throw new Error("footer missing");
  const footerTop = stickyFooterInFlowTop(footer);
  expect(footerTop).not.toBeNull();
  expectEdgesMeet(footerTop ?? 0, documentBottom(section));

  const endOfGrow =
    section.getBoundingClientRect().top + window.scrollY + section.offsetHeight - window.innerHeight;
  window.scrollTo(0, Math.max(0, endOfGrow));
  window.dispatchEvent(new Event("scroll"));

  await waitFor(() => {
    const layer = [...section.querySelectorAll("[data-scroll-horizontal-expanded]")].find(
      (host) => host instanceof HTMLElement && getComputedStyle(host).position === "absolute",
    );
    if (!(layer instanceof HTMLElement)) throw new Error("expand layer missing");
    expect(layer.className).not.toContain("inset-0");
    expect(layer.className).toContain("top-0");
    expect(layer.className).toContain("left-0");
    const insets = clipInsets(getComputedStyle(layer).clipPath);
    expect(insets.length).toBeGreaterThan(0);
    for (const inset of insets) expect(inset).toBeLessThanOrEqual(1);

    const layerRect = layer.getBoundingClientRect();
    const stickyRect = sticky.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    expectEdgesMeet(layerRect.left, stickyRect.left);
    expectEdgesMeet(layerRect.top, stickyRect.top);
    expectEdgesMeet(layerRect.right, stickyRect.right);
    expectEdgesMeet(layerRect.bottom, stickyRect.bottom);
    expectEdgesMeet(layerRect.bottom, sectionRect.bottom);
    expectEdgesMeet(layerRect.height, window.innerHeight);
    expectEdgesMeet(stickyRect.height, window.innerHeight);
    expectEdgesMeet(layerRect.width, sectionRect.width);
    expect(layerRect.width).toBeGreaterThan(window.innerWidth * 0.9);

    const peers = [...section.querySelectorAll("li")].slice(0, -1);
    expect(peers.length).toBeGreaterThan(0);
    for (const peer of peers) {
      expect(Number.parseFloat(getComputedStyle(peer).opacity)).toBeLessThanOrEqual(0.05);
    }
  });
  expectEdgesMeet(footerTop ?? 0, documentBottom(section));
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
            "Same marketing hero as Pattern — marketing hero, with ScrollHorizontal.Intro as the first gallery panel. expandLast still ends on the full-bleed tile, flush with FooterReveal. The default pattern keeps the sr-only Selected work heading.",
        },
      },
    },
    marketingHeroWithGalleryIntroCopySource,
  ),
  render: () => <GalleryIntroHeroPage />,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    const track = section.querySelector("[data-scroll-horizontal-track]");
    const intro = section.querySelector("[data-scroll-horizontal-intro]");
    expect(track?.firstElementChild).toBe(intro);
    expect(section.querySelector("[data-pattern='eyebrow']")?.textContent).toBe("SELECTED WORK");
    await expectLastTileFillsViewport(canvasElement);
  },
};

const expandViewportOptions = {
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
  review1024: {
    name: "Review 1024",
    styles: { width: "1024px", height: "768px" },
    type: "tablet" as const,
  },
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
  review1920: {
    name: "Review 1920",
    styles: { width: "1920px", height: "1080px" },
    type: "desktop" as const,
  },
  review2560: {
    name: "Review 2560",
    styles: { width: "2560px", height: "1440px" },
    type: "desktop" as const,
  },
};

function expandViewportStory(id: keyof typeof expandViewportOptions, minWidth: number, maxWidth: number): Story {
  return {
    name: `Handoff — intro expand at ${id.replace("review", "")}`,
    tags: ["test", "!dev", "!autodocs"],
    globals: {
      viewport: { value: id, isRotated: false },
    },
    parameters: {
      wmdsLayout: "fullscreen",
      docs: { disable: true },
      viewport: { options: expandViewportOptions },
    },
    render: () => <GalleryIntroHeroPage />,
    play: async ({ canvasElement }) => {
      expect(window.innerWidth).toBeGreaterThanOrEqual(minWidth);
      expect(window.innerWidth).toBeLessThanOrEqual(maxWidth);
      await expectLastTileFillsViewport(canvasElement);
    },
  };
}

export const IntroExpandAt390: Story = expandViewportStory("review390", 390, 400);
export const IntroExpandAt1024: Story = expandViewportStory("review1024", 1024, 1040);
export const IntroExpandAt1440: Story = expandViewportStory("review1440", 1440, 1455);
export const IntroExpandAt1920: Story = expandViewportStory("review1920", 1920, 1935);
export const IntroExpandAt2560: Story = expandViewportStory("review2560", 2560, 2575);
