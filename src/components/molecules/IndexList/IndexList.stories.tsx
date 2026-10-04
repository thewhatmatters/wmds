import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { IndexList, indexListSizes, indexListTitleElements } from "./IndexList";

interface SamplePost {
  slug: string;
  title: string;
  href: string;
  date: string;
  dateLabel: string;
  description: string;
}

const samplePosts: SamplePost[] = [
  {
    slug: "brand-sprint",
    title: "How we scope a brand sprint",
    href: "#brand-sprint",
    date: "2026-09-14",
    dateLabel: "Sep 14, 2026",
    description: "Two weeks, one decision a day: the questions we ask before a sprint starts and what we hand over at the end.",
  },
  {
    slug: "design-system",
    title: "A design system that ships with the site",
    href: "#design-system",
    date: "2026-08-02",
    dateLabel: "Aug 2, 2026",
    description: "Why the components, the patterns, and the marketing site live in one release train.",
  },
  {
    slug: "writing-briefs",
    title: "Writing briefs people finish reading",
    href: "#writing-briefs",
    date: "2026-06-21",
    dateLabel: "Jun 21, 2026",
    description: "Short sentences, one ask per paragraph, and a done-when list.",
  },
  {
    slug: "studio-notes",
    title: "Studio notes: the first year",
    href: "#studio-notes",
    date: "2026-03-09",
    dateLabel: "Mar 9, 2026",
    description: "What changed in how we price, plan, and pick projects.",
  },
];

const meta = {
  title: "Components/IndexList",
  component: IndexList,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "inline-radio", options: [...indexListSizes] },
    titleAs: { control: "inline-radio", options: [...indexListTitleElements] },
    captions: { control: false },
    empty: { control: false },
    children: { control: false },
  },
  args: {
    size: "lg",
    titleAs: "h2",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Editorial index for list pages — a blog, case studies, resources. Each **IndexList.Item** is a ruled row with a **meta** column (a date), a large **title** that links, and an optional **preview** that a control at the row's end expands under the title.

| Pattern | Props |
|---------|--------|
| **Index with captions** | \`captions={{ meta, title }}\` — column captions on the rows' tracks (\`type-eyebrow\`) |
| **Linked title** | \`title\` + \`href\` on each item — a quiet **TextLink** inside the heading |
| **Preview** | \`preview\` on an item — **IconButton** disclosure; \`open\` / \`onOpenChange\` to control it |
| **Title scale** | \`size\` — \`lg\` type-display-3 (default), \`md\` type-heading-1, \`sm\` type-heading-3 |
| **Heading level** | \`titleAs\` — \`h2\` (default), \`h3\`, \`h4\` |
| **Empty state** | \`empty\` — shown between the rules when there are no rows |

## Anatomy

\`\`\`
IndexList
├── captions — meta | title, on the rows' two tracks (hidden while the list is one column)
└── ul
    └── IndexList.Item (li)
        ├── meta — caption type, tabular figures (above the title in one column)
        ├── title — h2 › TextLink variant="quiet"
        ├── IconButton — preview disclosure (aria-expanded, 44px)
        └── preview — motion-collapse panel under the title
\`\`\`

Once the list itself is 32rem wide (a container query) the rows are two tracks — the meta column (7.5rem) and the title — with the page grid's column gap; captions share those tracks, so each sits over its column. Narrower — on phones, or in a tablet column beside a filter panel — each row is one column and the captions are hidden.

A closed preview leaves the tab order and the accessibility tree once it has folded.

## Best practices

- **Do** pass a \`<time dateTime>\` as \`meta\` for dated entries.
- **Do** keep \`preview\` to a sentence or two — the title is the way in.
- **Do** place **IndexList** on **grid-page** through a \`band\` column span; \`className\` is layout only.
- **Do** pass \`empty\` when filters can remove every row.
- **Don't** put actions or forms inside \`preview\` — it is a summary, not a detail view.
- **Don't** use it for tabular data with many columns or sorting — **Table** is planned for that.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof IndexList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PostIndex: Story = {
  name: "Pattern — post index",
  render: (args) => (
    <IndexList
      {...args}
      aria-label="Posts"
      captions={{ meta: "Date", title: "Name" }}
      empty={<p className="type-body text-muted">No posts yet.</p>}
    >
      {samplePosts.map((post) => (
        <IndexList.Item
          key={post.slug}
          title={post.title}
          href={post.href}
          meta={<time dateTime={post.date}>{post.dateLabel}</time>}
          preview={<p>{post.description}</p>}
        />
      ))}
    </IndexList>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A dated post list: captions over the date and name columns, a display-size linked title, and a preview under each title. Pass the posts in; the empty slot covers a list with none.",
        },
      },
    },
    `
import { IndexList } from "@thewhatmatters/wmds";

export interface IndexPost {
  slug: string;
  title: string;
  href: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  dateLabel: string;
  description: string;
}

export function PostIndex({ posts }: { posts: IndexPost[] }) {
  return (
    <IndexList
      aria-label="Posts"
      captions={{ meta: "Date", title: "Name" }}
      empty={<p className="type-body text-muted">No posts yet.</p>}
    >
      {posts.map((post) => (
        <IndexList.Item
          key={post.slug}
          title={post.title}
          href={post.href}
          meta={<time dateTime={post.date}>{post.dateLabel}</time>}
          preview={<p>{post.description}</p>}
        />
      ))}
    </IndexList>
  );
}
`,
  ),
};

export const WithoutPreviews: Story = {
  name: "Reference — links only",
  render: () => (
    <IndexList aria-label="Posts" captions={{ meta: "Date", title: "Name" }}>
      {samplePosts.map((post) => (
        <IndexList.Item
          key={post.slug}
          title={post.title}
          href={post.href}
          meta={<time dateTime={post.date}>{post.dateLabel}</time>}
        />
      ))}
    </IndexList>
  ),
};

export const OpenPreview: Story = {
  name: "Reference — open preview",
  render: () => (
    <IndexList aria-label="Posts" captions={{ meta: "Date", title: "Name" }}>
      {samplePosts.slice(0, 2).map((post, index) => (
        <IndexList.Item
          key={post.slug}
          title={post.title}
          href={post.href}
          meta={<time dateTime={post.date}>{post.dateLabel}</time>}
          preview={<p>{post.description}</p>}
          defaultOpen={index === 0}
        />
      ))}
    </IndexList>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: () => (
    <div className="flex flex-col gap-12">
      {indexListSizes.map((size) => (
        <section key={size} className="flex flex-col gap-3">
          <h2 className="type-eyebrow text-muted">size=&quot;{size}&quot;</h2>
          <IndexList aria-label={`Posts, ${size}`} size={size} titleAs="h3">
            {samplePosts.slice(0, 2).map((post) => (
              <IndexList.Item
                key={post.slug}
                title={post.title}
                href={post.href}
                meta={<time dateTime={post.date}>{post.dateLabel}</time>}
                preview={<p>{post.description}</p>}
              />
            ))}
          </IndexList>
        </section>
      ))}
    </div>
  ),
};

export const Empty: Story = {
  name: "Reference — empty state",
  render: () => (
    <IndexList
      aria-label="Posts"
      captions={{ meta: "Date", title: "Name" }}
      empty={<p className="type-body text-muted">No posts match these filters.</p>}
    />
  ),
};
