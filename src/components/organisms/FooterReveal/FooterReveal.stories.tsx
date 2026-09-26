import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { SiteNav } from "../SiteNav/SiteNav";
import { FooterReveal } from "./FooterReveal";
import { footerRevealFieldClasses, footerRevealFieldLinkClasses } from "./footerRevealStyles";

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

Page root for a marketing scroll: **FooterReveal.Content** (the cover) then **FooterReveal.Footer** (any footer). The cover is at least \`100dvh\`, painted with the page background, and stacked above the footer. The footer sticks to the bottom of the viewport underneath that cover.

As the cover's bottom edge meets the viewport bottom, the footer scrubs from transparent / 0.9 scale / 6px blur to opaque / full size / sharp, across one footer-height of scroll. \`will-change\` is set only while that scrub is in progress.

\`prefers-reduced-motion\`: the footer stays fully visible — opacity 1, scale 1, no blur.

| Slot | Purpose |
|------|---------|
| **FooterReveal.Content** | Page body. Opaque (\`bg-body\` by default). Do not clip overflow on the root |
| **FooterReveal.Footer** | Footer contents. \`className\` lands on the fading field — use **\`footerRevealFieldClasses\`** |
| \`useFooterRevealProgress\` | Reveal progress MotionValue, 0 covered → 1 uncovered (stuck at 1 when reduced motion is on) |

## Anatomy

\`\`\`
FooterReveal — isolation: isolate (overflow-x clip, overflow-y visible)
├── FooterReveal.Content — relative, z-index 1, min-height 100dvh, bg-body
└── FooterReveal.Footer — sticky, bottom 0, z-index -1
    └── fade (opacity) → scale / blur (origin 50% 100%) → footer contents
\`\`\`

## Best practices

- One **FooterReveal** per page. Put **SiteNav** and \`grid-page\` inside **Content**.
- Field color is **\`footerRevealFieldClasses\`** (\`bg-primary\` / \`text-primary-foreground\`). No separate footer color token.
- Links on that field use **\`footerRevealFieldLinkClasses\`** (inherit on-primary ink). **TextLink** stays the prose-on-body treatment.
- Do not hide the scrollbar. The page grid already reserves a stable gutter; that gutter can show the page background beside the field. The root clips the inline axis only so a full-bleed field does not open a horizontal scrollbar.
- Do not put \`overflow-hidden\` on **FooterReveal** — it breaks \`position: sticky\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof FooterReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

const marketingPageCopySource = `
import { Button, FooterReveal, SiteNav, footerRevealFieldClasses, footerRevealFieldLinkClasses } from "@whatmatters/wmds";
import { Sparkles } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Priorities" },
      { href: "/plan", label: "Weekly plan" },
      { href: "/shared", label: "Shared lists" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/customers", label: "Customers" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
      { href: "/support", label: "Support" },
    ],
  },
] as const;

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
              <div className="flex flex-wrap gap-3">
                <Button role="primary" size="md" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>
                <Button role="secondary" size="md" render={<a href="/product" />} className="whitespace-nowrap">See product</Button>
              </div>
            </div>
          </div>
          <div id="product" className="band py-12">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">One list, not another dashboard</h2>
              <p className="type-body max-w-prose text-muted">
                Capture everything, then keep only the work that changes the week. Shared lists stay in sync without a second tool.
              </p>
            </div>
          </div>
          <div id="pricing" className="band py-12">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">Pricing that stays out of the way</h2>
              <p className="type-body max-w-prose text-muted">
                Start with the calm list. Invite the rest of the team when the week is already under control.
              </p>
            </div>
          </div>
          <div id="customers" className="band py-16">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">Teams who stopped re-sorting Monday</h2>
              <p className="type-body max-w-prose text-muted">
                Scroll to the end of the cover. The footer sits underneath and sharpens into place across its own height.
              </p>
            </div>
          </div>
        </main>
      </FooterReveal.Content>
      <FooterReveal.Footer className={footerRevealFieldClasses}>
        <div className="mx-auto flex w-full max-w-[var(--grid-max)] flex-col gap-10 px-[var(--grid-margin)] py-16">
          <div className="max-w-md">
            <p className="type-heading-4 text-primary-foreground">WhatMatters</p>
            <p className="type-body mt-3 text-primary-foreground/80">
              One calm list for the week. Priorities stay put; the rest can wait.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h2 className="type-supporting font-medium uppercase tracking-wider text-primary-foreground/70">{column.title}</h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={footerRevealFieldLinkClasses}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/20 pt-6">
            <p className="type-supporting text-primary-foreground/70">© 2026 WhatMatters</p>
            <ul className="flex flex-wrap gap-6">
              <li><a href="/privacy" className={footerRevealFieldLinkClasses}>Privacy</a></li>
              <li><a href="/terms" className={footerRevealFieldLinkClasses}>Terms</a></li>
            </ul>
          </div>
        </div>
      </FooterReveal.Footer>
    </FooterReveal>
  );
}
`.trim();

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Priorities" },
      { href: "/plan", label: "Weekly plan" },
      { href: "/shared", label: "Shared lists" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/customers", label: "Customers" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
      { href: "/support", label: "Support" },
    ],
  },
] as const;

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
              <div className="flex flex-wrap gap-3">
                <Button role="primary" size="md" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>
                <Button role="secondary" size="md" render={<a href="/product" />} className="whitespace-nowrap">See product</Button>
              </div>
            </div>
          </div>
          <div id="product" className="band py-12">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">One list, not another dashboard</h2>
              <p className="type-body max-w-prose text-muted">
                Capture everything, then keep only the work that changes the week. Shared lists stay in sync without a second tool.
              </p>
            </div>
          </div>
          <div id="pricing" className="band py-12">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">Pricing that stays out of the way</h2>
              <p className="type-body max-w-prose text-muted">
                Start with the calm list. Invite the rest of the team when the week is already under control.
              </p>
            </div>
          </div>
          <div id="customers" className="band py-16">
            <div className="col-span-full flex flex-col gap-3 lg:col-span-8 lg:col-start-3">
              <h2 className="type-heading-2 text-fg">Teams who stopped re-sorting Monday</h2>
              <p className="type-body max-w-prose text-muted">
                Scroll to the end of the cover. The footer sits underneath and sharpens into place across its own height.
              </p>
            </div>
          </div>
        </main>
      </FooterReveal.Content>
      <FooterReveal.Footer className={footerRevealFieldClasses}>
        <div className="mx-auto flex w-full max-w-[var(--grid-max)] flex-col gap-10 px-[var(--grid-margin)] py-16">
          <div className="max-w-md">
            <p className="type-heading-4 text-primary-foreground">WhatMatters</p>
            <p className="type-body mt-3 text-primary-foreground/80">
              One calm list for the week. Priorities stay put; the rest can wait.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h2 className="type-supporting font-medium uppercase tracking-wider text-primary-foreground/70">{column.title}</h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={footerRevealFieldLinkClasses}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/20 pt-6">
            <p className="type-supporting text-primary-foreground/70">© 2026 WhatMatters</p>
            <ul className="flex flex-wrap gap-6">
              <li><a href="/privacy" className={footerRevealFieldLinkClasses}>Privacy</a></li>
              <li><a href="/terms" className={footerRevealFieldLinkClasses}>Terms</a></li>
            </ul>
          </div>
        </div>
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
            "Marketing page: **SiteNav** and `grid-page` sit in **FooterReveal.Content**. **FooterReveal.Footer** uses **footerRevealFieldClasses**. Scroll until the cover ends — the footer fades, scales, and sharpens across its own height. The scrollbar stays visible.",
        },
      },
    },
    marketingPageCopySource,
  ),
  render: () => <MarketingPage />,
};
