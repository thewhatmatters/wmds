import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { MotionConfig } from "motion/react";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { Badge } from "../../atoms/Badge/Badge";
import { GridOverlay } from "../../../lib/GridOverlay";
import { stickyFooterInFlowTop } from "../../../lib/gridOverlayUtils";
import { lockedViewportGlobals, storybookViewports } from "../../../lib/viewports";
import { Button } from "../../atoms/Button/Button";
import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
import { HeroTileStack } from "../HeroTileStack/HeroTileStack";
import { ScrollHorizontal } from "../ScrollHorizontal/ScrollHorizontal";
import { scrollHorizontalMarketingItems } from "../ScrollHorizontal/scrollHorizontalExamples";
import { SiteNav } from "../SiteNav/SiteNav";
import { FooterReveal } from "./FooterReveal";
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
| **FooterReveal.Ruled** | Ruled grid on the page background: identity, link columns, contact, social cells, fitted wordmark, cropped mark, credit |
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
        └── FooterReveal.Ruled
            ├── identity (copyright, mono blurb, typographic mark, decorative plus)
            ├── two link columns (dotted rules, ArrowUpRight)
            ├── contact (email anchor, services line)
            ├── social cells (icon-only anchors, ButtonIcon)
            ├── wordmark (aria-hidden, fills the frame)
            ├── crop (aria-hidden WM letterforms, cut by the bottom rule)
            └── credit bar
\`\`\`

## Best practices

- One **FooterReveal** per page. Put **SiteNav** and the page or marketing hero inside **Content**.
- Field color is **\`footerRevealFieldClasses\`** (\`bg-brand\` / \`text-on-brand\`). \`--color-brand\` is \`#011272\` in both themes. White on that navy reports **15.8:1**. The wordmark uses \`--color-brand-soft\` (40% white on the navy) so it stays visible.
- The CTA is a **Button** \`role="inverse"\` \`type="button"\` (\`onCtaClick\`). It opens a modal; there is no default route. Pass \`ctaHref\` only when the control should be a link. Do not recolor it with \`className\`.
- Social links use **\`footerRevealFieldLinkClasses\`** at heading-1 size. \`https\` hrefs set \`target="_blank"\` and \`rel="noopener"\`. Placeholder hashes stay on the same page.
- The wordmark is decorative (\`aria-hidden\`). It spans the footer width: font-size is \`100cqi\` divided by the measured advance width of the word, with no breakpoint cap. The brand panel crops it at the bottom edge, so it does not widen the page.
- Do not hide the scrollbar. The page grid already reserves a stable gutter. The root does not clip — that would trap **GridOverlay** guides inside \`main\`. The brand panel and the footer field clip the wordmark.
- Do not put \`overflow-hidden\` on **FooterReveal** — it breaks \`position: sticky\`. The brand panel clips its own wordmark.
- When **ScrollHorizontal** \`expandLast\` is the last section in the cover, the guide \`grid-page\` after it uses \`!py-0\`. Default \`grid-page\` block padding is \`--grid-pad\` (24px top and bottom). On a guide-only host that padding is a page-background strip between the full-bleed tile and the footer. The reduced-motion \`h-svh\` section meets the footer the same way.
- **FooterReveal.Ruled** is the ruled-grid footer. Pass **\`footerRevealRuledFieldClasses\`** (\`bg-body\` / \`text-brand\`) on **Footer**. Rules are 1px \`border-brand\`. Horizontal rules span the footer field. Content, internal dividers, and the grid's vertical edges stay in the page grid box (\`max-w-[var(--grid-max)]\`). Below \`md\` the bands stack; the two link columns stay side by side; social cells stay one row. The wordmark fills the grid box. The crop row is oversized \`WM\` letterforms cut by the bottom rule. Plus glyphs are decorative (\`aria-hidden\`) and show from \`md\`. Social cells are icon-only anchors with accessible names and a brand focus ring. Lucide has no brand marks for X, Dribbble, Instagram, or LinkedIn — the defaults use X, CircleDot, Camera, and Briefcase. Sparkle is Lucide's sparkle. Dark theme keeps the field on \`--color-on-brand\` so the navy rules stay readable. **FooterReveal.Brand** stays the navy field.
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
import { FooterReveal, footerRevealRuledFieldClasses } from "@whatmatters/wmds";

export function RuledGridFooter() {
  return (
    <div className={footerRevealRuledFieldClasses}>
      <FooterReveal.Ruled />
    </div>
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

export const RuledGridFooterPattern: Story = {
  name: "Pattern — ruled grid footer",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Ruled grid on the page background. Put **footerRevealRuledFieldClasses** (`bg-body` / `text-brand`) on **FooterReveal.Footer** and render **FooterReveal.Ruled** inside it. Horizontal rules are 1px `border-brand` and span the footer field. Content, internal dividers, and the grid's vertical edges stay in the page grid box (`max-w-[var(--grid-max)]`). Default copy is WhatMatters © 2026, a mono blurb, Website and Studio link columns, randy@whatmatters.so, Brand / Product / Web, five social cells, the WhatMatters wordmark, cropped WM letterforms, and Created by WhatMatters 2024—26. Below `md` the bands stack; the link columns stay side by side; the social cells stay one row. Plus glyphs are decorative and show from `md`. Social cells are icon-only anchors. Lucide has no brand marks for X, Dribbble, Instagram, or LinkedIn — defaults use X, CircleDot, Camera, and Briefcase. Sparkle is Lucide's sparkle. `https` links open in a new tab.",
        },
      },
    },
    ruledGridFooterCopySource,
  ),
  render: () => <RuledGridFooterSpecimen />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='root']");
    const field = canvasElement.querySelector<HTMLElement>("[data-footer-ruled-field]");
    const band = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='band']");
    const grid = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='grid']");
    const identity = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='identity']");
    const links = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='links']");
    if (!root || !field || !band || !grid || !identity || !links) throw new Error("ruled footer missing");

    const fieldBox = field.getBoundingClientRect();
    const bandBox = band.getBoundingClientRect();
    const gridBox = grid.getBoundingClientRect();
    expect(Math.abs(band.offsetWidth - field.offsetWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(bandBox.left - fieldBox.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(gridBox.left - bandBox.left - (bandBox.right - gridBox.right))).toBeLessThanOrEqual(1);
    expect(identity.getBoundingClientRect().left).toBeGreaterThanOrEqual(gridBox.left - 1);
    expect(identity.getBoundingClientRect().right).toBeLessThanOrEqual(gridBox.right + 1);

    const border = getComputedStyle(band).borderTopColor.replace(/\s/g, "");
    expect(border).toBe("rgb(1,18,114)");
    expect(getComputedStyle(band).borderBottomWidth).toBe("1px");
    expect(getComputedStyle(grid).borderLeftWidth).toBe("1px");
    expect(getComputedStyle(grid).borderRightWidth).toBe("1px");
    const fieldFill = getComputedStyle(field).backgroundColor.replace(/\s/g, "");
    expect(fieldFill === "rgb(248,248,248)" || fieldFill === "rgb(255,255,255)").toBe(true);

    const wordmark = canvasElement.querySelector("[data-footer-ruled='wordmark']");
    const crop = canvasElement.querySelector("[data-footer-ruled='crop']");
    expect(wordmark?.textContent).toBe("WhatMatters");
    expect(wordmark?.getAttribute("aria-hidden")).toBe("true");
    expect(crop?.textContent).toBe("WM");
    expect(crop?.getAttribute("aria-hidden")).toBe("true");
    expect(canvasElement.textContent).not.toContain("What Matters");

    const socials = canvasElement.querySelectorAll<HTMLAnchorElement>("[data-footer-ruled='socials'] a");
    expect(socials).toHaveLength(5);
    for (const link of socials) {
      expect(link.getAttribute("aria-label")?.length ?? 0).toBeGreaterThan(0);
      expect(link.className).toContain("focus-visible:ring-brand");
    }
    const instagram = canvasElement.querySelector("a[href='https://www.instagram.com/thewhatmatters']");
    expect(instagram?.getAttribute("target")).toBe("_blank");
    expect(instagram?.getAttribute("rel")).toBe("noopener");
    expect(instagram?.getAttribute("aria-label")).toBe("WhatMatters on Instagram");

    const email = canvasElement.querySelector("a[href='mailto:randy@whatmatters.so']");
    expect(email?.textContent).toBe("randy@whatmatters.so");

    for (const plus of canvasElement.querySelectorAll<HTMLElement>("[data-footer-ruled='plus']")) {
      expect(plus.getAttribute("aria-hidden")).toBe("true");
      expect(getComputedStyle(plus).display).toBe(window.innerWidth >= 768 ? "inline-flex" : "none");
    }

    const navs = links.querySelectorAll("nav");
    expect(navs).toHaveLength(2);
    expect(Math.abs(navs[0]!.getBoundingClientRect().top - navs[1]!.getBoundingClientRect().top)).toBeLessThanOrEqual(1);

    if (window.innerWidth >= 768) {
      expect(Math.abs(identity.getBoundingClientRect().top - links.getBoundingClientRect().top)).toBeLessThanOrEqual(1);
    }

    await waitFor(() => {
      const frame = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='wordmark-frame']");
      const text = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='wordmark']");
      expect(frame?.clientWidth ?? 0).toBeGreaterThan(0);
      expect(text?.scrollWidth ?? 0).toBeLessThanOrEqual((frame?.clientWidth ?? 0) + 1);
    });

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
    viewport: { options: storybookViewports },
  },
  render: () => <RuledGridFooterSpecimen />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThan(768);
    expect(window.innerWidth).toBeGreaterThanOrEqual(390 - 2);

    const identity = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='identity']");
    const links = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='links']");
    const contact = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='contact']");
    const socials = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='socials']");
    const wordmark = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='wordmark']");
    const crop = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='crop']");
    if (!identity || !links || !contact || !socials || !wordmark || !crop) {
      throw new Error("ruled footer bands missing");
    }

    expect(identity.getBoundingClientRect().bottom).toBeLessThanOrEqual(links.getBoundingClientRect().top + 1);
    expect(links.getBoundingClientRect().bottom).toBeLessThanOrEqual(contact.getBoundingClientRect().top + 1);
    expect(contact.getBoundingClientRect().bottom).toBeLessThanOrEqual(socials.getBoundingClientRect().top + 1);
    expect(wordmark.getBoundingClientRect().bottom).toBeLessThanOrEqual(crop.getBoundingClientRect().top + 1);

    const navs = links.querySelectorAll("nav");
    expect(navs).toHaveLength(2);
    expect(Math.abs(navs[0]!.getBoundingClientRect().top - navs[1]!.getBoundingClientRect().top)).toBeLessThanOrEqual(1);
    expect(socials.querySelectorAll("a")).toHaveLength(5);

    await waitFor(() => {
      const frame = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='wordmark-frame']");
      expect(wordmark.scrollWidth).toBeLessThanOrEqual((frame?.clientWidth ?? 0) + 1);
    });

    const root = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='root']");
    const field = canvasElement.querySelector<HTMLElement>("[data-footer-ruled-field]");
    const band = canvasElement.querySelector<HTMLElement>("[data-footer-ruled='band']");
    if (!root || !field || !band) throw new Error("ruled footer missing");
    expect(Math.abs(band.offsetWidth - field.offsetWidth)).toBeLessThanOrEqual(1);
    for (const plus of canvasElement.querySelectorAll<HTMLElement>("[data-footer-ruled='plus']")) {
      expect(getComputedStyle(plus).display).toBe("none");
    }
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );
  },
};
