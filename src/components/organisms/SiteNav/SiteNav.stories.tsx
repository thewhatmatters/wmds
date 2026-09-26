import { useRef, useState, type ReactNode, type RefObject } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { SiteNav, siteNavCompactLayouts, siteNavStates, type SiteNavState } from "./SiteNav";
import {
  SiteNavResourcesMenu,
  indentSiteNavResourcesMenuCopySource,
} from "./siteNavResourcesSpecimen";

const meta = {
  title: "Components/Navigation/SiteNav",
  component: SiteNav,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    state: { control: "select", options: [undefined, ...siteNavStates] },
    compactLayout: { control: "select", options: [...siteNavCompactLayouts] },
    collapseAt: { control: { type: "number", min: 0, step: 8 } },
    start: { control: false },
    middle: { control: false },
    end: { control: false },
    mobile: { control: false },
    scrollContainer: { control: false },
    onStateChange: { action: "state changed" },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Marketing site header. Expanded is **in document flow** (scrolls away with the page). After the reader scrolls past half the scrollport (or an explicit \`collapseAt\` in px), a separate floating hug pill **pins 1rem from the top**; the expanded band does not morph.

**Page chrome** (\`placement="fixed"\`, optional \`scrollContainer\`) vs **specimen** (\`placement="inline"\` without a scroller). Do not invent a third positioning mode.

Three slots — \`start\` | \`middle\` | \`end\` — in any combination. **SiteNav.Brand** goes in \`start\`, **SiteNav.Links** in \`middle\`, secondary link + primary **Button** in \`end\`. Supply \`mobile\` to swap the middle slot for a **Menu** IconButton and an end **Sheet** below \`md\`.

A \`current\` link is a light gray pill (\`bg-fill-selected\`), including the mobile sheet row. Compact chrome is the frosted elevation surface (\`bg-elevation-surface\`, \`border-elevation-edge\`, \`shadow-soft-sm\`) and keeps its pill radius and backdrop blur.

| Prop | Purpose |
|------|---------|
| \`collapseAt\` | Scroll distance in px that reveals the compact pill. **Omit** for **50%** of the scrollport height (\`siteNavDefaultCollapseRatio\`) |
| \`state\` / \`onStateChange\` | Controlled state for specimens and tests |
| \`compactLayout\` | Scrolled pill only: \`hug\` (default, narrower content cluster) or \`grid\` (same \`--grid-max\` as expanded) |
| \`placement\` | \`fixed\` page chrome (in-flow expanded → pinned compact) or \`inline\` static specimen |
| \`scrollContainer\` | Ref to the scrolling element when the window does not scroll (compact uses sticky inside it) |

**Do not** reserve \`pt-16\` under SiteNav on product pages — the expanded band is in normal flow and owns its height. A first-viewport hero under that band uses \`min-h-[calc(100svh-var(--site-nav-height))]\`. \`--site-nav-height\` matches the expanded band.

**Two separate switches:** scroll compact ≠ More overflow. More only appears when the middle link track cannot fit every item.

## Anatomy

\`\`\`
SiteNav (header)
├── expanded — relative / in flow (scrolls away)
└── compact  — fixed (window) or sticky (scrollContainer), 1rem from top
    └── bar
        ├── start  → SiteNav.Brand
        ├── middle → SiteNav.Links
        │   ├── SiteNav.Link
        │   └── SiteNav.Menu
        │       └── SiteNav.MenuSection
        │           ├── SiteNav.Featured + SiteNav.MenuMedia
        │           ├── SiteNav.ReadRow + SiteNav.MenuMedia
        │           └── SiteNav.MenuLinkGrid → SiteNav.MenuLink
        └── end    → Buttons + mobile Menu IconButton
Sheet → SiteNav.MobileLink
\`\`\`

## Best practices

- One **primary** CTA in \`end\`; everything else ghost.
- Mega body: compose **SiteNav.Featured** / **ReadRow** / **MenuMedia** / **MenuLinkGrid** — paste **Pattern — mega menu** Show code. Do not assemble Card occupant class strings by hand.
- Do not put **SegmentedControl** or **Tab** in the middle slot.
- Mark the current page with \`current\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof SiteNav>;

export default meta;
type Story = StoryObj<typeof meta>;

function BrandMark() {
  return (
    <SiteNav.Brand
      href="#home"
      aria-label="WhatMatters"
      icon={<Sparkles strokeWidth={2} />}
    />
  );
}

function PrimaryLinks({ menu = true }: { menu?: boolean }) {
  return (
    <SiteNav.Links>
      <SiteNav.Link href="#product" current>Product</SiteNav.Link>
      <SiteNav.Link href="#pricing">Pricing</SiteNav.Link>
      <SiteNav.Link href="#customers">Customers</SiteNav.Link>
      {menu ? <SiteNavResourcesMenu /> : null}
    </SiteNav.Links>
  );
}

function EndActions() {
  return (
    <>
      <Button role="ghost" size="sm" render={<a href="#signin" />} className="whitespace-nowrap">
        Sign in
      </Button>
      <Button role="primary" size="sm" render={<a href="#start" />} className="whitespace-nowrap">
        Get started
      </Button>
    </>
  );
}

function MobileLinks() {
  return (
    <>
      <SiteNav.MobileLink href="#product" current>Product</SiteNav.MobileLink>
      <SiteNav.MobileLink href="#pricing">Pricing</SiteNav.MobileLink>
      <SiteNav.MobileLink href="#customers">Customers</SiteNav.MobileLink>
      <SiteNav.MobileLink href="#blog">Blog</SiteNav.MobileLink>
      <SiteNav.MobileLink href="#docs">Documentation</SiteNav.MobileLink>
    </>
  );
}

/**
 * Scroll demo frame — tall enough to clear `collapseAt` and keep scrolling.
 * Apps still use `placement="fixed"` on the page.
 */
function ScrollPanel({
  nav,
}: {
  nav: (scrollContainer: RefObject<HTMLDivElement | null>) => ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollerRef}
      className="h-[min(48rem,80vh)] overflow-y-auto rounded-2xl border border-border bg-body"
    >
      {nav(scrollerRef)}
      <div className="flex flex-col gap-6 px-6 pb-24 pt-4">
        <p className={typographyClass("overline")}>Scroll this panel to collapse</p>
        <h1 className="type-heading-2 text-fg">Plan the week around what matters.</h1>
        <p className="type-body max-w-prose text-muted">
          WhatMatters turns a noisy backlog into one calm list. The expanded nav scrolls away with
          the page; past half the panel height the compact pill pins 1rem from the top.
        </p>
        <div className="h-64 rounded-xl bg-secondary/40" aria-hidden />
        <p className="type-body text-muted">Keep scrolling — compact pill should stay pinned above.</p>
        <div className="h-64 rounded-xl bg-secondary/30" aria-hidden />
        <p className="type-body text-muted">Still more room below so the threshold is easy to clear.</p>
        <div className="h-80 rounded-xl bg-secondary/20" aria-hidden />
      </div>
    </div>
  );
}

export const MarketingHeader: Story = {
  name: "Pattern — marketing header",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "padded",
      docs: {
        description: {
          story:
            "Scroll inside the panel: expanded nav scrolls away with the content; past **half the panel height** a hug pill pins **1rem** from the top. **Resources** mega must match **Pattern — mega menu** Show code.",
        },
      },
    },
    `
import { Button, SiteNav } from "@whatmatters/wmds";
import { BookOpen, FileText, History, Mic, Sparkles, Target, Video } from "lucide-react";

export function MarketingHeader() {
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
${indentSiteNavResourcesMenuCopySource(12)}
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
            <SiteNav.MobileLink href="/blog">Blog</SiteNav.MobileLink>
          </>
        }
      />
      <main className="grid-page">{/* page content — no pt-16; SiteNav is in flow */}</main>
    </>
  );
}
`,
  ),
  render: (args) => (
    <ScrollPanel
      nav={(scrollContainer) => (
        <SiteNav
          {...args}
          placement="inline"
          scrollContainer={scrollContainer}
          start={<BrandMark />}
          middle={<PrimaryLinks />}
          end={<EndActions />}
          mobile={<MobileLinks />}
        />
      )}
    />
  ),
};

export const BrandAndCta: Story = {
  name: "Pattern — brand + CTA",
  args: { placement: "inline", state: "expanded" },
  parameters: storyCopySource(`
import { Button, SiteNav } from "@whatmatters/wmds";
import { Sparkles } from "lucide-react";

export function BrandAndCtaNav() {
  return (
    <SiteNav
      start={
        <SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />
      }
      end={<Button role="primary" size="sm" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>}
    />
  );
}
`),
  render: (args) => (
    <SiteNav
      {...args}
      start={<BrandMark />}
      end={<Button role="primary" size="sm" render={<a href="#start" />} className="whitespace-nowrap">Get started</Button>}
    />
  ),
};

export const CenteredLinks: Story = {
  name: "Pattern — centered links",
  args: { placement: "inline", state: "expanded" },
  parameters: storyCopySource(`
import { SiteNav } from "@whatmatters/wmds";

export function CenteredLinksNav() {
  return (
    <SiteNav
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="/work" current>Work</SiteNav.Link>
          <SiteNav.Link href="/about">About</SiteNav.Link>
          <SiteNav.Link href="/journal">Journal</SiteNav.Link>
          <SiteNav.Link href="/contact">Contact</SiteNav.Link>
        </SiteNav.Links>
      }
    />
  );
}
`),
  render: (args) => (
    <SiteNav
      {...args}
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="#work" current>Work</SiteNav.Link>
          <SiteNav.Link href="#about">About</SiteNav.Link>
          <SiteNav.Link href="#journal">Journal</SiteNav.Link>
          <SiteNav.Link href="#contact">Contact</SiteNav.Link>
        </SiteNav.Links>
      }
    />
  ),
};

export const MegaMenu: Story = {
  name: "Pattern — mega menu",
  args: { placement: "inline", state: "expanded" },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Hover or focus **Resources**. Compose **SiteNav.Featured** / **ReadRow** / **MenuMedia** / **MenuLinkGrid**. Below `md`, sections stack and **Read** rows go media → title → copy; **MenuLinkGrid** is one column. From `md` up: three columns. Open menu dims the page. No **Card** in Featured.",
        },
      },
    },
    `
import { SiteNav } from "@whatmatters/wmds";
import { BookOpen, FileText, History, Mic, Target, Video } from "lucide-react";

export function ResourcesMenu() {
  return (
${indentSiteNavResourcesMenuCopySource(4)}
  );
}
`,
  ),
  render: (args) => (
    <div className="min-h-[32rem]">
      <SiteNav
        {...args}
        start={<BrandMark />}
        middle={<PrimaryLinks />}
        end={<EndActions />}
      />
    </div>
  ),
};

export const Compact: Story = {
  name: "Pattern — compact (scrolled)",
  args: { placement: "inline", state: "compact" },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The scrolled state, frozen with `state=\"compact\"`. Default `compactLayout=\"hug\"` is narrower than the expanded grid band; toggle **grid** to match `--grid-max`.",
        },
      },
    },
    `
import { SiteNav } from "@whatmatters/wmds";

// Controlled state — useful for tests and static specimens. Omit \`state\` to let scroll drive it.
<SiteNav state="compact" start={…} middle={…} end={…} />
`,
  ),
  render: (args) => (
    <div className="rounded-2xl bg-secondary/40 p-4">
      <SiteNav
        {...args}
        start={<BrandMark />}
        middle={<PrimaryLinks />}
        end={<EndActions />}
      />
    </div>
  ),
};

export const MobileMenu: Story = {
  name: "Pattern — mobile menu",
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Below `md` the middle slot hides and a **Menu** IconButton opens a **Sheet** from the end edge with **SiteNav.MobileLink** rows. Supplying `mobile` is what turns this on.",
      },
    },
  },
  render: (args) => (
    <ScrollPanel
      nav={(scrollContainer) => (
        <SiteNav
          {...args}
          placement="inline"
          scrollContainer={scrollContainer}
          start={<BrandMark />}
          middle={<PrimaryLinks />}
          end={
            <Button role="primary" size="sm" render={<a href="#start" />} className="whitespace-nowrap">
              Start
            </Button>
          }
          mobile={<MobileLinks />}
        />
      )}
    />
  ),
};

function StateToggleSpecimen() {
  const [state, setState] = useState<SiteNavState>("expanded");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        {siteNavStates.map((value) => (
          <Button
            key={value}
            role={state === value ? "primary" : "secondary"}
            size="xs"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="min-h-32 rounded-2xl bg-secondary/40">
        <SiteNav
          placement="inline"
          state={state}
          start={<BrandMark />}
          middle={<PrimaryLinks menu={false} />}
          end={<EndActions />}
        />
      </div>
    </div>
  );
}

export const States: Story = {
  name: "Reference — states",
  parameters: {
    docs: {
      description: {
        story: "Flip between `expanded` and `compact` to see the compact pill slide in without scrolling.",
      },
    },
  },
  render: () => <StateToggleSpecimen />,
};

export const SlotMatrix: Story = {
  name: "Reference — slot matrix",
  parameters: {
    docs: {
      description: {
        story: "Every slot combination — the middle slot stays optically centered whenever both ends exist.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["start + middle + end", true, true, true],
          ["start + end", true, false, true],
          ["middle only", false, true, false],
          ["start + middle", true, true, false],
          ["middle + end", false, true, true],
        ] as const
      ).map(([label, start, middle, end]) => (
        <div key={label} className="flex flex-col gap-2">
          <p className={typographyClass("overline")}>{label}</p>
          <div className="rounded-2xl bg-secondary/40">
            <SiteNav
              placement="inline"
              state="expanded"
              start={start ? <BrandMark /> : undefined}
              middle={middle ? <PrimaryLinks menu={false} /> : undefined}
              end={end ? <EndActions /> : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
