import { useRef, useState, type ReactNode, type RefObject } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BookOpen,
  Sparkles,
  Headphones,
  LifeBuoy,
  Newspaper,
  Users,
  Video,
} from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../../molecules/Card/Card";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { SiteNav, siteNavCompactLayouts, siteNavStates, type SiteNavState } from "./SiteNav";

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

Marketing site header. At the top of the page it is a full-width transparent band aligned to the grid margins; once the reader scrolls past \`collapseAt\` (48px) it morphs into a floating pill inside \`--grid-max\` with a blurred surface, hairline, and raised shadow.

Three slots — \`start\` | \`middle\` | \`end\` — in any combination. **SiteNav.Brand** goes in \`start\`, **SiteNav.Links** in \`middle\`, secondary link + primary **Button** in \`end\`. Supply \`mobile\` to swap the middle slot for a **Menu** IconButton and an end **Sheet** below \`md\`.

| Prop | Purpose |
|------|---------|
| \`collapseAt\` | Scroll distance that flips expanded → compact (default 48) |
| \`state\` / \`onStateChange\` | Controlled state for specimens and tests |
| \`compactLayout\` | \`grid\` (default) fills \`--grid-max\`; \`hug\` shrinks to the items |
| \`placement\` | \`fixed\` page chrome (default) or \`inline\` static specimen |
| \`scrollContainer\` | Ref to the scrolling element when the window does not scroll |

Reserve the expanded band on the page with \`pt-16\` (**\`siteNavExpandedHeightClasses\`**) so hero copy does not start underneath the nav.

## Anatomy

\`\`\`
SiteNav (header, fixed, pointer-events-none)
└── container — max-w-[--grid-max]; mega-menu anchor
    └── bar — Motion layout morph: band ↔ pill
        ├── start  → SiteNav.Brand (Button ghost sm → <a>)
        ├── middle → SiteNav.Links (NavigationMenu)
        │   ├── SiteNav.Link  (Button ghost sm → <a>, aria-current)
        │   └── SiteNav.Menu  (Button ghost sm trigger + chevron)
        │       └── SiteNav.MenuSection × n → Card | SiteNav.MenuLinkGrid → SiteNav.MenuLink
        └── end    → Button ghost sm (sign in) + Button primary sm (CTA) + Menu IconButton (mobile)
Sheet side="end" → SiteNav.MobileLink rows          (only when \`mobile\` is set)
\`\`\`

## Best practices

- One **primary** CTA in \`end\`; everything else ghost.
- Keep top-level links to five or fewer; move the long tail into a **SiteNav.Menu**.
- Mega-menu sections: one **Featured** Card at most, then quiet link grids — no forms.
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
    <SiteNav.Brand href="#home" aria-label="WhatMatters">
      <Sparkles strokeWidth={2} aria-hidden />
    </SiteNav.Brand>
  );
}

function ResourcesMenu() {
  return (
    <SiteNav.Menu label="Resources">
      <SiteNav.MenuSection label="Featured">
        <Card variant="outlined" padding="md">
          <div className="flex flex-col gap-2">
            <p className={typographyClass("ui-label")}>Field guide to focus</p>
            <p className={typographyClass("caption")}>
              How five teams cut their meeting load by a third without losing alignment.
            </p>
            <Button role="secondary" size="xs" className="self-start" render={<a href="#guide" />}>
              Read the guide
            </Button>
          </div>
        </Card>
      </SiteNav.MenuSection>
      <SiteNav.MenuSection label="Read" span={2}>
        <SiteNav.MenuLinkGrid>
          <SiteNav.MenuLink href="#blog" icon={<Newspaper />}>Blog</SiteNav.MenuLink>
          <SiteNav.MenuLink href="#docs" icon={<BookOpen />}>Documentation</SiteNav.MenuLink>
          <SiteNav.MenuLink href="#community" icon={<Users />}>Community</SiteNav.MenuLink>
          <SiteNav.MenuLink href="#help" icon={<LifeBuoy />}>Help center</SiteNav.MenuLink>
        </SiteNav.MenuLinkGrid>
      </SiteNav.MenuSection>
      <SiteNav.MenuSection label="Watch & listen">
        <SiteNav.MenuLinkGrid>
          <SiteNav.MenuLink href="https://youtube.com" icon={<Video />} external>YouTube</SiteNav.MenuLink>
          <SiteNav.MenuLink href="#podcast" icon={<Headphones />}>Podcast</SiteNav.MenuLink>
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
 * Compact scroll panel — collapses SiteNav inside a short frame so Storybook
 * canvases stay short. Apps still use `placement="fixed"` on the page.
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
      className="h-[28rem] overflow-y-auto rounded-2xl border border-border bg-body"
    >
      <div className="sticky top-0 z-40">{nav(scrollerRef)}</div>
      <div className="flex flex-col gap-4 px-6 pb-10 pt-4">
        <p className={typographyClass("overline")}>Scroll this panel to collapse</p>
        <h1 className="type-heading-2 text-fg">Plan the week around what matters.</h1>
        <p className="type-body max-w-prose text-muted">
          WhatMatters turns a noisy backlog into one calm list. Scroll a little to see the
          pill morph — the canvas stays short on purpose.
        </p>
        <div className="h-40 rounded-xl bg-secondary/40" aria-hidden />
        <p className="type-body text-muted">Compact state should be active above.</p>
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
            "Scroll inside the panel (not the Storybook canvas): the band collapses into a floating pill after 48px. Hover **Resources** for the mega menu.",
        },
      },
    },
    `
import { Button, SiteNav } from "@whatmatters/wmds";
import { BookOpen, Newspaper, Sparkles, Users } from "lucide-react";

export function MarketingHeader() {
  return (
    <>
      <SiteNav
        start={
          <SiteNav.Brand href="/" aria-label="WhatMatters">
            <Sparkles aria-hidden />
          </SiteNav.Brand>
        }
        middle={
          <SiteNav.Links>
            <SiteNav.Link href="/product" current>Product</SiteNav.Link>
            <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
            <SiteNav.Link href="/customers">Customers</SiteNav.Link>
            <SiteNav.Menu label="Resources">
              <SiteNav.MenuSection label="Read" span={2}>
                <SiteNav.MenuLinkGrid>
                  <SiteNav.MenuLink href="/blog" icon={<Newspaper />}>Blog</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/docs" icon={<BookOpen />}>Documentation</SiteNav.MenuLink>
                  <SiteNav.MenuLink href="/community" icon={<Users />}>Community</SiteNav.MenuLink>
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
      <main className="grid-page pt-16">{/* page content */}</main>
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
        <SiteNav.Brand href="/" aria-label="WhatMatters">
          <Sparkles aria-hidden />
        </SiteNav.Brand>
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
            "Hover or focus **Resources**. Sections are grid columns — `span` widens one; the **Featured** column composes an outlined **Card**; link rows are **SiteNav.MenuLink** (ghost **Button** anchors).",
        },
      },
    },
    `
import { Button, Card, SiteNav } from "@whatmatters/wmds";
import { BookOpen, Headphones, LifeBuoy, Newspaper, Users, Video } from "lucide-react";

export function ResourcesMenu() {
  return (
    <SiteNav.Menu label="Resources">
      <SiteNav.MenuSection label="Featured">
        <Card variant="outlined" padding="md">
          <div className="flex flex-col gap-2">
            <p className="type-label text-fg">Field guide to focus</p>
            <p className="type-supporting text-muted">How five teams cut their meeting load by a third.</p>
            <Button role="secondary" size="xs" className="self-start" render={<a href="/guide" />}>
              Read the guide
            </Button>
          </div>
        </Card>
      </SiteNav.MenuSection>
      <SiteNav.MenuSection label="Read" span={2}>
        <SiteNav.MenuLinkGrid>
          <SiteNav.MenuLink href="/blog" icon={<Newspaper />}>Blog</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/docs" icon={<BookOpen />}>Documentation</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/community" icon={<Users />}>Community</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/help" icon={<LifeBuoy />}>Help center</SiteNav.MenuLink>
        </SiteNav.MenuLinkGrid>
      </SiteNav.MenuSection>
      <SiteNav.MenuSection label="Watch & listen">
        <SiteNav.MenuLinkGrid>
          <SiteNav.MenuLink href="https://youtube.com" icon={<Video />} external>YouTube</SiteNav.MenuLink>
          <SiteNav.MenuLink href="/podcast" icon={<Headphones />}>Podcast</SiteNav.MenuLink>
        </SiteNav.MenuLinkGrid>
      </SiteNav.MenuSection>
    </SiteNav.Menu>
  );
}
`,
  ),
  render: (args) => (
    <div className="min-h-[16rem]">
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
            "The scrolled state, frozen with `state=\"compact\"`. Toggle **compactLayout** between `grid` (fills `--grid-max`) and `hug`.",
        },
      },
    },
    `
import { SiteNav } from "@whatmatters/wmds";

// Controlled state — useful for tests and static specimens. Omit \`state\` to let scroll drive it.
<SiteNav state="compact" compactLayout="hug" start={…} middle={…} end={…} />
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
        story: "Flip between `expanded` and `compact` to see the Motion layout morph without scrolling.",
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
