import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { Badge } from "../../atoms/Badge/Badge";
import { HeroIntro } from "../../molecules/HeroIntro/HeroIntro";
import { TextSequence } from "../../molecules/TextSequence/TextSequence";
import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { Button } from "../../atoms/Button/Button";
import { SiteNav } from "../SiteNav/SiteNav";
import { GridOverlay } from "../../../lib/GridOverlay";
import { readGridColumnCount } from "../../../lib/gridOverlayUtils";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import {
  HeroTileStack,
  heroTileStackDefaultMaxVertical,
  heroTileStackDefaultStrength,
  heroTileStackDefaultTileSize,
  heroTileStackDefaultVelocityFactor,
  type HeroTileStackTile,
} from "./HeroTileStack";
import { ScrollHorizontal } from "../ScrollHorizontal/ScrollHorizontal";
import { scrollHorizontalMarketingItems } from "../ScrollHorizontal/scrollHorizontalExamples";

const heroTiles: HeroTileStackTile[] = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
];

const projects = scrollHorizontalMarketingItems;

const meta = {
  title: "Components/Layout/HeroTileStack",
  component: HeroTileStack,
  tags: ["autodocs"],
  args: {
    tiles: heroTiles,
    strength: heroTileStackDefaultStrength,
    velocityFactor: heroTileStackDefaultVelocityFactor,
    maxVertical: heroTileStackDefaultMaxVertical,
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Marketing hero fan. Pass \`tiles\` (\`src\` and \`alt\`, plus optional resting \`offsetX\`, \`offsetY\`, \`rotate\`, and \`zIndex\`). While a fine pointer is over the stack, every card springs left or right away from the pointer. Closer cards travel farther, and the push adds a little tilt. A still pointer does not move the cards vertically. A quick pointer move — most of all a vertical one — adds a small springy vertical nudge that returns to 0 when the pointer slows. Leaving the stack springs the cards back to the resting fan. There is no scale change, dimming, reorder, click action, or idle motion.

Tiles are square. \`--hero-tile-size\` is \`min(tileSize, a fraction of the stack width)\`, capped at **400px** (\`tileSize\`, also \`--hero-tile-max\`). Resting overlap and the scatter distances scale with that painted size, so the fan keeps its proportions. Below \`md\` the overlap tightens into a pile that fits the viewport. The root still clips the inline axis.

\`strength\` multiplies the horizontal push, then scales with the tile. The default keeps tiles near the stack. Raise it for a wider scatter. \`0\` holds the resting stack. \`velocityFactor\` is px of vertical nudge per px/s of vertical pointer velocity. \`maxVertical\` clamps that nudge. Both scale with the tile. \`spring\` overrides stiffness, damping, and mass.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, render the resting fan and ignore the pointer.

A coarse pointer or a touch tap scatters once from the tap point, holds briefly, then springs back. That tap uses the same gentle horizontal push and does not add a velocity nudge.

The root clips the inline axis (\`overflow-x: clip\`) so a wide scatter cannot open a horizontal scrollbar. The row does not clip, and the block axis stays visible so cards can leave the stack vertically.

## Anatomy

\`\`\`
HeroTileStack — full width, overflow-x clip, overflow-y visible
└── row — resting hit area, overflow visible
    └── slot — resting offset, z-index (stays put)
        └── surface — --radius-card-shell, shadow-soft-card
            └── img (alt)
            x / y / rotate springs — scatter only
\`\`\`

## Best practices

- Give every image an \`alt\`. The scatter is decorative: it does not trap focus and it does not hide the images.
- Place **HeroTileStack** in a full-width hero. The component clips inline overflow. Do not add \`overflow-hidden\` on the stack — that clips the scatter and can turn the block axis into a scroll container.
- The first four tiles use the default fan (alternating tilt, a small vertical nudge, later tiles in front). Override \`rotate\`, \`offsetX\`, \`offsetY\`, or \`zIndex\` per tile when the fan should differ. Below \`md\` the same tilts sit in a tighter pile.
- Default \`strength\` is a gentle horizontal shift, scaled to the painted tile. Use the **Strength** story to raise it when cards should travel farther. \`tileSize\` caps the square (default 400).
- Shadows travel with the cards. The surface uses \`shadow-soft-card\` and \`--radius-card-shell\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof HeroTileStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const marketingHeroCopySource = `
"use client";

// npm install @rive-app/react-canvas
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge, Button, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav } from "@whatmatters/wmds";

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

export function MarketingHero() {
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
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        expandLast
      />
    </>
  );
}
`.trim();

function MarketingHero() {
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
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        expandLast
      />
    </>
  );
}

const heroIntroLeadCopy = "We're a design and product studio based in Austin, Texas.";

function expectHeroIntroLines(root: ParentNode, nowrap: boolean) {
  const intro = root.querySelector("section p");
  if (!(intro instanceof HTMLElement)) throw new Error("intro paragraph missing");
  const spans = [...intro.querySelectorAll(":scope > span")];
  expect(spans).toHaveLength(2);
  const lead = spans[0];
  const rest = spans[1];
  if (!(lead instanceof HTMLElement) || !(rest instanceof HTMLElement)) {
    throw new Error("intro lines missing");
  }
  expect(lead.textContent).toBe(heroIntroLeadCopy);
  expect(rest.textContent?.trim().startsWith("We help brands stand out")).toBe(true);
  expect(getComputedStyle(lead).whiteSpace).toBe(nowrap ? "nowrap" : "normal");
  const leadBox = lead.getBoundingClientRect();
  const restBox = rest.getBoundingClientRect();
  expect(restBox.top).toBeGreaterThanOrEqual(leadBox.bottom - 1);
  if (nowrap) {
    const lineHeight = Number.parseFloat(getComputedStyle(lead).lineHeight);
    expect(lineHeight).toBeGreaterThan(0);
    expect(leadBox.height).toBeLessThan(lineHeight * 1.75);
  }
  return intro;
}

export const MarketingHeroPattern: Story = {
  name: "Pattern — marketing hero",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "SiteNav sits above the hero in normal flow. The hero section is min-h-[calc(100svh-var(--site-nav-height))] and centers its content, so the nav plus the hero fill the viewport. The headline is a plain h1 (We Are WhatMatters) on type-display-1, the largest display token. We Are and WhatMatters are each an inline-block with whitespace-nowrap, so a narrow line breaks as We Are / WhatMatters. The rock hand sits in a zero-width span pinned to the end of We Are, between the e and the W, with em offsets. That span is the first node in We Are so it does not split the words. The e is an inline relative z-20 span, the W is an inline relative z-0 span, the h1 is isolate, and the rock hand is z-10, so the e paints on top of the hand and the hand paints on top of the left edge of the W. The bottom of the rock hand's drawn pixels sits on the text baseline. On a wrap the rock stays behind the e at the end of line 1, on that line's baseline, clear of line 2. The point hand stays on the final s. The accessible name stays We Are WhatMatters. Below md the box is 1.7em, and the point hand stays inside a 320px viewport while still gripping the s. From md the box is 2.2em. Hover or focus on the headline sets Boolean 1. On first view the rock hand slides up from below the baseline inside an overflow-clip wrapper (e at z-20, hand at z-10, W at z-0). The point hand then grows in from its grip with a spring, about 200ms later. Each hand also sets Boolean 1 on its own 4–9s timer while the tab is visible and the hand is in view. idle defaults on. prefers-reduced-motion skips the entrance and the idle timers and keeps the still frame. The hands are aria-hidden. The headline text stays selectable. handFill uses --color-surface (fallback --color-background-surface), white in light mode. outline uses --color-brand (#011272 in both themes), with the same navy as a hardcoded fallback when the token is missing. Art is a CC BY 4.0 remix of the Rive Interactive Icon Set by Silvia Sguotti and Gabriele Montinaro. The point hand is artboard 31_Cigarette with the cigarette removed. Show code starts with use client. Install @rive-app/react-canvas and serve public/rive/interactive-icon-set.riv at /rive/interactive-icon-set.riv. The intro is HeroIntro. Pass the first sentence as lead (We're a design and product studio based in Austin, Texas.). From md that lead stays on one line. Below md it may wrap. children is the rest of the copy and always starts on the next line. Both lines stay on type-large at font-normal, centered, on the type-large leading. Do not insert a br in the copy. HeroIntro sits on grid-page (max-width --grid-max, the same margin, column gap, and column count as the guides) with py-0 so the page block pad does not stack on the hero gap. From lg, where the grid is 12 columns, it occupies columns 4–9 (lg:col-start-4 lg:col-end-10), 6 of 12 columns, centered, and those edges line up with guide columns 4 and 9. md is 8 columns, so that span does not start at md. Below lg the paragraph is full width of that page grid, inside --grid-margin. The copy is: We're a design and product studio based in Austin, Texas. We help brands stand out online with bold ideas, fresh approaches, and products people actually love to use. online is one inline md Badge with a round Avatar — the one sanctioned decorative use. The globe file in public/hero-badges/ is a playful placeholder. The badge is not clickable, alt is empty so the sentence still reads in order, and the image is not announced. The tile fan is the last element in the hero. ScrollHorizontal follows that section with expandLast. Each card is a solid token-color placeholder and the label is the accessible name only. The heading is sr-only while that window is pinned, and visible above the row when motion is reduced. A 400svh track translates the project row from the first card centered to the last on the same scroll distance as a 300svh gallery, then the last tile grows until it fills the viewport and the radius reaches 0. That full-bleed tile scrolls away on its own. The gallery section ends on that tile, so the next block meets its bottom edge. prefers-reduced-motion keeps a native horizontal scroller, then the last tile as a static full-viewport section. The section's py-16 is the space under the tiles. Move a fine pointer over the tiles — cards shift left and right away from it and tilt slightly. A quick vertical move adds a small springy lift that settles when the pointer slows. They spring back when the pointer leaves. A coarse pointer tap scatters once from that point, then returns. Reduced motion keeps the resting fan.",
        },
      },
    },
    marketingHeroCopySource,
  ),
  render: () => <MarketingHero />,
};

export const Strength: Story = {
  name: "Strength",
  args: {
    strength: heroTileStackDefaultStrength,
    velocityFactor: heroTileStackDefaultVelocityFactor,
    maxVertical: heroTileStackDefaultMaxVertical,
    tileSize: heroTileStackDefaultTileSize,
  },
  argTypes: {
    tileSize: {
      control: { type: "range", min: 160, max: 400, step: 8 },
    },
    strength: {
      control: { type: "range", min: 0, max: 1400, step: 10 },
    },
    velocityFactor: {
      control: { type: "range", min: 0, max: 0.08, step: 0.002 },
    },
    maxVertical: {
      control: { type: "range", min: 0, max: 80, step: 2 },
    },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Drag **strength** for the horizontal push. It scales with the painted tile, so a 400px tile travels farther in px than a smaller one and the fan keeps its proportions. The default shifts tiles sideways and keeps them near the stack. Higher values travel farther, until cards can leave the viewport. `0` does not move. **tileSize** caps the square (default 400). Below md the stack is a tighter pile. **velocityFactor** and **maxVertical** tune the springy vertical nudge from pointer velocity, and they scale with the tile too.",
      },
    },
  },
  render: (args) => (
    <div className="flex min-h-[28rem] w-full items-center justify-center overflow-x-clip overflow-y-visible">
      <HeroTileStack
        tiles={heroTiles}
        strength={args.strength}
        velocityFactor={args.velocityFactor}
        maxVertical={args.maxVertical}
        tileSize={args.tileSize}
      />
    </div>
  ),
};

function HeroThenPage() {
  const [on, setOn] = useState(true);

  return (
    <>
      <MarketingHero />
      <main className="grid-page min-h-[40vh] bg-body" data-testid="page">
        <GridOverlay visible={on} onVisibleChange={setOn} keyboardShortcut={false} />
        <div className="band">
          <div
            data-testid="lower"
            className="col-span-full flex h-40 items-end bg-surface px-4 py-4 shadow-raised"
          >
            <Button role="secondary" size="sm" onClick={() => setOn((current) => !current)}>
              Toggle grid
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

export const GuidesCoverPrecedingHero: Story = {
  name: "Guides cover the preceding hero",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: {
      options: {
        review1440: {
          name: "Review 1440",
          styles: { width: "1440px", height: "900px" },
          type: "desktop" as const,
        },
      },
    },
  },
  render: () => <HeroThenPage />,
  play: async ({ canvas, canvasElement }) => {
    const hero = canvasElement.querySelector("section");
    const page = canvasElement.querySelector("main");
    if (!hero || !page) throw new Error("hero and page must both be mounted");

    await waitFor(() => {
      expect(canvasElement.querySelectorAll(".grid-guides-col").length).toBeGreaterThan(0);
    });

    const guides = canvasElement.querySelector(".grid-guides");
    if (!guides) throw new Error("grid guides missing");
    const guideStyle = getComputedStyle(guides);
    expect(guideStyle.visibility).toBe("visible");
    expect(guideStyle.pointerEvents).toBe("none");
    expect(document.documentElement.classList.contains("grid-on")).toBe(true);
    expect(window.innerWidth).toBeGreaterThanOrEqual(1440);

    const columns = [...canvasElement.querySelectorAll(".grid-guides-col")];
    expect(columns).toHaveLength(12);
    expect(columns).toHaveLength(readGridColumnCount(page));

    const intro = expectHeroIntroLines(canvasElement, true);
    const introBox = intro.getBoundingClientRect();
    const columnFour = columns[3]!.getBoundingClientRect();
    const columnNine = columns[8]!.getBoundingClientRect();
    expect(Math.abs(introBox.left - columnFour.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(introBox.right - columnNine.right)).toBeLessThanOrEqual(1);
    expect(getComputedStyle(intro).gridColumn).toBe("4 / 10");

    const heroRect = hero.getBoundingClientRect();
    const columnRect = columns[0]!.getBoundingClientRect();
    expect(columnRect.top).toBeLessThan(heroRect.top);
    expect(columnRect.bottom).toBeGreaterThan(heroRect.bottom);
    expect(columnRect.left).toBeLessThan(heroRect.right);
    expect(columnRect.right).toBeGreaterThan(heroRect.left);

    const lower = canvas.getByTestId("lower").getBoundingClientRect();
    const first = columns[0]!.getBoundingClientRect();
    const last = columns[columns.length - 1]!.getBoundingClientRect();
    expect(first.left).toBeCloseTo(lower.left, 0);
    expect(last.right).toBeCloseTo(lower.right, 0);

    const pageBottom = page.getBoundingClientRect().bottom + window.scrollY;
    expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(Math.ceil(pageBottom) + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );

    const heroDocTop = hero.getBoundingClientRect().top + window.scrollY;
    const pageDocTop = page.getBoundingClientRect().top + window.scrollY;
    await userEvent.click(canvas.getByRole("button", { name: "Toggle grid" }));
    await waitFor(() => {
      expect(getComputedStyle(guides).visibility).toBe("hidden");
    });
    expect(Number.parseFloat(getComputedStyle(guides).opacity)).toBe(0);
    expect(document.documentElement.classList.contains("grid-on")).toBe(false);
    expect(hero.getBoundingClientRect().top + window.scrollY).toBeCloseTo(heroDocTop, 0);
    expect(page.getBoundingClientRect().top + window.scrollY).toBeCloseTo(pageDocTop, 0);
  },
};

function HeroThenEmptyPage() {
  const [on, setOn] = useState(true);

  return (
    <>
      <MarketingHero />
      <main className="grid-page bg-body" data-testid="page">
        <GridOverlay visible={on} onVisibleChange={setOn} keyboardShortcut={false} />
      </main>
      <Button
        role="secondary"
        size="sm"
        className="fixed end-4 bottom-4 z-50"
        onClick={() => setOn((current) => !current)}
      >
        Toggle grid
      </Button>
    </>
  );
}

export const GuidesCoverEmptyPage: Story = {
  name: "Guides cover the hero when the page is empty",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: {
      options: {
        review1440: {
          name: "Review 1440",
          styles: { width: "1440px", height: "900px" },
          type: "desktop" as const,
        },
      },
    },
  },
  render: () => <HeroThenEmptyPage />,
  play: async ({ canvas, canvasElement }) => {
    const hero = canvasElement.querySelector("section");
    const page = canvasElement.querySelector("main");
    if (!hero || !page) throw new Error("hero and empty page must both be mounted");

    await waitFor(() => {
      expect(canvasElement.querySelectorAll(".grid-guides-col").length).toBeGreaterThan(0);
    });

    const guides = canvasElement.querySelector(".grid-guides");
    if (!guides) throw new Error("grid guides missing");
    expect(getComputedStyle(guides).visibility).toBe("visible");
    expect(getComputedStyle(guides).pointerEvents).toBe("none");
    expect(window.innerWidth).toBeGreaterThanOrEqual(1440);

    const heroRect = hero.getBoundingClientRect();
    const pageRect = page.getBoundingClientRect();
    const gallery = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(gallery instanceof HTMLElement)) throw new Error("gallery missing");
    const galleryRect = gallery.getBoundingClientRect();
    expect(pageRect.height).toBeLessThan(160);
    expect(pageRect.height).toBeLessThan(heroRect.height);
    expect(galleryRect.top).toBeGreaterThanOrEqual(heroRect.bottom - 1);
    expect(pageRect.top).toBeGreaterThanOrEqual(galleryRect.bottom - 1);

    const columns = [...canvasElement.querySelectorAll(".grid-guides-col")];
    expect(columns).toHaveLength(12);
    expect(columns).toHaveLength(readGridColumnCount(page));

    const intro = expectHeroIntroLines(canvasElement, true);
    const introBox = intro.getBoundingClientRect();
    const columnFour = columns[3]!.getBoundingClientRect();
    const columnNine = columns[8]!.getBoundingClientRect();
    expect(Math.abs(introBox.left - columnFour.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(introBox.right - columnNine.right)).toBeLessThanOrEqual(1);
    expect(getComputedStyle(intro).gridColumn).toBe("4 / 10");

    const columnRect = columns[0]!.getBoundingClientRect();
    expect(columnRect.top).toBeLessThanOrEqual(heroRect.top);
    expect(columnRect.bottom).toBeGreaterThanOrEqual(heroRect.bottom - 1);
    expect(columnRect.left).toBeLessThan(heroRect.right);
    expect(columnRect.right).toBeGreaterThan(heroRect.left);

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );

    const heroDocTop = hero.getBoundingClientRect().top + window.scrollY;
    const pageDocTop = page.getBoundingClientRect().top + window.scrollY;
    await userEvent.click(canvas.getByRole("button", { name: "Toggle grid" }));
    await waitFor(() => {
      expect(getComputedStyle(guides).visibility).toBe("hidden");
    });
    expect(hero.getBoundingClientRect().top + window.scrollY).toBeCloseTo(heroDocTop, 0);
    expect(page.getBoundingClientRect().top + window.scrollY).toBeCloseTo(pageDocTop, 0);
    expect(page.getBoundingClientRect().height).toBeCloseTo(pageRect.height, 0);
  },
};

export const IntroLeadBelowMd: Story = {
  name: "Intro lead may wrap below md",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: {
      options: {
        review390: {
          name: "Review 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile" as const,
        },
      },
    },
  },
  render: () => <MarketingHero />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThan(768);
    expectHeroIntroLines(canvasElement, false);
  },
};

const marketingHeroTextSequenceCopySource = `
"use client";

// npm install @rive-app/react-canvas gsap @gsap/react
// Copy public/rive/interactive-icon-set.riv so the app serves /rive/interactive-icon-set.riv.
// Hand art: CC BY 4.0, Silvia Sguotti and Gabriele Montinaro.

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button, HeroIntro, HeroTileStack, RiveHand, ScrollHorizontal, SiteNav, TextSequence } from "@whatmatters/wmds";

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

function MarketingHeroSequenceHeadline() {
  const [handsActive, setHandsActive] = useState(false);
  return (
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
  );
}

export function MarketingHeroTextSequence() {
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
      <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body py-12 text-center">
        <div className="flex w-full flex-col items-center gap-6">
          <MarketingHeroSequenceHeadline />
          <HeroIntro
            step="display"
            lead={
              <TextSequence idle emphasis="none" stagger={0.07}>
                Your brand <TextSequence.Shape variant="asterisk" /> is already <TextSequence.Shape variant="circle" tone="accent" /> online
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
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        expandLast
      />
    </>
  );
}
`.trim();

function MarketingHeroSequenceHeadline() {
  const [handsActive, setHandsActive] = useState(false);
  return (
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
  );
}

function MarketingHeroTextSequenceView() {
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
      <section className="flex min-h-[calc(100svh-var(--site-nav-height))] w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body py-12 text-center">
        <div className="flex w-full flex-col items-center gap-6">
          <MarketingHeroSequenceHeadline />
          <HeroIntro
            step="display"
            lead={
              <TextSequence idle emphasis="none" stagger={0.07}>
                Your brand <TextSequence.Shape variant="asterisk" /> is already <TextSequence.Shape variant="circle" tone="accent" /> online
              </TextSequence>
            }
          >
            <TextSequence idle emphasis="none" delay={0.35} stagger={0.07}>
              Make it <TextSequence.Shape variant="pill" tone="brand-soft" /> impossible to ignore
            </TextSequence>
          </HeroIntro>
          <div className="w-full px-[var(--grid-margin)]">
            <HeroTileStack tiles={heroTiles} />
          </div>
        </div>
      </section>
      <ScrollHorizontal
        items={projects}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        expandLast
      />
    </>
  );
}

function expectSequenceInsideViewport(root: ParentNode) {
  const nodes = root.querySelectorAll("[data-text-sequence-word], [data-text-sequence-shape]");
  expect(nodes.length).toBeGreaterThan(0);
  for (const node of nodes) {
    const box = node.getBoundingClientRect();
    if (box.width < 1 && box.height < 1) continue;
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeLessThanOrEqual(window.innerWidth + 1);
  }
}

export const MarketingHeroTextSequence: Story = {
  name: "Pattern — marketing hero text sequence",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Same marketing hero as Pattern — marketing hero, with the intro sequenced. The h1 stays We Are WhatMatters on type-display-1, title case, with the rock and point hands on the e, the W, and the final s. TextSequence does not run on that h1: SplitText would rewrite those letter spans and the hands would lose their anchors. HeroIntro step display sets the subtext to type-display-2 at normal weight, the same size as the gallery statement, full width of the page grid. The two lines are Your brand is already online and Make it impossible to ignore, with no periods. A few TextSequence.Shape marks sit inline between words (asterisk, circle, ribbed pill) at about 1.15em, in place of the Badge and Avatar on the default pattern. emphasis is none, so every word stays regular. Shapes are aria-hidden. idle spins the asterisk and stretches the pill. Headline hover state lives on the headline so the sequence does not re-render. prefers-reduced-motion leaves the intro at rest. The tile fan and ScrollHorizontal are unchanged.",
        },
      },
    },
    marketingHeroTextSequenceCopySource,
  ),
  render: () => <MarketingHeroTextSequenceView />,
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector("h1");
    expect(heading?.textContent?.replace(/\s+/g, " ").trim()).toBe("We Are WhatMatters");
    expect(heading?.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThanOrEqual(2);
    const text = canvasElement.textContent?.replace(/\s+/g, " ") ?? "";
    expect(text).toContain("Your brand is already online");
    expect(text).toContain("Make it impossible to ignore");
    const shapes = [...canvasElement.querySelectorAll("[data-text-sequence-shape]")];
    expect(shapes).toHaveLength(3);
    for (const shape of shapes) {
      expect(shape.getAttribute("aria-hidden")).toBe("true");
    }
    await waitFor(() => {
      const sequences = [...canvasElement.querySelectorAll("[data-text-sequence]")];
      expect(sequences).toHaveLength(2);
      for (const sequence of sequences) {
        expect(sequence.getAttribute("data-text-sequence-state")).toBe("playing");
        expect(sequence.getAttribute("aria-label")?.length).toBeGreaterThan(0);
      }
    });
  },
};

export const MarketingHeroTextSequenceNarrow: Story = {
  name: "Text sequence hero at 390",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: {
      options: {
        review390: {
          name: "Review 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile" as const,
        },
      },
    },
  },
  render: () => <MarketingHeroTextSequenceView />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    const text = canvasElement.textContent?.replace(/\s+/g, " ") ?? "";
    expect(text).toContain("Your brand is already online");
    expect(text).toContain("Make it impossible to ignore");
    expect(canvasElement.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim()).toBe("We Are WhatMatters");
    await waitFor(() => {
      expect(canvasElement.querySelectorAll("[data-text-sequence-shape]")).toHaveLength(3);
    });
    expectSequenceInsideViewport(canvasElement);
  },
};
