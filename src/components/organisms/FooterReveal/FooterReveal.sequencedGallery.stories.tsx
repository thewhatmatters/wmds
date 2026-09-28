import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { Button } from "../../atoms/Button/Button";
import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { GridOverlay } from "../../../lib/GridOverlay";
import { stickyFooterInFlowTop } from "../../../lib/gridOverlayUtils";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
import { TextSequence } from "../../molecules/TextSequence/TextSequence";
import { HeroTileStack } from "../HeroTileStack/HeroTileStack";
import { ScrollHorizontal } from "../ScrollHorizontal/ScrollHorizontal";
import { scrollHorizontalIntroStatement, scrollHorizontalMarketingItems } from "../ScrollHorizontal/scrollHorizontalExamples";
import { SiteNav } from "../SiteNav/SiteNav";
import { FooterReveal } from "./FooterReveal";
import { footerRevealFieldClasses, footerRevealRuledFieldClasses } from "./footerRevealStyles";

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

// npm install @rive-app/react-canvas gsap @gsap/react
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { Sparkles } from "lucide-react";
import { Button, FooterReveal, GridOverlay, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav, TextSequence, footerRevealFieldClasses } from "@whatmatters/wmds";

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
        <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body py-12 text-center">
          <div className="flex w-full flex-col items-center gap-6">
          <HeroIntro
            step="display"
            lead={
              <TextSequence idle emphasis="none" stagger={0.07}>
                {"Your brand "}
                <RiveHand hand="rock" inline idle entrance="none" aria-hidden />
                {" is already "}
                <TextSequence.Shape variant="circle" tone="accent" />
                {" online"}
              </TextSequence>
            }
          >
            <TextSequence idle emphasis="none" delay={0.35} stagger={0.07}>
              Make it <TextSequence.Shape variant="pill" tone="brand-soft" /> impossible to ignore
            </TextSequence>
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

`.trim();

const marketingHeroRuledCopySource = marketingHeroWithGalleryIntroCopySource
  .replaceAll("footerRevealFieldClasses", "footerRevealRuledFieldClasses")
  .replace(
    `      <FooterReveal.Footer className={footerRevealRuledFieldClasses}>
        <FooterReveal.Brand
          headline="We Build WhatMatters"
          ctaLabel="Start a project"
          onCtaClick={openProjectModal}
          wordmark="WHATMATTERS"
          socialLinks={socialLinks}
        />
      </FooterReveal.Footer>`,
    `      <FooterReveal.Footer className={footerRevealRuledFieldClasses}>
        <FooterReveal.Ruled />
      </FooterReveal.Footer>`,
  )
  .replace(
    `const socialLinks = [
  { label: "Contra", href: "#contra-TODO" },
  { label: "Instagram", href: "https://www.instagram.com/thewhatmatters" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/randymdaniel" },
  { label: "X", href: "#x-TODO" },
] as const;

`,
    "",
  )
  .replace(
    "export function SequencedMarketingHeroPage()",
    "export function MarketingHeroRuledPage()",
  );

function SequencedGalleryHeroPage({ ruled = false }: { ruled?: boolean } = {}) {
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
        <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body py-12 text-center">
          <div className="flex w-full flex-col items-center gap-6">
          <HeroIntro
            step="display"
            lead={
              <TextSequence idle emphasis="none" stagger={0.07}>
                {"Your brand "}
                <RiveHand hand="rock" inline idle entrance="none" aria-hidden />
                {" is already "}
                <TextSequence.Shape variant="circle" tone="accent" />
                {" online"}
              </TextSequence>
            }
          >
            <TextSequence idle emphasis="none" delay={0.35} stagger={0.07}>
              Make it <TextSequence.Shape variant="pill" tone="brand-soft" /> impossible to ignore
            </TextSequence>
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
      <FooterReveal.Footer className={ruled ? footerRevealRuledFieldClasses : footerRevealFieldClasses}>
        {ruled ? (
          <FooterReveal.Ruled />
        ) : (
          <FooterReveal.Brand
            headline="We Build WhatMatters"
            ctaLabel="Start a project"
            onCtaClick={openProjectModal}
            wordmark="WHATMATTERS"
            socialLinks={socialLinks}
          />
        )}
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

/** TextSequence stays at rest when the reader prefers reduced motion. */
function textSequenceState(): "playing" | "rest" {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "rest" : "playing";
}

function reducedMotionList(query: string): MediaQueryList {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  };
}

function ReducedMotionFrame({ children }: { children: ReactNode }) {
  const restore = useRef<typeof window.matchMedia | null>(null);
  if (typeof window !== "undefined") {
    if (!restore.current) restore.current = window.matchMedia.bind(window);
    const original = restore.current;
    window.matchMedia = (query: string) =>
      query.includes("prefers-reduced-motion") ? reducedMotionList(query) : original(query);
  }
  useEffect(() => {
    const original = restore.current;
    return () => {
      if (original) window.matchMedia = original;
    };
  }, []);
  return children;
}

function pageGridContentStart(): number {
  const probe = document.createElement("div");
  probe.className = "grid-page";
  document.body.appendChild(probe);
  const start =
    probe.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(probe).paddingLeft);
  probe.remove();
  return start;
}

function expectSequencedHeroMatchesGallery(root: ParentNode) {
  const section = root.querySelector("[data-scroll-horizontal]");
  if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
  const intro = section.querySelector("[data-scroll-horizontal-intro]");
  const statement = section.querySelector("h2");
  const heroSeq = [...root.querySelectorAll("[data-text-sequence]")].find(
    (node) => !section.contains(node),
  );
  if (!(intro instanceof HTMLElement) || !(statement instanceof HTMLElement)) {
    throw new Error("gallery intro missing");
  }
  if (!(heroSeq instanceof HTMLElement)) {
    throw new Error("hero subtext missing");
  }
  const heroCopy = heroSeq.closest("h1");
  if (!(heroCopy instanceof HTMLElement)) throw new Error("hero subtext missing");
  const heroStyle = getComputedStyle(heroCopy);
  const statementStyle = getComputedStyle(statement);
  expect(Math.abs(intro.getBoundingClientRect().left - pageGridContentStart())).toBeLessThanOrEqual(1);
  expect(heroStyle.fontSize).toBe(statementStyle.fontSize);
  expect(heroStyle.lineHeight).toBe(statementStyle.lineHeight);
  expect(heroStyle.fontWeight).toBe("400");
  expect(statementStyle.fontWeight).toBe("400");
  expect(heroCopy.className).toContain("type-display-2");
  expect(statement.className).toContain("type-display-2");
  expect(heroCopy.className).toContain("text-pretty");
  expect(statement.className).toContain("text-pretty");
  expect(heroStyle.textWrap).toBe("pretty");
  expect(statementStyle.textWrap).toBe("pretty");
  expect(heroCopy.scrollWidth).toBeLessThanOrEqual(heroCopy.clientWidth + 1);
  expect(statement.scrollWidth).toBeLessThanOrEqual(statement.clientWidth + 1);
  expect(statement.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth + 1);
  const hand = heroCopy.querySelector("[data-rive-hand='rock']");
  const slot = hand?.parentElement;
  if (!(hand instanceof HTMLElement) || !(slot instanceof HTMLElement)) throw new Error("inline rock hand missing");
  expect(hand.getAttribute("aria-hidden")).toBe("true");
  expect(getComputedStyle(slot).height).toBe("0px");
  const lineHeight = Number.parseFloat(heroStyle.lineHeight);
  const lines = Math.round(heroCopy.getBoundingClientRect().height / lineHeight);
  expect(Math.abs(heroCopy.getBoundingClientRect().height - lines * lineHeight)).toBeLessThanOrEqual(1.5);
}

async function playSequencedMarketingHero(canvasElement: HTMLElement) {
  const section = canvasElement.querySelector("[data-scroll-horizontal]");
  if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
  expect(section.getAttribute("data-expand-last")).toBe("true");
  expect(section.getAttribute("data-has-intro")).toBe("true");
  const track = section.querySelector("[data-scroll-horizontal-track]");
  const intro = section.querySelector("[data-scroll-horizontal-intro]");
  expect(track?.firstElementChild).toBe(intro);
  expect(section.querySelector("[data-pattern='eyebrow']")?.textContent).toBe("SELECTED WORK");
  const heading = canvasElement.querySelector("h1");
  expect(heading?.textContent?.replace(/\s+/g, " ")).toContain("Your brand is already online");
  expect(heading?.textContent).not.toContain("We Are WhatMatters");
  expect(heading?.querySelector("[data-rive-hand='rock']")?.getAttribute("aria-hidden")).toBe("true");
  expect(section.querySelector("[data-rive-hand='point']")?.getAttribute("aria-hidden")).toBe("true");
  const text = canvasElement.textContent?.replace(/\s+/g, " ") ?? "";
  expect(text).toContain("Your brand is already online");
  expect(text).toContain("Make it impossible to ignore");
  expect(text).toContain(scrollHorizontalIntroStatement);
  expect(section.querySelectorAll("[data-text-sequence-shape]")).toHaveLength(2);
  expect(canvasElement.querySelectorAll("[data-text-sequence]")).toHaveLength(3);
  const action = [...section.querySelectorAll("button")].find((node) => node.textContent?.includes("Start a project"));
  expect(action?.getAttribute("data-role")).toBe("secondary");
  expect(action?.getAttribute("data-mono")).toBeNull();
  expect(action?.querySelector("svg")).toBeNull();
  openProjectModal.mockClear();
  action?.click();
  expect(openProjectModal).toHaveBeenCalledOnce();
  const statement = section.querySelector("h2");
  expect(statement?.tagName).toBe("H2");
  expect(statement?.getAttribute("role")).toBeNull();
  expect(statement?.textContent?.replace(/\s+/g, " ").trim()).toBe(scrollHorizontalIntroStatement);
  await waitFor(() => {
    const heroSequences = [...canvasElement.querySelectorAll("[data-text-sequence]")].filter(
      (node) => !section.contains(node),
    );
    expect(heroSequences).toHaveLength(2);
    for (const sequence of heroSequences) {
      expect(sequence.getAttribute("data-text-sequence-state")).toBe(textSequenceState());
    }
  });
  expectSequencedHeroMatchesGallery(canvasElement);

  const footer = canvasElement.querySelector("[data-footer-reveal='sticky']");
  if (!(footer instanceof HTMLElement)) throw new Error("footer missing");
  const footerTop = stickyFooterInFlowTop(footer);
  expect(footerTop).not.toBeNull();
  expectEdgesMeet(footerTop ?? 0, documentBottom(section));
}

export const SequencedMarketingHero: Story = {
  name: "Pattern — marketing hero with sequenced gallery",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Full marketing page on the navy footer. HeroIntro is the h1 and sequences the subtext on type-display-2 at normal weight and display-2 leading — the same size and line-height as the gallery statement: Your brand, then a rock RiveHand, then is already online, then Make it impossible to ignore. The rock hand uses inline, in place of the asterisk, drawn at about 1.15em with its outline bottom on the text baseline, and aria-hidden. That slot pops with the hero sequence on the beat after brand, with the same scale, rotation, and back.out(1.8) ease as the circle and the pill. Idle starts after the pop. The circle and pill stay at about 1.15em. ScrollHorizontal.Intro sequences the gallery statement once, when that panel scrolls into view. At rest the panel's left edge is the page-grid content start; scroll carries it off with the tiles. An asterisk, a point RiveHand after impression, and an accent diamond sit in the statement. The point hand pops with that statement on the beat after impression, then idles. The accessible name is the plain sentence. The action is Button role secondary, labeled Start a project, with onClick opening the project modal. expandLast still ends on the full-bleed tile, flush with FooterReveal.Brand. Reduced motion leaves both sequences at rest, shapes and hands included, on one static frame, and keeps the grid inset. The ruled-footer page is Pattern — marketing hero ruled grid.",
        },
      },
    },
    marketingHeroWithGalleryIntroCopySource,
  ),
  render: () => <SequencedGalleryHeroPage />,
  play: async ({ canvasElement }) => {
    await playSequencedMarketingHero(canvasElement);
  },
};

export const SequencedGalleryReducedMotion: Story = {
  name: "Sequenced gallery — reduced motion",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => (
    <ReducedMotionFrame>
      <SequencedGalleryHeroPage />
    </ReducedMotionFrame>
  ),
  play: async ({ canvasElement }) => {
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
    await playSequencedMarketingHero(canvasElement);
    expect(textSequenceState()).toBe("rest");
  },
};

export const MarketingHeroRuledPattern: Story = {
  name: "Pattern — marketing hero ruled grid",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "The one full marketing page. Sequenced hero (same as Pattern — marketing hero text sequence): HeroIntro is the h1 on type-display-2, with the rock hand inline after Your brand. Then ScrollHorizontal with Intro and expandLast. Then FooterReveal.Ruled on footerRevealRuledFieldClasses. Horizontal rules span the footer field; content and the grid edges stay in the page grid box. The intro action is Button role secondary, onClick openProjectModal. Show code is that whole page. Reduced motion leaves the sequences at rest. The gallery section ends on the expanded tile, flush with the ruled footer.",
        },
      },
    },
    marketingHeroRuledCopySource,
  ),
  render: () => <SequencedGalleryHeroPage ruled />,
  play: async ({ canvasElement }) => {
    await playSequencedMarketingHero(canvasElement);
    const fade = canvasElement.querySelector<HTMLElement>("[data-footer-reveal='fade']");
    const band = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='band']");
    const grid = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='grid']");
    if (!fade || !band || !grid) throw new Error("ruled footer missing");
    const bandBox = band.getBoundingClientRect();
    const gridBox = grid.getBoundingClientRect();
    expect(Math.abs(band.offsetWidth - fade.offsetWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(gridBox.left - bandBox.left - (bandBox.right - gridBox.right))).toBeLessThanOrEqual(1);
    expect(getComputedStyle(band).borderBottomColor.replace(/\s/g, "")).toBe("rgb(1,18,114)");
    expect(canvasElement.querySelector("[data-footer-ruled='wordmark']")?.textContent).toBe("WhatMatters");
    expect(canvasElement.textContent).not.toContain("WHATMATTERS");
    expect(canvasElement.textContent).not.toContain("We Build WhatMatters");
    expect(canvasElement.textContent).not.toContain("Selected work");
  },
};

export const SequencedGalleryHandoff: Story = {
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => <SequencedGalleryHeroPage />,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    const intro = section.querySelector("[data-scroll-horizontal-intro]");
    if (intro instanceof HTMLElement) intro.scrollIntoView({ block: "center" });
    const statement = section.querySelector("h2");
    const reduced = textSequenceState() === "rest";
    await waitFor(() => {
      expect(statement?.getAttribute("role")).toBeNull();
      expect(statement?.querySelector("[data-text-sequence]")?.getAttribute("data-text-sequence-state")).toBe(
        textSequenceState(),
      );
      expect(statement?.getAttribute("aria-label")).toBe(reduced ? null : scrollHorizontalIntroStatement);
    });

    const footer = canvasElement.querySelector("[data-footer-reveal='sticky']");
    if (!(footer instanceof HTMLElement)) throw new Error("footer missing");

    if (reduced) {
      const reducedSection = [...section.querySelectorAll("[data-scroll-horizontal-expanded]")].find(
        (host) => host instanceof HTMLElement && host.className.includes("h-svh"),
      );
      if (!(reducedSection instanceof HTMLElement)) throw new Error("reduced section missing");
      expectEdgesMeet(documentBottom(reducedSection), documentBottom(section));
    } else {
      const endOfGrow =
        section.getBoundingClientRect().top + window.scrollY + section.offsetHeight - window.innerHeight;
      window.scrollTo(0, Math.max(0, endOfGrow));
      window.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        const layer = [...section.querySelectorAll("[data-scroll-horizontal-expanded]")].find(
          (host) => host instanceof HTMLElement && getComputedStyle(host).position === "absolute",
        );
        if (!(layer instanceof HTMLElement)) throw new Error("expand layer missing");
        const clip = getComputedStyle(layer).clipPath;
        const match = /inset\(([^)]+)\)/.exec(clip);
        expect(match).toBeTruthy();
        const parts = (match?.[1] ?? "")
          .replace(/round[\s\S]*$/, "")
          .trim()
          .split(/\s+/)
          .map((part) => Number.parseFloat(part));
        expect(parts.length).toBeGreaterThan(0);
        for (const inset of parts) expect(inset).toBeLessThanOrEqual(1);
        expectEdgesMeet(layer.getBoundingClientRect().bottom, section.getBoundingClientRect().bottom);
      });
    }
    const footerTop = stickyFooterInFlowTop(footer);
    expectEdgesMeet(footerTop ?? 0, documentBottom(section));
  },
};

const review1440Viewport = {
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
};

const review390Viewport = {
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

export const SequencedGalleryAt1440: Story = {
  name: "Sequenced gallery at 1440",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: { options: review1440Viewport },
  },
  render: () => <SequencedGalleryHeroPage />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeGreaterThanOrEqual(1440);
    expectSequencedHeroMatchesGallery(canvasElement);
  },
};

export const SequencedGalleryAt390: Story = {
  name: "Sequenced gallery at 390",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: { options: review390Viewport },
  },
  render: () => <SequencedGalleryHeroPage />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    expectSequencedHeroMatchesGallery(canvasElement);
    const sequences = [...canvasElement.querySelectorAll("[data-text-sequence]")].filter(
      (node) => !node.closest("[data-scroll-horizontal]"),
    );
    for (const node of sequences) {
      const box = node.getBoundingClientRect();
      expect(box.left).toBeGreaterThanOrEqual(-1);
      expect(box.right).toBeLessThanOrEqual(window.innerWidth + 1);
    }
  },
};
