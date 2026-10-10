import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { lockedViewportStory } from "../../lib/viewports";
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
├── {overlay}
└── article.band
    ├── header (col-span-full, lg:col-span-10) — Breadcrumb · h1 · lead · date / reading time (below lg, when the panel stacks after)
    ├── aside — here with metadataStack="before"
    ├── div (col-span-full, lg:col-span-8 or 9) — SectionCaption "Article" (p) · Prose
    └── aside — here with metadataStack="after" (default)
        (col-span-full, lg:col-span-4 or 3, lg:sticky) — SectionCaption "Metadata" · DescriptionList
        └── Date · Author · Reading time · Categories · Agents (stacked) · Share (stacked)
\`\`\`

**Beside the article, from \`lg\`.** The panel takes 4 of the 12 columns before the article (default). \`metadataSide="end"\` puts it after the article, and \`metadataColumns={3}\` narrows it to 3 columns, giving the article 9.

**Stacked, below \`lg\`.** \`metadataStack="after"\` (default) puts the article first and the panel under it, so a reader on a phone meets the article, not a table. A line under the title then carries what a reader wants first — the date and the reading time — and hides from \`lg\`, where the panel is beside the article and has both. \`metadataStack="before"\` stacks the panel above the article, with no line under the title.

**Reading and tab order.** \`metadataStack\` is also where the panel sits in the markup, at every width. \`"after"\` with \`metadataSide="end"\`, and \`"before"\` with \`"start"\`, match what is on screen at every width. The other two pairings move the panel to its side from \`lg\` with an order utility, so there its place on screen and its place in the tab order differ.

**The panel sticks from \`lg\`.** Beside the article it stays in view under the pinned **SiteNav** (\`top: calc(var(--site-nav-height) + 1rem)\`), so the share and copy actions are there wherever the reader stops. It is short enough never to need its own scroll. Below \`lg\` it scrolls with the page.

## Best practices

- **Do** pair \`metadataSide="end"\` with the default \`metadataStack="after"\` (or \`"start"\` with \`"before"\`) so the tab order matches the layout at every width.
- **Do** render the markdown with \`#\` mapped to \`h2\` — the title is the page's \`h1\`.
- **Do** map markdown links to **TextLink** with \`external\` for other sites.
- **Do** keep the panel to facts and actions about this post; related posts belong under the article.
- **Do** pass \`renderLink\` — \`(link) => <Link href={link.href} />\` — so the breadcrumb and the category tags use the app's router. Swapping an anchor in the pasted markup reads as drift.
- **Do** mount page-level layers (a **GridOverlay**) through \`overlay\` — it renders inside the page grid. Adding an element to the pasted markup reads as drift to \`wmds-check\`.
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
import { useEffect, useId, useState, type ReactElement, type ReactNode } from "react";
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

/** Where the metadata panel sits from lg: before the article (start) or after it (end). */
export type PostMetadataSide = "start" | "end";

/** Where the panel sits below lg, where it stacks: before the article or after it (default). */
export type PostMetadataStack = "before" | "after";

/** How many of the page's 12 columns the panel takes from lg; the article takes the rest. */
export type PostMetadataColumns = 3 | 4;

const metadataColumnClasses: Record<PostMetadataColumns, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

const articleColumnClasses: Record<PostMetadataColumns, string> = {
  3: "lg:col-span-9",
  4: "lg:col-span-8",
};

export interface PostPageProps {
  post: PostPageData;
  /** The post's rendered markdown. */
  children: ReactNode;
  /** Where the panel sits from lg, beside the article. Default: "start". */
  metadataSide?: PostMetadataSide;
  /** The panel's width from lg, in columns. Default: 4. */
  metadataColumns?: PostMetadataColumns;
  /**
   * Where the panel sits below lg, where it stacks. "after" (default) puts the article first, with
   * the date and reading time in a line under the title. It is also the panel's place in reading
   * and tab order at every width, so pair "after" with metadataSide="end" and "before" with "start".
   */
  metadataStack?: PostMetadataStack;
  /**
   * The router's link for the breadcrumb and the category tags, in place of a plain anchor —
   * (link) => <Link href={link.href} />.
   */
  renderLink?: (link: { label: string; href: string }) => ReactElement;
  /** Page-level layers inside the page grid — for example a GridOverlay. */
  overlay?: ReactNode;
}

/** A blog post: the title, a metadata panel, and the article, which is the rendered markdown. */
export function PostPage({
  post,
  children,
  metadataSide = "start",
  metadataColumns = 4,
  metadataStack = "after",
  renderLink,
  overlay,
}: PostPageProps) {
  const metadataHeadingId = useId();
  const encodedUrl = encodeURIComponent(post.url);
  const encodedTitle = encodeURIComponent(post.title);
  const stackedAfter = metadataStack === "after";
  // From lg the panel's side wins; the order utility moves it only when its side and its place
  // in the markup disagree.
  const panelOrder =
    metadataSide === "end" && !stackedAfter ? " lg:order-last" : metadataSide === "start" && stackedAfter ? " lg:order-1" : "";
  const articleOrder = metadataSide === "start" && stackedAfter ? " lg:order-2" : "";

  const panel = (
    <aside
      aria-labelledby={metadataHeadingId}
      className={
        "col-span-full lg:sticky lg:top-[calc(var(--site-nav-height)+1rem)] lg:mt-0 " +
        (stackedAfter ? "mt-10 " : "") +
        metadataColumnClasses[metadataColumns] +
        panelOrder
      }
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
            <Badge
              key={category.href}
              emphasis="outline"
              mono
              render={renderLink != null ? renderLink(category) : <a href={category.href} />}
            >
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
  );

  return (
    <main className="grid-page bg-body">
      {overlay}
      <article className="band py-6 sm:py-10 lg:py-14">
        <header className="col-span-full mb-4 flex flex-col gap-3 sm:mb-8 lg:col-span-10">
          <Breadcrumb
            items={post.breadcrumb}
            variant="mono"
            separator="slash"
            renderLink={renderLink}
            className="mb-3"
          />
          <h1 className="type-display-2 text-balance text-fg">{post.title}</h1>
          <p className="type-reading max-w-[40rem] text-muted">{post.description}</p>
          {stackedAfter ? (
            <p className="type-eyebrow text-muted lg:hidden">
              <time dateTime={post.date}>{post.dateLabel}</time>
              <span aria-hidden="true"> / </span>
              <span className="sr-only">, </span>
              {post.readingTime} read
            </p>
          ) : null}
        </header>

        {stackedAfter ? null : panel}

        <div
          className={
            "col-span-full lg:mt-0 " + (stackedAfter ? "" : "mt-6 ") + articleColumnClasses[metadataColumns] + articleOrder
          }
        >
          <SectionCaption as="p">Article</SectionCaption>
          <Prose className="mt-6">{children}</Prose>
        </div>

        {stackedAfter ? panel : null}
      </article>
    </main>
  );
}
`,
  ),
};

export const MetadataEnd: Story = {
  name: "Metadata on the right",
  render: () => <PostPageGuide metadataSide="end" metadataColumns={3} />,
  parameters: {
    docs: {
      description: {
        story:
          "`metadataSide=\"end\"` with `metadataColumns={3}`: from lg the panel takes the last 3 columns, after the article, and the article takes 9. Below lg it stacks above the article, as in the default.",
      },
    },
  },
};

export const StackedAfterPhone: Story = {
  name: "Stacked after — phone",
  render: () => <PostPageGuide metadataSide="end" metadataColumns={3} />,
  ...lockedViewportStory("mobile"),
};

export const StackedAfterTablet: Story = {
  name: "Stacked after — tablet",
  render: () => <PostPageGuide metadataSide="end" metadataColumns={3} />,
  ...lockedViewportStory("tablet"),
};

export const StackedAfterPhoneDark: Story = {
  name: "Stacked after — phone, dark",
  render: () => <PostPageGuide metadataSide="end" metadataColumns={3} />,
  ...lockedViewportStory("mobile"),
  globals: { ...lockedViewportStory("mobile").globals, theme: "dark" },
};

export const StackedAfterTabletDark: Story = {
  name: "Stacked after — tablet, dark",
  render: () => <PostPageGuide metadataSide="end" metadataColumns={3} />,
  ...lockedViewportStory("tablet"),
  globals: { ...lockedViewportStory("tablet").globals, theme: "dark" },
};

export const StackedBeforePhone: Story = {
  name: "Stacked before — phone",
  render: () => <PostPageGuide metadataStack="before" />,
  ...lockedViewportStory("mobile"),
};
