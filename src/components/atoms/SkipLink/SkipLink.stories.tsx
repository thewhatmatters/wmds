import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { TextLink } from "../TextLink/TextLink";
import { SkipLink } from "./SkipLink";

const meta = {
  title: "Components/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  args: {
    target: "main",
    children: "Skip to content",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

The first stop for Tab on a page: **"Skip to content"**, hidden until it has the focus. Someone on a keyboard or a switch presses Enter and lands in the page's \`main\`, instead of stepping through the header on every page.

| Page | Use |
|------|-----|
| A marketing or content page (your own header, **SiteNav**) | **SkipLink** first in \`body\`, \`main\` with \`id="main"\` |
| An app in **AppShell** | Nothing. **AppShell** carries its own |
| A long results page with filters before the list | A second **SkipLink** with \`target\` and its own words ("Skip to results") |

## Anatomy

\`\`\`
SkipLink (a href="#main")   — off screen; on focus, pinned over the top-start corner
…header, navigation…
main#main                   — takes the focus; the next Tab starts inside it
\`\`\`

Pressing it moves the focus without writing \`#main\` into the address, which a router may own. A region that can't take the focus gets \`tabindex="-1"\` when it's needed. Before the page's script runs, it is still a working in-page link.

## Best practices

- **Do** put it before everything else in \`body\`, so it is the first Tab stop on every page.
- **Do** point it at the region that holds the page's own content, usually \`main\`. Give that region \`outline-none\` if you don't want a ring around the whole page after the jump.
- **Do** keep the words short and about the destination: "Skip to content", "Skip to results".
- **Don't** show it all the time or hide it with \`display: none\`. It must be reachable by Tab and visible while focused.
- **Don't** add one inside **AppShell**. It has its own.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const navLinkClasses = "type-body";

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      {children}
      <header className="flex flex-wrap items-center gap-6 border-b border-border pb-4">
        <span className="type-heading-3 text-fg">Busby&rsquo;s</span>
        <nav aria-label="Main" className="flex flex-wrap gap-4">
          <TextLink href="#menu" variant="quiet" className={navLinkClasses}>
            Menu
          </TextLink>
          <TextLink href="#visit" variant="quiet" className={navLinkClasses}>
            Visit
          </TextLink>
          <TextLink href="#story" variant="quiet" className={navLinkClasses}>
            Our story
          </TextLink>
        </nav>
      </header>
      <main id="main" className="flex flex-col gap-2 outline-none">
        <h1 className="type-heading-2 m-0 text-fg">Wood-fired, every night</h1>
        <p className="type-body m-0 text-muted">
          Press Tab once to bring up the skip link, then Enter. The next Tab goes to the link below, not the header.
        </p>
        <p className="type-body m-0">
          <TextLink href="#book">Book a table</TextLink>
        </p>
      </main>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Page>
      <SkipLink {...args} />
    </Page>
  ),
};

export const PageFrame: Story = {
  name: "Pattern — page frame",
  render: () => (
    <Page>
      <SkipLink />
    </Page>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The frame of a page without AppShell: the skip link first, then the header, then `main` with the matching id.",
        },
      },
    },
    `
import type { ReactNode } from "react";
import { SkipLink } from "@thewhatmatters/wmds";

export interface PageFrameProps {
  /** The site header: logo and navigation. */
  header: ReactNode;
  /** The page's own content. */
  children: ReactNode;
  footer?: ReactNode;
}

export function PageFrame({ header, children, footer }: PageFrameProps) {
  return (
    <>
      <SkipLink />
      {header}
      <main id="main" className="outline-none">
        {children}
      </main>
      {footer}
    </>
  );
}
`,
  ),
};

export const OwnTarget: Story = {
  name: "Own target and words",
  render: () => (
    <div className="flex flex-col gap-4">
      <SkipLink target="results">Skip to results</SkipLink>
      <p className="type-body m-0 text-muted">Press Tab: this link jumps past the filters to the list.</p>
      <div className="flex flex-wrap gap-4">
        <TextLink href="#open">Open now</TextLink>
        <TextLink href="#patio">Patio</TextLink>
        <TextLink href="#late">Open late</TextLink>
      </div>
      <section id="results" aria-label="Results" className="flex flex-col gap-2 outline-none">
        <TextLink href="#one">Busby&rsquo;s</TextLink>
        <TextLink href="#two">The All Good</TextLink>
      </section>
    </div>
  ),
};
