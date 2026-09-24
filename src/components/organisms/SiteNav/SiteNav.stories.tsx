import { useRef, useState, type ReactNode, type RefObject } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BookOpen,
  FileText,
  History,
  Mic,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { TextLink } from "../../atoms/TextLink/TextLink";
import {
  cardLayoutBodyOccupantRadiusClasses,
  cardLayoutBodyOccupantWellClasses,
} from "../../molecules/Card/Card";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { SiteNav, siteNavCompactLayouts, siteNavStates, type SiteNavState } from "./SiteNav";
import {
  siteNavMenuReadRowClasses,
  siteNavMenuReadThumbClasses,
} from "./siteNavStyles";

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

Three slots — \`start\` | \`middle\` | \`end\` — in any combination. **SiteNav.Brand** goes in \`start\`, **SiteNav.Links** in \`middle\`, secondary link + primary **Button** in \`end\`. Supply \`mobile\` to swap the middle slot for a **Menu** IconButton and an end **Sheet** below \`md\`.

| Prop | Purpose |
|------|---------|
| \`collapseAt\` | Scroll distance in px that reveals the compact pill. **Omit** for **50%** of the scrollport height (\`siteNavDefaultCollapseRatio\`) |
| \`state\` / \`onStateChange\` | Controlled state for specimens and tests |
| \`compactLayout\` | Scrolled pill only: \`hug\` (default, narrower content cluster) or \`grid\` (same \`--grid-max\` as expanded) |
| \`placement\` | \`fixed\` page chrome (in-flow expanded → fixed compact) or \`inline\` static specimen |
| \`scrollContainer\` | Ref to the scrolling element when the window does not scroll (compact uses sticky inside it) |

**Do not** reserve \`pt-16\` under SiteNav on product pages — the expanded band is in normal flow and owns its height. \`siteNavExpandedHeightClasses\` is only for the in-flow spacer while the compact pill is pinned.

**Two separate switches:** scroll compact ≠ More overflow. More only appears when the middle link track cannot fit every item (usually viewport-clamped). Expanded and compact-grid give the middle the leftover space after brand/CTA (not equal thirds), so both states show the same links when they fit.

## Anatomy

\`\`\`
SiteNav (header)
├── expanded — relative / in flow (scrolls away)
└── compact  — fixed (window) or sticky (scrollContainer), 1rem from top
    └── container — max-w-[--grid-max]; mega-menu anchor
        └── bar — expanded = full grid; compact = hug / narrower by default
            ├── start  → SiteNav.Brand (IconButton circular → <a>, or Button wordmark)
            ├── middle → SiteNav.Links (NavigationMenu)
            │   ├── SiteNav.Link  (Button ghost sm → <a>, aria-current)
            │   └── SiteNav.Menu  (Button ghost sm trigger + chevron)
            │       └── SiteNav.MenuSection × n
            │           ├── Featured → image + h2 + p + TextLink
            │           ├── Read → \`siteNavMenuReadRowClasses\` (stack below md) + TextLink
            │           └── Links → SiteNav.MenuLinkGrid → SiteNav.MenuLink (1-col below md)
            └── end    → Button ghost sm (sign in) + Button primary sm (CTA) + Menu IconButton (mobile)
Sheet side="end" → SiteNav.MobileLink rows          (only when \`mobile\` is set)
\`\`\`

## Best practices

- One **primary** CTA in \`end\`; everything else ghost.
- Keep top-level links to five or fewer; move the long tail into a **SiteNav.Menu**.
- Mega-menu sections: Featured is image + heading + copy + **TextLink** (no **Card**); **Read** uses \`siteNavMenuReadRowClasses\` / \`siteNavMenuReadThumbClasses\` (stack below \`md\`); **MenuLinkGrid** is 1-col below \`md\`, 2-col from \`md\` — no forms.
- **Engineer contract:** paste **Pattern — mega menu** Show code for the Resources panel. Do not invent a one-section \`MenuLinkGrid\` shortcut — that is not the mega pattern.
- Do not put **SegmentedControl** or **Tab** in the middle slot — those switch views, not pages.
- Mark the current page with \`current\` so it gets \`aria-current="page"\`.
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

function MediaPlaceholder({
  className,
  label = "Image placeholder",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`${cardLayoutBodyOccupantWellClasses} ${className ?? ""}`}
    />
  );
}

function ResourcesMenu() {
  return (
    <SiteNav.Menu label="Resources">
      <SiteNav.MenuSection label="Featured">
        <div className="flex flex-col gap-1 type-body">
          <MediaPlaceholder
            label="Featured story imagery"
            className={`aspect-[16/10] w-full ${cardLayoutBodyOccupantRadiusClasses}`}
          />
          <h2 className="type-heading-2 text-fg">
            WhatMatters named a Best Software Award winner
          </h2>
          <p className="text-muted">
            How teams cut meeting load without losing alignment — and what we shipped next.
          </p>
          <TextLink href="#featured">Read now</TextLink>
        </div>
      </SiteNav.MenuSection>

      <SiteNav.MenuSection label="Read">
        <ul className="m-0 flex list-none flex-col p-0">
          <li className="-mx-6 border-b border-border px-6 pb-5">
            <div className={siteNavMenuReadRowClasses}>
              <MediaPlaceholder
                label="Docs imagery"
                className={`${siteNavMenuReadThumbClasses} ${cardLayoutBodyOccupantRadiusClasses}`}
              />
              <div className="flex min-w-0 flex-col gap-1 type-body">
                <h3 className="type-heading-3 text-fg">Docs</h3>
                <p className="text-muted">
                  Patterns and APIs for building calm product surfaces.
                </p>
                <TextLink href="#docs">Read now</TextLink>
              </div>
            </div>
          </li>
          <li className="px-0 pt-5">
            <div className={siteNavMenuReadRowClasses}>
              <MediaPlaceholder
                label="Opinion imagery"
                className={`${siteNavMenuReadThumbClasses} ${cardLayoutBodyOccupantRadiusClasses}`}
              />
              <div className="flex min-w-0 flex-col gap-1 type-body">
                <h3 className="type-heading-3 text-fg">Opinion articles</h3>
                <p className="text-muted">
                  Notes on focus, backlog shape, and shipping what matters.
                </p>
                <TextLink href="#opinion">Read now</TextLink>
              </div>
            </div>
          </li>
        </ul>
      </SiteNav.MenuSection>

      <SiteNav.MenuSection label="Links">
        <SiteNav.MenuLinkGrid>
          <SiteNav.MenuLink href="#podcast" icon={<Mic />}>
            Podcast
          </SiteNav.MenuLink>
          <SiteNav.MenuLink href="https://youtube.com" icon={<Video />} external>
            YouTube
          </SiteNav.MenuLink>
          <SiteNav.MenuLink href="#webinars" icon={<Target />}>
            Webinars
          </SiteNav.MenuLink>
          <SiteNav.MenuLink href="#changelog" icon={<History />}>
            Changelog
          </SiteNav.MenuLink>
          <SiteNav.MenuLink href="#blog" icon={<FileText />}>
            Blog
          </SiteNav.MenuLink>
          <SiteNav.MenuLink href="#docs" icon={<BookOpen />}>
            Docs
          </SiteNav.MenuLink>
        </SiteNav.MenuLinkGrid>
      </SiteNav.MenuSection>
    </SiteNav.Menu>
  );
}

function PrimaryLinks({ menu = true }: { menu?: boolean }) {
  return (
    <SiteNav.Links>
      <SiteNav.Link href="#product" current>Product</SiteNav.Link>
      <SiteNav.Link href="#pricing">Pricing</SiteNav.Link>
      <SiteNav.Link href="#customers">Customers</SiteNav.Link>
      {menu ? <ResourcesMenu /> : null}
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
import { Button, SiteNav, TextLink, cardLayoutBodyOccupantRadiusClasses, cardLayoutBodyOccupantWellClasses, siteNavMenuReadRowClasses, siteNavMenuReadThumbClasses } from "@whatmatters/wmds";
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
            <SiteNav.Menu label="Resources">
              <SiteNav.MenuSection label="Featured">
                <div className="flex flex-col gap-1 type-body">
                  <div
                    role="img"
                    aria-label="Featured story imagery"
                    className={\`aspect-[16/10] w-full \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantRadiusClasses}\`}
                  />
                  <h2 className="type-heading-2 text-fg">WhatMatters named a Best Software Award winner</h2>
                  <p className="text-muted">
                    How teams cut meeting load without losing alignment — and what we shipped next.
                  </p>
                  <TextLink href="/featured">Read now</TextLink>
                </div>
              </SiteNav.MenuSection>
              <SiteNav.MenuSection label="Read">
                <ul className="m-0 flex list-none flex-col p-0">
                  <li className="-mx-6 border-b border-border px-6 pb-5">
                    <div className={siteNavMenuReadRowClasses}>
                      <div
                        role="img"
                        aria-label="Docs imagery"
                        className={\`\${siteNavMenuReadThumbClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantRadiusClasses}\`}
                      />
                      <div className="flex min-w-0 flex-col gap-1 type-body">
                        <h3 className="type-heading-3 text-fg">Docs</h3>
                        <p className="text-muted">Patterns and APIs for building calm product surfaces.</p>
                        <TextLink href="/docs">Read now</TextLink>
                      </div>
                    </div>
                  </li>
                  <li className="px-0 pt-5">
                    <div className={siteNavMenuReadRowClasses}>
                      <div
                        role="img"
                        aria-label="Opinion imagery"
                        className={\`\${siteNavMenuReadThumbClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantRadiusClasses}\`}
                      />
                      <div className="flex min-w-0 flex-col gap-1 type-body">
                        <h3 className="type-heading-3 text-fg">Opinion articles</h3>
                        <p className="text-muted">Notes on focus, backlog shape, and shipping what matters.</p>
                        <TextLink href="/opinion">Read now</TextLink>
                      </div>
                    </div>
                  </li>
                </ul>
              </SiteNav.MenuSection>
              <SiteNav.MenuSection label="Links">
                <SiteNav.MenuLinkGrid>
                  <SiteNav.MenuLink href="/podcast" icon={<Mic />}>Podcast</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="https://youtube.com" icon={<Video />} external>YouTube</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/webinars" icon={<Target />}>Webinars</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/changelog" icon={<History />}>Changelog</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/blog" icon={<FileText />}>Blog</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/docs" icon={<BookOpen />}>Docs</SiteNav.MenuLink>
                </SiteNav.MenuLinkGrid>
              </SiteNav.MenuSection>
            </SiteNav.Menu>
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
            "Hover or focus **Resources**. Below `md`, sections stack and **Read** rows go media → title → copy; **MenuLinkGrid** is one column. From `md` up: three columns — **Featured**, **Read** (thumb beside copy), **Links** (two columns). Open menu dims the page. No **Card** in Featured.",
        },
      },
    },
    `
import { SiteNav, TextLink, cardLayoutBodyOccupantRadiusClasses, cardLayoutBodyOccupantWellClasses, siteNavMenuReadRowClasses, siteNavMenuReadThumbClasses } from "@whatmatters/wmds";
import { BookOpen, FileText, History, Mic, Target, Video } from "lucide-react";

export function ResourcesMenu() {
  return (
    <SiteNav.Menu label="Resources">
      <SiteNav.MenuSection label="Featured">
        <div className="flex flex-col gap-1 type-body">
          <div
            role="img"
            aria-label="Featured story imagery"
            className={\`aspect-[16/10] w-full \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantRadiusClasses}\`}
          />
          <h2 className="type-heading-2 text-fg">WhatMatters named a Best Software Award winner</h2>
          <p className="text-muted">
            How teams cut meeting load without losing alignment — and what we shipped next.
          </p>
          <TextLink href="/featured">Read now</TextLink>
        </div>
      </SiteNav.MenuSection>
      <SiteNav.MenuSection label="Read">
        <ul className="m-0 flex list-none flex-col p-0">
          <li className="-mx-6 border-b border-border px-6 pb-5">
            <div className={siteNavMenuReadRowClasses}>
              <div
                role="img"
                aria-label="Docs imagery"
                className={\`\${siteNavMenuReadThumbClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantRadiusClasses}\`}
              />
              <div className="flex min-w-0 flex-col gap-1 type-body">
                <h3 className="type-heading-3 text-fg">Docs</h3>
                <p className="text-muted">Patterns and APIs for building calm product surfaces.</p>
                <TextLink href="/docs">Read now</TextLink>
              </div>
            </div>
          </li>
          <li className="px-0 pt-5">
            <div className={siteNavMenuReadRowClasses}>
              <div
                role="img"
                aria-label="Opinion imagery"
                className={\`\${siteNavMenuReadThumbClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantRadiusClasses}\`}
              />
              <div className="flex min-w-0 flex-col gap-1 type-body">
                <h3 className="type-heading-3 text-fg">Opinion articles</h3>
                <p className="text-muted">Notes on focus, backlog shape, and shipping what matters.</p>
                <TextLink href="/opinion">Read now</TextLink>
              </div>
            </div>
          </li>
        </ul>
      </SiteNav.MenuSection>
      <SiteNav.MenuSection label="Links">
        <SiteNav.MenuLinkGrid>
          <SiteNav.MenuLink href="/podcast" icon={<Mic />}>Podcast</SiteNav.MenuLink>
          <SiteNav.MenuLink href="https://youtube.com" icon={<Video />} external>YouTube</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/webinars" icon={<Target />}>Webinars</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/changelog" icon={<History />}>Changelog</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/blog" icon={<FileText />}>Blog</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/docs" icon={<BookOpen />}>Docs</SiteNav.MenuLink>
        </SiteNav.MenuLinkGrid>
      </SiteNav.MenuSection>
    </SiteNav.Menu>
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
