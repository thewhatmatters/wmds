import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { PostPageGuide } from "./PostPageExample";

const meta = {
  title: "Guides/Post page",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

A blog post page — a display title, a metadata panel, and the article. Copy **Pattern — post page**: pass the post's fields and its rendered markdown as children.

| Part | Component | Why |
|------|-----------|-----|
| Path | **Breadcrumb** \`variant="mono"\` \`separator="slash"\` | Home, Blog, a category, the post — in the captions' eyebrow caps |
| Title and lead | \`h1\` on \`type-display-2\`, lead on \`type-reading\` | The page's one heading; the lead at reading size, in the measure |
| Column captions | **SectionCaption** | "/ Metadata" names the panel (\`h2\`); "/ Article" only labels its column (\`as="p"\`) |
| Metadata | **DescriptionList** \`variant="mono"\` \`rule="dotted"\` | Name-and-value rows read as pairs; dotted rules sit quieter than the captions' |
| Author, categories | **Badge** \`emphasis="outline"\` \`mono\` | Categories are links (\`render={<a href />}\`) to the filtered blog |
| Copy for LLM | **Button** \`icon\` + \`status\` (**Pattern — copy button**) | The Copy glyph turns into the check; the result is announced |
| View as Markdown | **Button** \`render={<a href />}\` | Same-site link |
| Share | **Button** \`external\` | New tab, safe \`rel\`, spoken "opens in a new tab" |
| Article | **Prose** | Plain elements from the markdown, at \`type-reading\` on a 40rem measure |

## Anatomy

\`\`\`
main.grid-page
└── article.band
    ├── header (col-span-full, lg:col-span-10) — Breadcrumb · h1 · lead
    ├── aside (col-span-full, lg:col-span-4, lg:sticky) — SectionCaption "Metadata" · DescriptionList
    │   └── Date · Author · Reading time · Categories · Agents (stacked) · Share (stacked)
    └── div (col-span-full, lg:col-span-8) — SectionCaption "Article" (p) · Prose
\`\`\`

**The panel sticks from \`lg\`.** Beside the article it stays in view under the pinned **SiteNav** (\`top: calc(var(--site-nav-height) + 1rem)\`), so the share and copy actions are there wherever the reader stops. It is short enough never to need its own scroll. Below \`lg\` it stacks above the article and scrolls with the page.

## Best practices

- **Do** render the markdown with \`#\` mapped to \`h2\` — the title is the page's \`h1\`.
- **Do** map markdown links to **TextLink** with \`external\` for other sites.
- **Do** keep the panel to facts and actions about this post; related posts belong under the article.
- **Don't** wrap the page in another \`main\` — inside an app shell that already has one, change the pattern's \`main\` to a \`div\`.
- **Don't** let an ancestor clip overflow (\`overflow: hidden\`) — it stops the panel sticking.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PostPage: Story = {
  name: "Pattern — post page",
  render: () => <PostPageGuide />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Scroll the article: from lg the metadata panel stays in view. Below lg it stacks above the article. Open Layout to change the grid width or column gap live; Show code omits the Storybook-only inspector.",
        },
      },
    },
    `
import { useEffect, useId, useState, type ReactNode } from "react";
import { Copy, FileText } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  DescriptionList,
  Prose,
  SectionCaption,
  buttonStatusHoldMs,
  type BreadcrumbItemDef,
  type ButtonStatus,
} from "@thewhatmatters/wmds";

export interface PostCategory {
  label: string;
  href: string;
}

export interface PostPageData {
  /** The path to this post, ending with it — for example Home, Blog, Guides, this post. */
  breadcrumb: BreadcrumbItemDef[];
  title: string;
  description: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  dateLabel: string;
  author: string;
  /** For example "6 min". */
  readingTime: string;
  categories: PostCategory[];
  /** The post's own address, for the share links. */
  url: string;
  /** The post's markdown source, for Copy for LLM. */
  markdown: string;
  /** The post as plain markdown, for View as Markdown. */
  markdownHref: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Button
      role="secondary"
      size="sm"
      icon={<Copy />}
      status={status}
      statusLabels={{ success: "Copied", error: "Couldn't copy" }}
      onClick={copy}
    >
      {label}
    </Button>
  );
}

/** A blog post: the title, a metadata panel, and the article, which is the rendered markdown. */
export function PostPage({ post, children }: { post: PostPageData; children: ReactNode }) {
  const metadataHeadingId = useId();
  const encodedUrl = encodeURIComponent(post.url);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <main className="grid-page bg-body">
      <article className="band py-6 sm:py-10 lg:py-14">
        <header className="col-span-full mb-4 flex flex-col gap-3 sm:mb-8 lg:col-span-10">
          <Breadcrumb items={post.breadcrumb} variant="mono" separator="slash" className="mb-3" />
          <h1 className="type-display-2 text-balance text-fg">{post.title}</h1>
          <p className="type-reading max-w-[40rem] text-muted">{post.description}</p>
        </header>

        <aside
          aria-labelledby={metadataHeadingId}
          className="col-span-full lg:sticky lg:top-[calc(var(--site-nav-height)+1rem)] lg:col-span-4"
        >
          <SectionCaption id={metadataHeadingId}>Metadata</SectionCaption>
          <DescriptionList variant="mono" rule="dotted">
            <DescriptionList.Item name="Date">
              <time dateTime={post.date}>{post.dateLabel}</time>
            </DescriptionList.Item>
            <DescriptionList.Item name="Author">
              <Badge emphasis="outline" mono>
                {post.author}
              </Badge>
            </DescriptionList.Item>
            <DescriptionList.Item name="Reading time">{post.readingTime}</DescriptionList.Item>
            <DescriptionList.Item name="Categories">
              {post.categories.map((category) => (
                <Badge key={category.href} emphasis="outline" mono render={<a href={category.href} />}>
                  {category.label}
                </Badge>
              ))}
            </DescriptionList.Item>
            <DescriptionList.Item name="Agents" layout="stacked">
              <CopyButton text={post.markdown} label="Copy for LLM" />
              <Button role="secondary" size="sm" icon={<FileText />} render={<a href={post.markdownHref} />}>
                View as Markdown
              </Button>
            </DescriptionList.Item>
            <DescriptionList.Item name="Share" layout="stacked">
              <Button
                role="secondary"
                size="sm"
                external
                render={<a href={"https://x.com/intent/post?url=" + encodedUrl + "&text=" + encodedTitle} />}
              >
                Twitter/X
              </Button>
              <Button
                role="secondary"
                size="sm"
                external
                render={<a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl} />}
              >
                LinkedIn
              </Button>
            </DescriptionList.Item>
          </DescriptionList>
        </aside>

        <div className="col-span-full mt-6 lg:col-span-8 lg:mt-0">
          <SectionCaption as="p">Article</SectionCaption>
          <Prose className="mt-6">{children}</Prose>
        </div>
      </article>
    </main>
  );
}
`,
  ),
};
