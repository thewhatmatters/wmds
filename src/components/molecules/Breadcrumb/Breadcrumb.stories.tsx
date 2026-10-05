import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Breadcrumb, breadcrumbSeparators, breadcrumbVariants, type BreadcrumbItemDef } from "./Breadcrumb";

const shortPath: BreadcrumbItemDef[] = [
  { label: "Home", href: "#home" },
  { label: "Blog", href: "#blog" },
  { label: "How we scope a brand sprint" },
];

const longPath: BreadcrumbItemDef[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Northwind Health", href: "#northwind" },
  { label: "Design system", href: "#design-system" },
  { label: "Components", href: "#components" },
  { label: "Breadcrumb" },
];

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    separator: { control: "inline-radio", options: [...breadcrumbSeparators] },
    variant: { control: "inline-radio", options: [...breadcrumbVariants] },
    maxItems: { control: { type: "number", min: 3, max: 8 } },
    items: { control: false },
    renderLink: { control: false },
  },
  args: {
    items: longPath,
    maxItems: 4,
    separator: "chevron",
    variant: "sans",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

The path to the current page: links from the root, the current page last. Pass the path as \`items\`; a long path folds its middle into a "…" control that opens a menu of the hidden links.

| Pattern | Props |
|---------|--------|
| **Path** | \`items\` — \`{ label, href }\` from the root; the last item, without \`href\`, is the current page |
| **Long path** | \`maxItems\` (default 4) — keeps the first item and the last \`maxItems - 2\`; the middle goes into the "…" menu |
| **Separator** | \`separator\` — \`chevron\` (default) or \`slash\` |
| **Editorial** | \`variant="mono"\` — eyebrow caps; pairs with \`separator="slash"\` beside **SectionCaption** |
| **Router links** | \`renderLink={(item) => <Link href={item.href} />}\` — every crumb and menu link goes through it |

## Anatomy

\`\`\`
nav (aria-label "Breadcrumb")
└── ol
    ├── li — link (muted; underline and text-fg on hover)
    ├── li — separator (aria-hidden)
    ├── li — "…" IconButton (aria-expanded) → Dropdown.Menu of links
    ├── li — separator
    └── li — current page (aria-current="page")
\`\`\`

Long labels truncate (10rem on phones, 16rem from \`sm\`, 24rem from \`lg\`); the full label stays in the accessible name and the \`title\`.

**The "…" menu is a disclosure, not an action menu.** It is a list of links: opening it moves focus to the first link, the arrow keys move between them, Tab and Shift+Tab leave it, and Escape closes it and returns focus to the control.

## Best practices

- **Do** end the path with the current page, without \`href\`.
- **Do** pass \`renderLink\` in a router app so crumbs navigate client-side.
- **Do** keep the default \`maxItems\` — four crumbs read at a glance; raise it only on wide pages with short labels.
- **Don't** use it as the page's main navigation or as tabs — **SiteNav**, **Tab**.
- **Don't** put actions in the path — every crumb is a place.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Path: Story = {
  name: "Pattern — path",
  render: () => <Breadcrumb items={shortPath} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "A short path: links from the root, chevrons between them, the current page last.",
        },
      },
    },
    `
import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function PageBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} />;
}
`,
  ),
};

export const LongPath: Story = {
  name: "Pattern — long path",
  render: () => <Breadcrumb items={longPath} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Six crumbs: the first and the last two stay; the middle three fold into the \"…\" control. Open it for a menu of their links.",
        },
      },
    },
    `
import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function DeepBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} maxItems={4} />;
}
`,
  ),
};

export const RouterLinks: Story = {
  name: "Pattern — router links",
  render: () => <Breadcrumb items={longPath} renderLink={(item) => <a href={item.href} data-router-link="" />} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "In a Next.js app, `renderLink` returns your `Link` without children. Breadcrumb adds the label and the crumb's styling, in the path and in the \"…\" menu.",
        },
      },
    },
    `
import Link from "next/link";
import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function RoutedBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} renderLink={(item) => <Link href={item.href} />} />;
}
`,
  ),
};

export const Editorial: Story = {
  name: "Pattern — editorial",
  render: () => <Breadcrumb items={shortPath} variant="mono" separator="slash" />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Eyebrow caps with slashes — for editorial pages, beside **SectionCaption** and **IndexList** captions.",
        },
      },
    },
    `
import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function PostBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} variant="mono" separator="slash" />;
}
`,
  ),
};

export const Variants: Story = {
  name: "Reference — separators and variants",
  render: () => (
    <div className="flex flex-col gap-8">
      {breadcrumbVariants.map((variant) =>
        breadcrumbSeparators.map((separator) => (
          <section key={`${variant}-${separator}`} className="flex flex-col gap-2">
            <h2 className="type-eyebrow text-muted">
              variant=&quot;{variant}&quot; separator=&quot;{separator}&quot;
            </h2>
            <Breadcrumb
              items={longPath}
              variant={variant}
              separator={separator}
              labels={{ nav: `Breadcrumb, ${variant}, ${separator}` }}
            />
          </section>
        )),
      )}
    </div>
  ),
};

export const LongLabels: Story = {
  name: "Reference — long labels",
  render: () => (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        { label: "Resources for teams scoping their first brand and product engagement", href: "#resources" },
        { label: "A field guide to writing briefs that people finish reading, with templates and examples" },
      ]}
    />
  ),
};
