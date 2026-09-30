import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { MotionConfig } from "motion/react";
import { expect, fn, waitFor } from "storybook/test";
import { Badge } from "../../atoms/Badge/Badge";
import { GridOverlay } from "../../../lib/GridOverlay";
import { stickyFooterInFlowTop } from "../../../lib/gridOverlayUtils";
import { lockedViewportGlobals, storybookViewports } from "../../../lib/viewports";
import { Button } from "../../atoms/Button/Button";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
import { HeroTileStack } from "../HeroTileStack/HeroTileStack";
import { ScrollHorizontal } from "../ScrollHorizontal/ScrollHorizontal";
import { scrollHorizontalMarketingItems } from "../ScrollHorizontal/scrollHorizontalExamples";
import { SiteNav } from "../SiteNav/SiteNav";
import { FooterReveal } from "./FooterReveal";
import { footerRevealRuledDefaultCopy } from "./FooterRevealRuled";
import { footerRevealWordmarkFillsFrame } from "./footerRevealWordmark";
import { footerRevealFieldClasses, footerRevealRuledFieldClasses } from "./footerRevealStyles";

const meta = {
  title: "Components/Layout/FooterReveal",
  component: FooterReveal,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Page root for a marketing scroll: **FooterReveal.Content** (the cover) then **FooterReveal.Footer** (the brand footer, or any footer). The cover is at least \`100dvh\`, painted with the page background, and stacked above the footer. The footer sticks to the bottom of the viewport underneath that cover.

As the cover's bottom edge meets the viewport bottom, the footer scrubs from transparent / 0.9 scale / 12px blur to opaque / full size / sharp, across one footer-height of scroll. \`will-change\` is set only while that scrub is in progress.

\`prefers-reduced-motion\`: the footer stays fully visible — opacity 1, scale 1, no blur.

| Slot | Purpose |
|------|---------|
| **FooterReveal.Content** | Page body. Opaque (\`bg-body\` by default). Do not clip overflow on the root |
| **FooterReveal.Footer** | Footer contents. \`className\` lands on the fading field — use **\`footerRevealFieldClasses\`** (\`bg-brand\` / \`text-on-brand\`) |
| **FooterReveal.Brand** | Headline, inverse CTA, underlined social row, and a decorative wordmark on the navy field |
| **FooterReveal.Ruled** | Cream field, at least 100vh: centered nav, fitted wordmark, quiet meta row |
| \`useFooterRevealProgress\` | Reveal progress MotionValue, 0 covered → 1 uncovered (stuck at 1 when reduced motion is on) |

## Anatomy

\`\`\`
FooterReveal — isolation: isolate (overflow visible, so grid guides can leave the page)
├── FooterReveal.Content — relative, z-index 1, min-height 100dvh, bg-body
└── FooterReveal.Footer — sticky, bottom 0, z-index -1
    └── fade (opacity) → scale / blur (origin 50% 100%, blur 12px → 0) → footer contents
        ├── FooterReveal.Brand
        │   ├── headline (type-display-1, centered)
        │   ├── Button role="inverse" type="button" (onCtaClick)
        │   ├── social links (underlined, https opens in a new tab)
        │   └── wordmark (aria-hidden, spans the footer width, cropped at the bottom edge)
        └── FooterReveal.Ruled — min-height 100vh; grows when the content is taller
            ├── nav (TextLink: Services, Resources, About; parent is sans, 4xl below sm, 4rem from sm, text-brand)
            ├── wordmark (aria-hidden, fitted to the footer width, fully visible)
            └── quiet row (WM + copyright, randy@whatmatters.so, credit)
\`\`\`

## Best practices

- One **FooterReveal** per page. Put **SiteNav** and the page or marketing hero inside **Content**.
- Field color is **\`footerRevealFieldClasses\`** (\`bg-brand\` / \`text-on-brand\`). \`--color-brand\` is \`#011272\` in both themes. White on that navy reports **15.8:1**. The wordmark uses \`--color-brand-soft\` (40% white on the navy) so it stays visible.
- The CTA is a **Button** \`role="inverse"\` \`type="button"\` (\`onCtaClick\`). It opens a modal; there is no default route. Pass \`ctaHref\` only when the control should be a link. Do not recolor it with \`className\`.
- Social links use **\`footerRevealFieldLinkClasses\`** at heading-1 size. \`https\` hrefs set \`target="_blank"\` and \`rel="noopener"\`. Placeholder hashes stay on the same page.
- The wordmark is decorative (\`aria-hidden\`). It spans the footer width: font-size is \`100cqi\` divided by the measured advance width of the word, with no breakpoint cap. The brand panel crops it at the bottom edge, so it does not widen the page.
- Do not hide the scrollbar. The page grid already reserves a stable gutter. The root does not clip — that would trap **GridOverlay** guides inside \`main\`. The brand panel clips its wordmark. **FooterReveal.Ruled** fits its wordmark inside the footer width so the letters stay visible.
- Do not put \`overflow-hidden\` on **FooterReveal** — it breaks \`position: sticky\`. The brand panel clips its own wordmark.
- When **ScrollHorizontal** \`expandLast\` is the last section in the cover, the guide \`grid-page\` after it uses \`!py-0\`. Default \`grid-page\` block padding is \`--grid-pad\` (24px top and bottom). On a guide-only host that padding is a page-background strip between the full-bleed tile and the footer. The reduced-motion \`h-svh\` section meets the footer the same way.
- **FooterReveal.Ruled** is the cream marketing footer. Pass **\`footerRevealRuledFieldClasses\`** (\`bg-body\` / \`text-brand\`) on **Footer**. The field and the ruled shell are at least \`100vh\`; taller content grows them. The nav, wordmark, and quiet row are not clipped. The nav is one centered stack of **TextLink**: Services, Resources, About. The list sets Geist sans at \`--font-size-4xl\` below \`sm\` and 4rem from \`sm\`, and the links are \`text-brand\`. **TextLink** keeps its dotted underline, medium weight, and focus ring. The wordmark is \`WhatMatters\`, fitted to the footer width (\`100cqi\` / measured em) so it stays inside the viewport and is not cropped. Under it, a quiet row: the WM mark with WhatMatters © 2026, randy@whatmatters.so, and Created by WhatMatters 2024–2026. Below \`md\` that row stacks and stays centered. Dark theme keeps the field on \`--color-on-brand\`. **FooterReveal.Brand** stays the navy field.
        `.trim(),
      },
    },
  },
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

const marketingPageCopySource = `
import { Button, FooterReveal, SiteNav, footerRevealFieldClasses } from "@whatmatters/wmds";
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
`.trim();

const openProjectModal = fn();

function MarketingPage() {
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

export const MarketingPagePattern: Story = {
  name: "Pattern — marketing page",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Marketing page: **SiteNav** and `grid-page` sit in **FooterReveal.Content**. **FooterReveal.Footer** uses **footerRevealFieldClasses** (`bg-brand` / `text-on-brand`). **FooterReveal.Brand** centers the headline, an inverse CTA, and the social row, with a full-width wordmark along the bottom. Scroll until the cover ends — the footer fades, scales, and sharpens from 12px of blur across its own height. Reduced motion stays sharp. The scrollbar stays visible.",
        },
      },
    },
    marketingPageCopySource,
  ),
  render: () => <MarketingPage />,
};

const marketingHeroCopySource = `
"use client";

import { Sparkles } from "lucide-react";
import { Badge, Button, FooterReveal, GridOverlay, HeroIntro, HeroTileStack, ScrollHorizontal, SiteNav, footerRevealFieldClasses } from "@whatmatters/wmds";

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

export function MarketingHeroPage() {
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
        <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full shrink-0 flex-col items-center justify-center-safe overflow-x-clip overflow-y-visible bg-body py-16 text-center">
          <div className="flex w-full flex-col items-center gap-6">
          <HeroIntro lead="We're a design and product studio based in Austin, Texas.">
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
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
          expandLast
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

function MarketingHeroPage() {
  return <MarketingHeroCanvas />;
}

function MarketingHeroCanvas() {
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
        <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full shrink-0 flex-col items-center justify-center-safe overflow-x-clip overflow-y-visible bg-body py-16 text-center">
          <div className="flex w-full flex-col items-center gap-6">
          <HeroIntro lead="We're a design and product studio based in Austin, Texas.">
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
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
          expandLast
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

export const MarketingHeroPattern: Story = {
  name: "Pattern — marketing hero",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "The marketing hero (SiteNav, headline, intro, tile fan) fills **FooterReveal.Content**, then **ScrollHorizontal** with expandLast (Selected work is the accessible name, sr-only while the window is pinned — solid token-color placeholders), then the page grid (\`grid-page\` with \`!py-0\`, a guide host with no block padding). **FooterReveal.Brand** is the sticky footer underneath. Scroll past the hero — the gallery translates from the first card centered to the last, then the last tile grows to fill the viewport and scrolls away. The gallery section ends on that tile, so its bottom edge meets the footer. The brand field fades in from about 12px of blur after that cover. Reduced motion keeps the gallery as a native horizontal scroller with the heading visible above it, follows it with the last tile as a full-viewport section flush with the footer, and shows the footer sharp.",
        },
      },
    },
    marketingHeroCopySource,
  ),
  render: () => <MarketingHeroPage />,
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector("section");
    const page = canvasElement.querySelector("main");
    const footer = canvasElement.querySelector("[data-footer-reveal='sticky']");
    if (!hero || !page || !footer) throw new Error("hero, page, and footer must be mounted");

    await waitFor(() => {
      expect(canvasElement.querySelectorAll(".grid-guides-col").length).toBeGreaterThan(0);
    });

    const guides = canvasElement.querySelector(".grid-guides");
    if (!guides) throw new Error("grid guides missing");
    expect(getComputedStyle(guides).visibility).toBe("visible");
    expect(document.documentElement.classList.contains("grid-on")).toBe(true);

    const before = Number.parseFloat(guides.style.getPropertyValue("--grid-guides-before"));
    expect(before).toBeGreaterThan(0);

    const columns = [...canvasElement.querySelectorAll(".grid-guides-col")];
    const columnRect = columns[0]!.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    expect(columnRect.top).toBeLessThan(heroRect.top);
    expect(columnRect.bottom).toBeGreaterThan(heroRect.bottom);
    expect(columnRect.left).toBeLessThan(heroRect.right);
    expect(columnRect.right).toBeGreaterThan(heroRect.left);
    // Sticky `bottom: 0` paints the footer over the viewport. Its offsetTop is
    // that stuck position. The cover's bottom is the in-flow edge.
    const guideDocBottom = columnRect.bottom + window.scrollY;
    const footerDocTop = stickyFooterInFlowTop(footer as HTMLElement);
    expect(footerDocTop).not.toBeNull();
    expect(guideDocBottom).toBeGreaterThan(heroRect.bottom + window.scrollY - 1);
    expect(guideDocBottom).toBeLessThanOrEqual((footerDocTop ?? 0) + 1);
    expect(footerRect.top).toBeLessThan(heroRect.bottom);

    const fieldGuides = footer.querySelector("[data-footer-reveal='guides']");
    const field = footer.querySelector("[data-footer-reveal='field']");
    const headline = [...footer.querySelectorAll("h2")].find(
      (node) => node.textContent === "We Build WhatMatters",
    );
    if (!fieldGuides || !field || !headline) throw new Error("footer field guides missing");
    expect(getComputedStyle(fieldGuides).display).not.toBe("none");
    const fieldCols = fieldGuides.querySelector(".grid-guides-cols");
    expect(fieldCols?.getBoundingClientRect().height ?? 0).toBeGreaterThan(40);
    const guideZ = Number.parseInt(getComputedStyle(fieldGuides).zIndex, 10);
    const fieldZ = Number.parseInt(getComputedStyle(field).zIndex, 10);
    expect(fieldZ).toBeGreaterThan(guideZ);
    const cover = canvasElement.querySelector("[data-footer-reveal='content']");
    if (cover instanceof HTMLElement) window.scrollTo(0, cover.offsetHeight);
    const headlineBox = headline.getBoundingClientRect();
    const hit = document.elementFromPoint(
      headlineBox.left + headlineBox.width / 2,
      headlineBox.top + headlineBox.height / 2,
    );
    expect(hit === headline || headline.contains(hit)).toBe(true);

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );

    const cta = [...canvasElement.querySelectorAll("button")].find(
      (node) => node.textContent === "Start a project",
    );
    expect(cta?.getAttribute("type")).toBe("button");
    cta?.click();
    await waitFor(() => {
      expect(openProjectModal).toHaveBeenCalled();
    });
  },
};

function documentBottom(el: HTMLElement): number {
  return el.getBoundingClientRect().bottom + window.scrollY;
}

function expectEdgesMeet(a: number, b: number) {
  expect(Math.abs(a - b)).toBeLessThanOrEqual(1);
}

function gallerySection(root: ParentNode): HTMLElement {
  const section = root.querySelector<HTMLElement>("[data-scroll-horizontal]");
  if (!section) throw new Error("gallery missing");
  return section;
}

function footerSticky(root: ParentNode): HTMLElement {
  const footer = root.querySelector<HTMLElement>("[data-footer-reveal='sticky']");
  if (!footer) throw new Error("footer missing");
  return footer;
}

/** In-flow footer top is the cover's bottom. The expanded section must meet it. */
function expectGalleryMeetsFooter(root: ParentNode) {
  const section = gallerySection(root);
  const footer = footerSticky(root);
  const footerTop = stickyFooterInFlowTop(footer);
  expect(footerTop).not.toBeNull();
  expectEdgesMeet(footerTop ?? 0, documentBottom(section));
  const main = root.querySelector("main");
  if (!(main instanceof HTMLElement)) throw new Error("guide host missing");
  expect(main.getBoundingClientRect().height).toBeLessThanOrEqual(1);
}

function scrollToY(top: number) {
  const scrolling = document.scrollingElement ?? document.documentElement;
  scrolling.scrollTop = top;
  window.scrollTo(0, top);
  window.dispatchEvent(new Event("scroll"));
}

function clipInsets(clip: string): number[] {
  const match = /inset\(([^)]+)\)/.exec(clip);
  if (!match?.[1]) return [Number.POSITIVE_INFINITY];
  const body = match[1].replace(/round[\s\S]*$/, "").trim();
  const parts = body.split(/\s+/).map((part) => Number.parseFloat(part));
  if (parts.length === 1 && Number.isFinite(parts[0])) return [parts[0], parts[0], parts[0], parts[0]];
  return parts;
}

export const ExpandFooterHandoff: Story = {
  name: "Handoff — expanded tile meets footer",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
  },
  render: () => <MarketingHeroPage />,
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(gallerySection(canvasElement).getAttribute("data-expand-last")).toBe("true");
    });
    expectGalleryMeetsFooter(canvasElement);

    const section = gallerySection(canvasElement);
    const endOfGrow =
      section.getBoundingClientRect().top + window.scrollY + section.offsetHeight - window.innerHeight;
    const intoFooter = Math.max(0, endOfGrow + Math.round(window.innerHeight * 0.35));
    scrollToY(intoFooter);

    await waitFor(() => {
      const layer = [...section.querySelectorAll<HTMLElement>("[data-scroll-horizontal-expanded]")].find(
        (host) => getComputedStyle(host).position === "absolute",
      );
      expect(layer).toBeTruthy();
      const insets = clipInsets(getComputedStyle(layer as HTMLElement).clipPath);
      expect(insets.length).toBeGreaterThan(0);
      for (const inset of insets) expect(inset).toBeLessThanOrEqual(1);
      expectEdgesMeet(layer!.getBoundingClientRect().bottom, section.getBoundingClientRect().bottom);
    });

    expectGalleryMeetsFooter(canvasElement);
    const sectionBottom = section.getBoundingClientRect().bottom;
    expect(sectionBottom).toBeGreaterThan(24);
    expect(sectionBottom).toBeLessThan(window.innerHeight - 24);
    const scale = canvasElement.querySelector<HTMLElement>("[data-footer-reveal='scale']");
    if (!scale) throw new Error("footer scale layer missing");
    expect(scale.getBoundingClientRect().top).toBeLessThanOrEqual(sectionBottom + 1);
  },
};

export const ExpandFooterHandoffReduced: Story = {
  name: "Handoff — reduced motion tile meets footer",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <MarketingHeroPage />
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    const section = gallerySection(canvasElement);
    await waitFor(() => {
      expect(section.getAttribute("data-reduce")).toBe("true");
    });
    const reduced = [...section.querySelectorAll<HTMLElement>("[data-scroll-horizontal-expanded]")].find(
      (host) => host.className.includes("h-svh"),
    );
    if (!reduced) throw new Error("reduced section missing");
    await waitFor(() => {
      expect(getComputedStyle(reduced).display).toBe("block");
    });
    expectEdgesMeet(documentBottom(reduced), documentBottom(section));
    const footerTop = stickyFooterInFlowTop(footerSticky(canvasElement));
    expect(footerTop).not.toBeNull();
    expectEdgesMeet(footerTop ?? 0, documentBottom(reduced));
    expectGalleryMeetsFooter(canvasElement);
  },
};

const ruledGridFooterCopySource = `
import { FooterReveal, TextLink, footerRevealRuledFieldClasses } from "@whatmatters/wmds";

export function RuledGridFooter() {
  return (
    <div className={footerRevealRuledFieldClasses}>
      <FooterReveal.Ruled />
    </div>
  );
}

export function FooterRevealRuledNav() {
  return (
    <nav aria-label="Footer">
      <ul className="m-0 flex list-none flex-col items-center gap-3 whitespace-nowrap p-0 font-sans text-[length:var(--font-size-4xl)] leading-none sm:text-[4rem]">
        <li>
          <TextLink href="/services" className="!text-brand">Services</TextLink>
        </li>
        <li>
          <TextLink href="/resources" className="!text-brand">Resources</TextLink>
        </li>
        <li>
          <TextLink href="/about" className="!text-brand">About</TextLink>
        </li>
      </ul>
    </nav>
  );
}
`.trim();

function RuledGridFooterSpecimen() {
  return (
    <div className={footerRevealRuledFieldClasses} data-footer-ruled-field="">
      <FooterReveal.Ruled />
    </div>
  );
}

function expectFittedWord(text: HTMLElement | null, frame: HTMLElement | null) {
  if (!text || !frame) throw new Error("fitted word missing");
  expect(footerRevealWordmarkFillsFrame(text, frame)).toBe(true);
}

/**
 * The wordmark fills the footer frame and stays inside the viewport.
 * A cropped word fails this: its ink box would leave the frame or the window.
 */
function expectWordmarkFitsViewport(root: ParentNode) {
  const field = root.querySelector<HTMLElement>("[data-footer-ruled-field]");
  const frame = root.querySelector<HTMLElement>("[data-footer-ruled='wordmark-frame']");
  const text = root.querySelector<HTMLElement>("[data-footer-ruled='wordmark']");
  if (!field || !frame || !text) throw new Error("fitted word missing");
  expectFittedWord(text, frame);

  const fieldBox = field.getBoundingClientRect();
  const frameBox = frame.getBoundingClientRect();
  const textBox = text.getBoundingClientRect();
  expect(fieldBox.width).toBeGreaterThan(0);
  expect(frameBox.width / fieldBox.width).toBeGreaterThanOrEqual(0.98);
  expect(textBox.width / frameBox.width).toBeGreaterThanOrEqual(0.9);
  expect(textBox.left).toBeGreaterThanOrEqual(frameBox.left - 1);
  expect(textBox.right).toBeLessThanOrEqual(frameBox.right + 1);
  expect(textBox.top).toBeGreaterThanOrEqual(frameBox.top - 1);
  expect(textBox.bottom).toBeLessThanOrEqual(frameBox.bottom + 1);
  expect(textBox.left).toBeGreaterThanOrEqual(-1);
  expect(textBox.right).toBeLessThanOrEqual(window.innerWidth + 1);
  expect(textBox.bottom).toBeLessThanOrEqual(window.innerHeight + 1);
  expect(getComputedStyle(frame).overflowX).not.toBe("hidden");
  expect(getComputedStyle(frame).overflowY).not.toBe("hidden");
  expect(getComputedStyle(text).transform === "none" || getComputedStyle(text).transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(
    true,
  );
}

function expectNoCrop(root: ParentNode) {
  expect(root.querySelector("[data-footer-ruled='crop']")).toBeNull();
  expect(root.querySelector("[data-footer-ruled='crop-frame']")).toBeNull();
}

/** Credit stays fully inside the viewport. The string is the whole line, not a clipped tail. */
function expectCreditFits(root: ParentNode) {
  const credit = root.querySelector<HTMLElement>("[data-footer-ruled='credit'] p");
  if (!credit) throw new Error("credit missing");
  expect(credit.textContent).toBe(footerRevealRuledDefaultCopy.credit);
  expect(credit.scrollWidth).toBeLessThanOrEqual(credit.clientWidth + 1);
  const box = credit.getBoundingClientRect();
  expect(box.width).toBeGreaterThan(0);
  expect(box.left).toBeGreaterThanOrEqual(-1);
  expect(box.right).toBeLessThanOrEqual(window.innerWidth + 1);
  expect(box.bottom).toBeLessThanOrEqual(window.innerHeight + 1);
}

/** The ruled field is at least one viewport tall. Taller content may grow it. */
function expectRuledFooterFillsViewport(root: ParentNode) {
  const footer = root.querySelector<HTMLElement>("[data-footer-ruled='root']");
  const field = root.querySelector<HTMLElement>("[data-footer-ruled-field]");
  if (!footer) throw new Error("ruled footer missing");
  const min = window.innerHeight - 1;
  expect(footer.getBoundingClientRect().height).toBeGreaterThanOrEqual(min);
  expect(Number.parseFloat(getComputedStyle(footer).minHeight)).toBeGreaterThanOrEqual(min);
  if (field) {
    expect(field.getBoundingClientRect().height).toBeGreaterThanOrEqual(min);
    expect(Number.parseFloat(getComputedStyle(field).minHeight)).toBeGreaterThanOrEqual(min);
  }
  expect(getComputedStyle(footer).overflowY).not.toBe("hidden");
  expect(getComputedStyle(footer).overflowX).not.toBe("hidden");
  expectNoCrop(root);
  expectCreditFits(root);
}

function footerNavLinks(root: ParentNode): HTMLAnchorElement[] {
  const nav = root.querySelector<HTMLElement>("[data-footer-ruled='links']");
  if (!nav) throw new Error("footer nav missing");
  expect(nav.getAttribute("aria-label")).toBe("Footer");
  return [...nav.querySelectorAll("a")];
}

/** Services, Resources, About — one centered stack. No second column. */
function expectCenteredLinkStack(root: ParentNode) {
  const nav = root.querySelector<HTMLElement>("[data-footer-ruled='links']");
  const footer = root.querySelector<HTMLElement>("[data-footer-ruled='root']");
  if (!nav || !footer) throw new Error("footer nav missing");
  const navLinks = footerNavLinks(root);
  expect(navLinks.map((link) => link.textContent)).toEqual(["Services", "Resources", "About"]);
  expect(navLinks.map((link) => link.getAttribute("href"))).toEqual([
    "/services",
    "/resources",
    "/about",
  ]);
  expect(nav.textContent).not.toContain("Website");
  expect(nav.textContent).not.toContain("Studio");
  const center = footer.getBoundingClientRect().left + footer.getBoundingClientRect().width / 2;
  for (const link of navLinks) {
    const box = link.getBoundingClientRect();
    expect(Math.abs(box.left + box.width / 2 - center)).toBeLessThanOrEqual(2);
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeLessThanOrEqual(window.innerWidth + 1);
    expect(link.className).toContain("decoration-dotted");
    expect(link.className).toContain("font-medium");
    expect(link.className).toContain("focus-visible:ring-focus-ring");
    expect(link.className).not.toContain("uppercase");
    expect(link.className).not.toContain("font-mono");
    expect(getComputedStyle(link).fontSize).toBe(window.innerWidth >= 640 ? "64px" : "35px");
    expect(getComputedStyle(link).fontFamily).toContain("Geist");
    expect(getComputedStyle(link).color.replace(/\s/g, "")).toBe("rgb(1,18,114)");
    expect(getComputedStyle(link).textDecorationLine).toBe("underline");
    expect(getComputedStyle(link).textDecorationStyle).toBe("dotted");
  }
  const rows = navLinks.map((link) => link.parentElement?.getBoundingClientRect());
  if (rows.some((row) => !row)) throw new Error("footer nav row missing");
  expect(rows[0]!.bottom).toBeLessThanOrEqual(rows[1]!.top + 1);
  expect(rows[1]!.bottom).toBeLessThanOrEqual(rows[2]!.top + 1);
}

/** Links, then the wordmark, then the quiet row. The row stacks below `md`. */
function expectFooterStack(root: ParentNode) {
  const links = root.querySelector<HTMLElement>("[data-footer-ruled='links']");
  const wordmark = root.querySelector<HTMLElement>("[data-footer-ruled='wordmark']");
  const meta = root.querySelector<HTMLElement>("[data-footer-ruled='meta']");
  const identity = root.querySelector<HTMLElement>("[data-footer-ruled='identity']");
  const contact = root.querySelector<HTMLElement>("[data-footer-ruled='contact']");
  const credit = root.querySelector<HTMLElement>("[data-footer-ruled='credit']");
  if (!links || !wordmark || !meta || !identity || !contact || !credit) {
    throw new Error("footer stack missing");
  }
  expect(links.getBoundingClientRect().bottom).toBeLessThanOrEqual(wordmark.getBoundingClientRect().top + 1);
  expect(wordmark.getBoundingClientRect().bottom).toBeLessThanOrEqual(meta.getBoundingClientRect().top + 1);
  if (window.innerWidth >= 768) {
    expect(Math.abs(identity.getBoundingClientRect().top - contact.getBoundingClientRect().top)).toBeLessThanOrEqual(2);
    expect(identity.getBoundingClientRect().right).toBeLessThanOrEqual(contact.getBoundingClientRect().left + 1);
    expect(contact.getBoundingClientRect().right).toBeLessThanOrEqual(credit.getBoundingClientRect().left + 1);
  } else {
    expect(identity.getBoundingClientRect().bottom).toBeLessThanOrEqual(contact.getBoundingClientRect().top + 1);
    expect(contact.getBoundingClientRect().bottom).toBeLessThanOrEqual(credit.getBoundingClientRect().top + 1);
  }
}

const ruledReviewViewports = {
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
  review900: {
    name: "Review 900",
    styles: { width: "900px", height: "800px" },
    type: "tablet" as const,
  },
  review1024: {
    name: "Review 1024",
    styles: { width: "1024px", height: "623px" },
    type: "tablet" as const,
  },
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
  review2560: {
    name: "Review 2560",
    styles: { width: "2560px", height: "1440px" },
    type: "desktop" as const,
  },
};

function expectDroppedChrome(root: ParentNode) {
  expect(root.querySelector("[data-footer-ruled='socials']")).toBeNull();
  expect(root.querySelector("[data-footer-ruled='plus']")).toBeNull();
  expect(root.querySelector("[data-footer-ruled='band']")).toBeNull();
  expect(root.querySelector("[data-footer-ruled='grid']")).toBeNull();
  const text = root.textContent ?? "";
  expect(text).not.toContain("Website");
  expect(text).not.toContain("Studio");
  expect(text).not.toContain("Privacy");
  expect(text).not.toContain("Coming soon");
  expect(text).not.toContain("Frequently asked");
}

export const RuledGridFooterPattern: Story = {
  name: "Pattern — ruled grid footer",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Cream marketing footer. Put **footerRevealRuledFieldClasses** (`bg-body` / `text-brand`, at least 100vh) on **FooterReveal.Footer** and render **FooterReveal.Ruled** inside it. The field grows when the content is taller than the viewport. The nav, wordmark, and quiet row are not clipped. The nav is one centered stack of **TextLink**: Services, Resources, About. The list sets Geist sans at `--font-size-4xl` below `sm` and 4rem from `sm`, and the links are `text-brand`. **TextLink** keeps its dotted underline, medium weight, and focus ring. The WhatMatters wordmark is fitted to the footer width and stays fully visible. The quiet row is the WM mark with WhatMatters © 2026, randy@whatmatters.so, and Created by WhatMatters 2024–2026. Below `md` that row stacks. There is no cropped wordmark, no two-column nav, and no social row. Dark theme keeps the field on `--color-on-brand`.",
        },
      },
    },
    ruledGridFooterCopySource,
  ),
  render: () => <RuledGridFooterSpecimen />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='root']");
    const field = canvasElement.querySelector<HTMLElement>("[data-footer-ruled-field]");
    if (!root || !field) throw new Error("ruled footer missing");

    const fieldFill = getComputedStyle(field).backgroundColor.replace(/\s/g, "");
    expect(fieldFill === "rgb(248,248,248)" || fieldFill === "rgb(255,255,255)").toBe(true);
    const ink = getComputedStyle(root).color.replace(/\s/g, "");
    expect(ink).toBe("rgb(1,18,114)");

    const wordmark = canvasElement.querySelector("[data-footer-ruled='wordmark']");
    expect(wordmark?.textContent).toBe("WhatMatters");
    expect(wordmark?.getAttribute("aria-hidden")).toBe("true");
    expectNoCrop(canvasElement);
    expect(canvasElement.textContent).toContain(footerRevealRuledDefaultCopy.copyright);
    expect(canvasElement.textContent).toContain(footerRevealRuledDefaultCopy.credit);
    expect(canvasElement.textContent).not.toContain("What Matters");
    expectDroppedChrome(canvasElement);

    const email = canvasElement.querySelector("a[href='mailto:randy@whatmatters.so']");
    expect(email?.textContent).toBe("randy@whatmatters.so");
    expect(email?.className).toContain("focus-visible:ring-brand");

    expectCenteredLinkStack(canvasElement);
    expectFooterStack(canvasElement);

    await waitFor(() => {
      expectWordmarkFitsViewport(canvasElement);
    });
    expectCreditFits(canvasElement);
    expectRuledFooterFillsViewport(canvasElement);

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );
  },
};

export const RuledGridOverflow390: Story = {
  name: "Ruled grid — 390 overflow",
  tags: ["test", "!dev", "!autodocs"],
  globals: lockedViewportGlobals("mobile"),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: { options: { ...storybookViewports, ...ruledReviewViewports } },
  },
  render: () => <RuledGridFooterSpecimen />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThan(768);
    expect(window.innerWidth).toBeGreaterThanOrEqual(390 - 2);
    expect(window.innerHeight).toBeGreaterThanOrEqual(820);
    expect(window.innerHeight).toBeLessThanOrEqual(860);

    expectCenteredLinkStack(canvasElement);
    expectFooterStack(canvasElement);
    expectDroppedChrome(canvasElement);
    const email = canvasElement.querySelector("a[href='mailto:randy@whatmatters.so']");
    expect(email?.textContent).toBe("randy@whatmatters.so");

    await waitFor(() => {
      expectWordmarkFitsViewport(canvasElement);
    });
    expectRuledFooterFillsViewport(canvasElement);

    const root = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='root']");
    if (!root) throw new Error("ruled footer missing");
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );
  },
};

function ruledFitStory(
  id: "review900" | "review1024" | "review1440" | "review2560",
  minWidth: number,
  maxWidth: number,
  minHeight: number,
  maxHeight: number,
): Story {
  return {
    name: `Ruled grid — fit at ${id.replace("review", "")}`,
    tags: ["test", "!dev", "!autodocs"],
    globals: {
      viewport: { value: id, isRotated: false },
    },
    parameters: {
      wmdsLayout: "fullscreen",
      docs: { disable: true },
      viewport: { options: ruledReviewViewports },
    },
    render: () => <RuledGridFooterSpecimen />,
    play: async ({ canvasElement }) => {
      expect(window.innerWidth).toBeGreaterThanOrEqual(minWidth);
      expect(window.innerWidth).toBeLessThanOrEqual(maxWidth);
      expect(window.innerHeight).toBeGreaterThanOrEqual(minHeight);
      expect(window.innerHeight).toBeLessThanOrEqual(maxHeight);
      expectCenteredLinkStack(canvasElement);
      expectFooterStack(canvasElement);
      expectDroppedChrome(canvasElement);
      await waitFor(() => {
        expectWordmarkFitsViewport(canvasElement);
      });
      expectRuledFooterFillsViewport(canvasElement);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth + 1,
      );
    },
  };
}

export const RuledGridDividers900: Story = ruledFitStory("review900", 900, 910, 780, 820);
export const RuledGridFits1024: Story = ruledFitStory("review1024", 1024, 1040, 600, 640);
export const RuledGridColumns1440: Story = ruledFitStory("review1440", 1440, 1455, 880, 920);
export const RuledGridColumns2560: Story = ruledFitStory("review2560", 2560, 2575, 1400, 1460);
