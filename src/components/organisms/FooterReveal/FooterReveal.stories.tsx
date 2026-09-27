import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { Badge } from "../../atoms/Badge/Badge";
import { GridOverlay } from "../../../lib/GridOverlay";
import { stickyFooterInFlowTop } from "../../../lib/gridOverlayUtils";
import { Button } from "../../atoms/Button/Button";
import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
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
| **FooterReveal.Brand** | Headline, inverse CTA, underlined social row, and a decorative wordmark |
| \`useFooterRevealProgress\` | Reveal progress MotionValue, 0 covered → 1 uncovered (stuck at 1 when reduced motion is on) |

## Anatomy

\`\`\`
FooterReveal — isolation: isolate (overflow visible, so grid guides can leave the page)
├── FooterReveal.Content — relative, z-index 1, min-height 100dvh, bg-body
└── FooterReveal.Footer — sticky, bottom 0, z-index -1
    └── fade (opacity) → scale / blur (origin 50% 100%, blur 12px → 0) → footer contents
        └── FooterReveal.Brand
            ├── headline (type-display-1, centered)
            ├── Button role="inverse" type="button" (onCtaClick)
            ├── social links (underlined, https opens in a new tab)
            └── wordmark (aria-hidden, spans the footer width, cropped at the bottom edge)
\`\`\`

## Best practices

- One **FooterReveal** per page. Put **SiteNav** and the page or marketing hero inside **Content**.
- Field color is **\`footerRevealFieldClasses\`** (\`bg-brand\` / \`text-on-brand\`). \`--color-brand\` is \`#011272\` in both themes. White on that navy reports **15.8:1**. The wordmark uses \`--color-brand-soft\` (40% white on the navy) so it stays visible.
- The CTA is a **Button** \`role="inverse"\` \`type="button"\` (\`onCtaClick\`). It opens a modal; there is no default route. Pass \`ctaHref\` only when the control should be a link. Do not recolor it with \`className\`.
- Social links use **\`footerRevealFieldLinkClasses\`** at heading-1 size. \`https\` hrefs set \`target="_blank"\` and \`rel="noopener"\`. Placeholder hashes stay on the same page.
- The wordmark is decorative (\`aria-hidden\`). It spans the footer width: font-size is \`100cqi\` divided by the measured advance width of the word, with no breakpoint cap. The brand panel crops it at the bottom edge, so it does not widen the page.
- Do not hide the scrollbar. The page grid already reserves a stable gutter. The root does not clip — that would trap **GridOverlay** guides inside \`main\`. The brand panel and the footer field clip the wordmark.
- Do not put \`overflow-hidden\` on **FooterReveal** — it breaks \`position: sticky\`. The brand panel clips its own wordmark.
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

// npm install @rive-app/react-canvas
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge, Button, FooterReveal, GridOverlay, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav, footerRevealFieldClasses } from "@whatmatters/wmds";

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
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
          expandLast
        />
        <main className="grid-page bg-body">
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
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
          expandLast
        />
        <main className="grid-page bg-body">
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
            "The marketing hero (SiteNav, headline, intro, tile fan) fills **FooterReveal.Content**, then **ScrollHorizontal** with expandLast (Selected work is the accessible name, sr-only while the window is pinned — solid token-color placeholders), then the page grid. **FooterReveal.Brand** is the sticky footer underneath. Scroll past the hero — the gallery translates from the first card centered to the last, then the last tile grows to fill the viewport and scrolls away. The brand field fades in from about 12px of blur after that cover. Reduced motion keeps the gallery as a native horizontal scroller with the heading visible above it, follows it with the last tile as a full-viewport section, and shows the footer sharp.",
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
