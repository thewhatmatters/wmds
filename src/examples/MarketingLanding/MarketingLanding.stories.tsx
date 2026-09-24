import { useEffect, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { SiteNav } from "../../components/organisms/SiteNav/SiteNav";
import {
  SiteNavResourcesMenu,
  indentSiteNavResourcesMenuCopySource,
} from "../../components/organisms/SiteNav/siteNavResourcesSpecimen";
import { GridOverlay } from "../../lib/GridOverlay";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";

const meta = {
  title: "Examples/Marketing landing",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Page composition: **SiteNav** + \`grid-page\` hero. Scroll collapse: **Components/Navigation/SiteNav → Pattern — marketing header**. Mega body: paste **Pattern — mega menu** Show code (**SiteNav.Featured** / **ReadRow** / **MenuMedia**) — do not invent a one-section link grid.

## Anatomy

\`\`\`
SiteNav — Brand | Links + Menu | Sign in + CTA | mobile Sheet (expanded in flow; compact pins after scroll)
grid-page + band — hero + stacked sections
ExampleGridControls — Storybook-only
\`\`\`
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function MarketingLandingPage() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1280);
  const [columnGap, setColumnGap] = useState(24);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <main
      className="grid-page bg-body pb-16 [--grid-column-gap:24px] [--grid-max:80rem]"
      style={
        {
          "--grid-max": `${gridMax}px`,
          "--grid-column-gap": `${columnGap}px`,
        } as CSSProperties
      }
    >
      <GridOverlay visible={gridVisible} onVisibleChange={setGridVisible} keyboardShortcut={false} />
      <SiteNav
        start={
          <SiteNav.Brand
            href="#home"
            aria-label="WhatMatters"
            icon={<Sparkles strokeWidth={2} />}
          />
        }
        middle={
          <SiteNav.Links>
            <SiteNav.Link href="#product" current>
              Product
            </SiteNav.Link>
            <SiteNav.Link href="#pricing">Pricing</SiteNav.Link>
            <SiteNav.Link href="#customers">Customers</SiteNav.Link>
            <SiteNavResourcesMenu />
          </SiteNav.Links>
        }
        end={
          <>
            <Button role="ghost" size="sm" render={<a href="#signin" />} className="whitespace-nowrap">
              Sign in
            </Button>
            <Button role="primary" size="sm" render={<a href="#start" />} className="whitespace-nowrap">
              Get started
            </Button>
          </>
        }
        mobile={
          <>
            <SiteNav.MobileLink href="#product" current>
              Product
            </SiteNav.MobileLink>
            <SiteNav.MobileLink href="#pricing">Pricing</SiteNav.MobileLink>
            <SiteNav.MobileLink href="#customers">Customers</SiteNav.MobileLink>
            <SiteNav.MobileLink href="#blog">Blog</SiteNav.MobileLink>
          </>
        }
      />
      <div className="band pt-10">
        <div className="col-span-full flex flex-col gap-4 lg:col-span-8 lg:col-start-3">
          <p className="type-supporting font-medium uppercase tracking-wider text-muted">
            Marketing landing
          </p>
          <h1 className="type-display-2 text-fg">Plan the week around what matters.</h1>
          <p className="type-body max-w-prose text-muted">
            WhatMatters turns a noisy backlog into one calm list. Set priorities once and let the week
            reshuffle itself.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button role="primary" size="md" render={<a href="#start" />} className="whitespace-nowrap">
              Get started
            </Button>
            <Button role="secondary" size="md" render={<a href="#product" />} className="whitespace-nowrap">
              See product
            </Button>
          </div>
        </div>
      </div>
      <div id="product" className="band py-12">
        <div className="col-span-full lg:col-span-8 lg:col-start-3">
          <h2 className="type-heading-2 text-fg">Product</h2>
          <p className="type-body mt-3 max-w-prose text-muted">
            Short section — use the SiteNav Pattern story to exercise scroll collapse without a tall canvas.
          </p>
        </div>
      </div>
      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
      />
    </main>
  );
}

export const MarketingLanding: Story = {
  name: "Pattern — marketing landing",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Page composition with SiteNav. Mega body matches **SiteNav → Pattern — mega menu**. Scroll collapse: **Pattern — marketing header**. Press G for grid guides and T to cycle theme.",
        },
      },
    },
    `
import { Button, SiteNav } from "@whatmatters/wmds";
import { BookOpen, FileText, History, Mic, Sparkles, Target, Video } from "lucide-react";

export function MarketingLanding() {
  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:24px] [--grid-max:80rem]">
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
      <div className="band pt-10">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-8 lg:col-start-3">
          <h1 className="type-display-2 text-fg">Plan the week around what matters.</h1>
          <p className="type-body max-w-prose text-muted">
            WhatMatters turns a noisy backlog into one calm list.
          </p>
        </div>
      </div>
    </main>
  );
}
`,
  ),
  render: () => <MarketingLandingPage />,
};
